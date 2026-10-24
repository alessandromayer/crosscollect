"""Disposable staging-only HTTP/session regression check. Requires preprovisioned fixtures.

TEST_AUTH_FIXTURES points to JSON {"users":[{id,email,password,name,credor,debt}, ...]}.
The first two users own one debt each; an optional third user has no company.
Uses only .invalid email fixtures and the crosscollect-staging project.
No signup, messages, collection integrations or administrative API keys are used.
"""
import json
import os
from pathlib import Path
import subprocess
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, HTTPRedirectHandler, build_opener

ROOT = Path(__file__).resolve().parents[2]
STAGING = "https://nkwdszlvtkzpssqqlzwn.supabase.co"
fixtures = json.loads(Path(os.environ["TEST_AUTH_FIXTURES"]).read_text())["users"]
assert all(u["email"].endswith("@example.invalid") for u in fixtures)
env = dict(os.environ)
for line in (ROOT / ".env.local").read_text().splitlines():
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env.setdefault(k, v)
assert env["NEXT_PUBLIC_SUPABASE_URL"] == STAGING, "Refusing a non-staging project"
key = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None

opener = build_opener(NoRedirect)

def request(url, method="GET", body=None, cookie=None, headers=None):
    h = {"Content-Type": "application/json", **(headers or {})}
    if cookie:
        h["Cookie"] = cookie
    data = None if body is None else json.dumps(body).encode()
    try:
        result = opener.open(Request(url, data=data, method=method, headers=h), timeout=25)
    except HTTPError as error:
        result = error
    raw = result.read().decode()
    try:
        payload = json.loads(raw)
    except ValueError:
        payload = raw
    return result.code, payload, result.headers

def session_cookie(session):
    # Exact session format and chunk size used by auth-helpers-shared 0.7.x.
    value = json.dumps([session["access_token"], session["refresh_token"], None, None,
                        session.get("user", {}).get("factors")], separators=(",", ":"))
    key_name = "sb-nkwdszlvtkzpssqqlzwn-auth-token"
    chunks = [value[i:i+3180] for i in range(0, len(value), 3180)]
    return "; ".join(f"{key_name if len(chunks)==1 else key_name+'.'+str(i)}={quote(chunk, safe='')}"
                     for i, chunk in enumerate(chunks))

sessions = []
for user in fixtures:
    status, session, _ = request(STAGING + "/auth/v1/token?grant_type=password", "POST",
                                 {"email": user["email"], "password": user["password"]},
                                 headers={"apikey": key})
    assert status == 200, ("Password login failed", user["name"], status)
    sessions.append(session)
    print("PASS password login", user["name"], flush=True)

base = "http://localhost:3102"
with open(os.environ.get("TEST_SERVER_LOG", "/tmp/crosscollect-auth-http.log"), "w") as log:
    server = subprocess.Popen(["node", "node_modules/next/dist/bin/next", "start", "--port", "3102"],
                              cwd=ROOT, env=env, stdout=log, stderr=log)
    try:
        for _ in range(100):
            try:
                request(base + "/login")
                break
            except URLError:
                time.sleep(.1)
        for index, user in enumerate(fixtures[:2]):
            cookie = session_cookie(sessions[index])
            status, debts, _ = request(base + "/api/dividas", cookie=cookie)
            assert status == 200 and len(debts) == 1 and debts[0]["id"] == user["debt"], ("Own debt list", status)
            if os.environ.get("TEST_SKIP_PAGE_RENDER") != "1":
                status, html, _ = request(base + "/dashboard", cookie=cookie)
                assert status == 200 and user["email"] in html and user["name"] in html, ("Server-rendered identity", status)
                assert request(base + "/dashboard", cookie=cookie)[0] == 200
            else:
                print("SKIP authenticated page render: Edge-runtime networking unavailable", flush=True)
            assert request(base + "/api/dividas", cookie=cookie)[0] == 200
            other = fixtures[1-index]
            path = base + "/api/dividas/" + other["debt"]
            assert request(path, cookie=cookie)[0] == 404
            assert request(path, "PATCH", {"status": "cancelado"}, cookie)[0] == 404
            assert request(path + "/pagamento", cookie=cookie)[0] == 404
            status, metrics, _ = request(base + "/api/dashboard/metrics", cookie=cookie)
            assert status == 200 and metrics["totalDebts"] == 1
            print("PASS cookie session reuse and tenant HTTP isolation", user["name"], flush=True)
        if len(fixtures) > 2:
            cookie = session_cookie(sessions[2])
            for path in ["/api/dividas", "/api/dashboard/metrics"]:
                assert request(base + path, cookie=cookie)[0] == 403
            print("PASS unlinked account HTTP access denied", flush=True)
        for session in sessions:
            status, _, _ = request(STAGING + "/auth/v1/logout?scope=local", "POST",
                                   headers={"apikey": key, "Authorization": "Bearer " + session["access_token"]})
            assert status in (200, 204), ("Local logout failed", status)
        assert request(base + "/api/dividas")[0] == 401
        status, _, headers = request(base + "/dashboard")
        assert status == 307 and "/login" in headers["Location"]
        print("PASS logout endpoint and cleared-cookie access denied", flush=True)
    finally:
        server.terminate()
        server.wait(timeout=10)
