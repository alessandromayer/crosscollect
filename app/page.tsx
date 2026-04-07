import Link from "next/link";
import {
  Globe2,
  ArrowRight,
  ShieldX,
  Building2,
  Gavel,
  CheckCircle2,
  FileText,
  Bell,
  Landmark,
  DollarSign,
  Star,
  TrendingUp,
  Zap,
  Users,
  ShoppingCart,
  BookOpen,
  Package,
  Home,
  Briefcase,
  Code2,
  Stethoscope,
  ChevronRight,
  Play,
  Lock,
  BarChart3,
  Clock,
  Award,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAV ───────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">CrossCollect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              ["Como funciona", "#como-funciona"],
              ["Segmentos", "#segmentos"],
              ["Preços", "/planos"],
              ["Blog", "#"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-300 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Plataforma de cobrança internacional para o mercado brasileiro
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            Você tem dinheiro a{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              receber no Brasil.
            </span>
            <br />
            Nós cobramos por você.
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Somos o braço legal de credores estrangeiros no Brasil — combinamos régua de cobrança
            automatizada, negativação no Serasa, protesto em cartório e inteligência artificial para
            recuperar o que é seu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-2xl transition-all shadow-2xl shadow-blue-600/40 group"
            >
              Começar agora — grátis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-base rounded-2xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <Play className="w-4 h-4" />
              Ver demo
            </Link>
          </div>

          {/* Social proof numbers */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-10 border-t border-white/10">
            {[
              { value: "R$ 50M+", label: "em cobranças gerenciadas" },
              { value: "68%", label: "taxa média de recuperação" },
              { value: "200+", label: "credores internacionais" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-slate-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ──────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              O problema
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Credor estrangeiro no Brasil fica impotente
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Sem presença local, sem CPF/CNPJ, sem advogado brasileiro — você não tem como usar
              as ferramentas que realmente pressionam um devedor no Brasil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldX,
                color: "bg-red-50 text-red-600",
                border: "border-red-100",
                title: "Sem negativação no Serasa",
                desc: "Apenas empresas com CNPJ brasileiro podem incluir devedores nos bureaus de crédito. Seu nome, por mais que seja legítimo, não gera pressão alguma sobre o devedor brasileiro.",
              },
              {
                icon: Gavel,
                color: "bg-orange-50 text-orange-600",
                border: "border-orange-100",
                title: "Sem protesto em cartório",
                desc: "O protesto de títulos no Brasil exige representante legal local. Sem ele, você não consegue registrar a inadimplência em cartório — e o devedor sabe disso.",
              },
              {
                icon: Building2,
                color: "bg-amber-50 text-amber-600",
                border: "border-amber-100",
                title: "Sem ação judicial viável",
                desc: "Entrar com uma ação judicial no Brasil como credor estrangeiro custa caro, demora anos e exige caução. Na prática, é inviável para a maioria dos créditos.",
              },
            ].map(({ icon: Icon, color, border, title, desc }) => (
              <div
                key={title}
                className={`bg-white rounded-2xl p-7 border-2 ${border} shadow-sm`}
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUÇÃO / COMO FUNCIONA ───────────────────────────── */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              A solução
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Como a CrossCollect funciona
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Em 4 passos, transformamos seu crédito internacional em pagamento real.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

            {[
              {
                step: "01",
                icon: FileText,
                color: "bg-blue-600",
                title: "Cadastra a dívida",
                desc: "Em 4 passos você registra o devedor, o valor em moeda estrangeira e a documentação comprobatória.",
              },
              {
                step: "02",
                icon: Bell,
                color: "bg-indigo-600",
                title: "Régua automática",
                desc: "E-mails e WhatsApps automáticos em português, com tom progressivo de amigável a formal, nos dias 1, 7, 15 e 30.",
              },
              {
                step: "03",
                icon: Landmark,
                color: "bg-violet-600",
                title: "Serasa + Cartório",
                desc: "Caso não haja resposta, negativamos o CPF/CNPJ no Serasa Experian e protestamos o título em cartório.",
              },
              {
                step: "04",
                icon: DollarSign,
                color: "bg-emerald-600",
                title: "Recebe em moeda forte",
                desc: "Quando o pagamento ocorre, fazemos o repasse em USD, EUR ou GBP via transferência internacional.",
              },
            ].map(({ step, icon: Icon, color, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center px-6">
                <div
                  className={`relative z-10 w-20 h-20 ${color} rounded-2xl flex items-center justify-center shadow-xl mb-6`}
                >
                  <Icon className="w-8 h-8 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-slate-100 rounded-full text-slate-700 text-xs font-bold flex items-center justify-center shadow">
                    {step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/25"
            >
              Cadastrar minha primeira dívida
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-slate-400 text-sm mt-3">Grátis para até 5 dívidas · Sem cartão de crédito</p>
          </div>
        </div>
      </section>

      {/* ── SEGMENTOS ─────────────────────────────────────────── */}
      <section id="segmentos" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Quem atendemos
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Qualquer credor estrangeiro com devedores no Brasil
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              De startups SaaS a exportadores de equipamentos — cobramos por você, independente do setor.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Code2,
                label: "SaaS & Software",
                desc: "Licenças e assinaturas não pagas",
                color: "from-blue-50 to-indigo-50 border-blue-100",
                iconColor: "text-blue-600 bg-blue-100",
              },
              {
                icon: ShoppingCart,
                label: "E-commerce",
                desc: "Chargebacks e produtos não pagos",
                color: "from-violet-50 to-purple-50 border-violet-100",
                iconColor: "text-violet-600 bg-violet-100",
              },
              {
                icon: Briefcase,
                label: "Consultoria",
                desc: "Honorários e projetos em aberto",
                color: "from-slate-50 to-gray-50 border-slate-200",
                iconColor: "text-slate-600 bg-slate-100",
              },
              {
                icon: BookOpen,
                label: "Educação",
                desc: "Cursos, MBAs e mensalidades",
                color: "from-amber-50 to-yellow-50 border-amber-100",
                iconColor: "text-amber-600 bg-amber-100",
              },
              {
                icon: Package,
                label: "Equipamentos",
                desc: "Exportações e leasing industrial",
                color: "from-orange-50 to-red-50 border-orange-100",
                iconColor: "text-orange-600 bg-orange-100",
              },
              {
                icon: Home,
                label: "Imobiliário",
                desc: "Aluguéis e contratos internacionais",
                color: "from-emerald-50 to-green-50 border-emerald-100",
                iconColor: "text-emerald-600 bg-emerald-100",
              },
              {
                icon: Stethoscope,
                label: "Saúde",
                desc: "Serviços médicos prestados no exterior",
                color: "from-cyan-50 to-teal-50 border-cyan-100",
                iconColor: "text-cyan-600 bg-cyan-100",
              },
              {
                icon: Globe,
                label: "Outros setores",
                desc: "Qualquer dívida com devedor no Brasil",
                color: "from-pink-50 to-rose-50 border-pink-100",
                iconColor: "text-pink-600 bg-pink-100",
              },
            ].map(({ icon: Icon, label, desc, color, iconColor }) => (
              <div
                key={label}
                className={`bg-gradient-to-br ${color} border rounded-2xl p-5 hover:shadow-md transition-all group cursor-pointer`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
                Por que CrossCollect
              </p>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Tecnologia + presença jurídica no Brasil
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                Não somos só um software — temos estrutura operacional no Brasil com parceiros
                jurídicos, acesso direto ao Serasa Experian e rede de cartórios em todo o país.
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: Zap,
                    color: "bg-yellow-50 text-yellow-600",
                    title: "Régua inteligente com IA",
                    desc: "O assistente Claude analisa cada devedor e personaliza o tom e timing das comunicações.",
                  },
                  {
                    icon: Lock,
                    color: "bg-blue-50 text-blue-600",
                    title: "100% em conformidade com a LGPD",
                    desc: "Tratamento de dados conforme a lei brasileira de proteção de dados e o CDC.",
                  },
                  {
                    icon: BarChart3,
                    color: "bg-emerald-50 text-emerald-600",
                    title: "Dashboard em tempo real",
                    desc: "Acompanhe cada dívida, e-mail enviado e WhatsApp respondido em um único lugar.",
                  },
                  {
                    icon: Globe2,
                    color: "bg-violet-50 text-violet-600",
                    title: "Repasse em moeda estrangeira",
                    desc: "Receba em USD, EUR ou GBP direto na sua conta internacional via Wise ou SWIFT.",
                  },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{title}</p>
                      <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard preview card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 shadow-2xl">
                {/* Fake dashboard */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Globe2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">CrossCollect</span>
                  <span className="ml-auto text-slate-400 text-xs">Dashboard</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Em aberto", value: "$ 847.5k", up: true },
                    { label: "Recuperado", value: "$ 125k", up: true },
                    { label: "Taxa sucesso", value: "68.4%", up: true },
                    { label: "Casos ativos", value: "43", up: false },
                  ].map(({ label, value, up }) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3">
                      <p className="text-slate-400 text-xs">{label}</p>
                      <p className="text-white font-bold text-lg mt-0.5">{value}</p>
                      <span className={`text-xs font-medium ${up ? "text-emerald-400" : "text-slate-400"}`}>
                        {up ? "↑ +12.5%" : "ativos"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Fake bars */}
                <div className="bg-white/5 rounded-xl p-3 mb-3">
                  <p className="text-slate-400 text-xs mb-2">Recuperação mensal (USD)</p>
                  <div className="flex items-end gap-1.5 h-12">
                    {[30, 45, 38, 60, 72, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Fake list */}
                <div className="space-y-2">
                  {[
                    { name: "Carlos Mendonça Ltda", val: "$ 45k", status: "Em negociação", dot: "bg-blue-400" },
                    { name: "Tech Solutions Brasil", val: "$ 8.5k", status: "Pago", dot: "bg-emerald-400" },
                    { name: "Ana Paula Ferreira", val: "$ 15k", status: "Vencido", dot: "bg-red-400" },
                  ].map(({ name, val, status, dot }) => (
                    <div key={name} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <div className="w-6 h-6 bg-slate-600 rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{name[0]}</span>
                      </div>
                      <span className="text-slate-300 text-xs flex-1 truncate">{name}</span>
                      <span className="text-white text-xs font-semibold">{val}</span>
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        <span className="text-slate-400 text-[10px]">{status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-slate-100">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-sm">+$ 12.400</p>
                  <p className="text-slate-400 text-xs">recuperado hoje</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ───────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Depoimentos
            </p>
            <h2 className="text-4xl font-bold text-slate-900">
              Credores que recuperaram o que era deles
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                texto:
                  "Tínhamos R$ 280 mil parados há 2 anos com um distribuidor brasileiro. Em 45 dias a CrossCollect recuperou 100% do valor. Impensável pela via tradicional.",
                nome: "Stefan Müller",
                cargo: "CFO · Precision Tools GmbH",
                pais: "🇩🇪 Alemanha",
                stars: 5,
              },
              {
                texto:
                  "Nossa plataforma SaaS tinha dezenas de clientes brasileiros inadimplentes. A régua automática resolveu 68% deles sem intervenção manual. O ROI foi imediato.",
                nome: "Sarah Chen",
                cargo: "Head of Finance · CloudBase Inc.",
                pais: "🇺🇸 Estados Unidos",
                stars: 5,
              },
              {
                texto:
                  "O que me impressionou foi a conformidade com a LGPD. Como empresa europeia, o aspecto jurídico era crítico. A CrossCollect cobriu todos os ângulos.",
                nome: "Marie Dupont",
                cargo: "Legal Director · EduTech Paris",
                pais: "🇫🇷 França",
                stars: 5,
              },
            ].map(({ texto, nome, cargo, pais, stars }) => (
              <div key={nome} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{texto}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{nome[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{nome}</p>
                    <p className="text-slate-400 text-xs">{cargo}</p>
                  </div>
                  <span className="ml-auto text-sm">{pais}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS PREVIEW ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Preços
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Simples e transparente
          </h2>
          <p className="text-slate-500 text-lg mb-12">
            Comece grátis. Escale quando precisar.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              {
                nome: "Starter",
                preco: "Grátis",
                sub: "Para sempre",
                recursos: ["5 dívidas ativas", "IA (50 msg/mês)", "Régua básica", "1 usuário"],
                cta: "Começar grátis",
                destaque: false,
              },
              {
                nome: "Growth",
                preco: "$ 49",
                sub: "/mês",
                recursos: ["50 dívidas ativas", "IA (1.000 msg/mês)", "E-mail + WhatsApp", "3 usuários"],
                cta: "Assinar Growth",
                destaque: true,
              },
              {
                nome: "Professional",
                preco: "$ 149",
                sub: "/mês",
                recursos: ["Dívidas ilimitadas", "IA ilimitada", "Serasa + Cartório", "10 usuários"],
                cta: "Assinar Pro",
                destaque: false,
              },
            ].map(({ nome, preco, sub, recursos, cta, destaque }) => (
              <div
                key={nome}
                className={`rounded-2xl p-6 border-2 text-left ${
                  destaque
                    ? "bg-blue-600 border-blue-600 shadow-2xl shadow-blue-600/30 scale-105"
                    : "bg-white border-slate-200"
                }`}
              >
                <p className={`font-bold text-lg mb-1 ${destaque ? "text-white" : "text-slate-900"}`}>
                  {nome}
                </p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className={`text-3xl font-bold ${destaque ? "text-white" : "text-slate-900"}`}>
                    {preco}
                  </span>
                  <span className={`text-sm ${destaque ? "text-blue-200" : "text-slate-400"}`}>{sub}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {recursos.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${destaque ? "text-blue-200" : "text-emerald-500"}`}
                      />
                      <span className={destaque ? "text-blue-50" : "text-slate-600"}>{r}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    destaque
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>

          <Link
            href="/planos"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Ver todos os planos e comparativo completo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── MÉTRICAS ──────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "68%", label: "taxa média de recuperação", icon: TrendingUp },
              { value: "45 dias", label: "tempo médio de resolução", icon: Clock },
              { value: "200+", label: "credores internacionais", icon: Users },
              { value: "R$ 50M+", label: "gerenciados na plataforma", icon: Award },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-4xl font-bold text-white">{value}</p>
                <p className="text-slate-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Seu dinheiro no Brasil<br />está esperando por você.
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Crie sua conta em 2 minutos, cadastre sua primeira dívida e deixe a régua automática
            trabalhar por você. Sem burocracia, sem advogados, sem complicação.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 px-10 py-4 bg-white hover:bg-blue-50 text-blue-700 font-bold text-base rounded-2xl transition-all shadow-2xl group"
            >
              Criar conta gratuita
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-base rounded-2xl border border-white/30 transition-all"
            >
              <Play className="w-4 h-4" />
              Explorar o demo
            </Link>
          </div>
          <p className="text-blue-300 text-sm mt-6">
            Grátis para as primeiras 5 dívidas · Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg">CrossCollect</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Plataforma SaaS de cobrança internacional para credores estrangeiros com devedores no Brasil.
              </p>
              <div className="flex gap-3 mt-5">
                {["LinkedIn", "Twitter", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-xs text-slate-500 hover:text-white border border-slate-800 hover:border-slate-600 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Produto",
                links: ["Como funciona", "Preços", "Assistente IA", "Régua de cobrança", "API"],
              },
              {
                title: "Empresa",
                links: ["Sobre", "Blog", "Parceiros", "Imprensa", "Carreiras"],
              },
              {
                title: "Legal",
                links: ["Termos de uso", "Privacidade", "LGPD", "Cookies", "SLA"],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-semibold text-white text-sm mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} CrossCollect. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <span>Em conformidade com a LGPD · Lei 13.709/18</span>
              <span>CDC · Lei 8.078/90</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-600">Sistema operacional</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
