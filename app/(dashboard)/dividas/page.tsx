"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  FileText,
  Download,
} from "lucide-react";
import { mockDebts } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import type { DebtStatus } from "@/types";

const statusBadgeClass: Record<string, string> = {
  pendente: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  em_negociacao: "bg-blue-50 text-blue-700 border border-blue-200",
  pago: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  vencido: "bg-red-50 text-red-700 border border-red-200",
  cancelado: "bg-slate-100 text-slate-600 border border-slate-200",
};

const statusDot: Record<string, string> = {
  pendente: "bg-yellow-400",
  em_negociacao: "bg-blue-500",
  pago: "bg-emerald-500",
  vencido: "bg-red-500",
  cancelado: "bg-slate-400",
};

const statusFilters: { label: string; value: string }[] = [
  { label: "Todas", value: "all" },
  { label: "Pendentes", value: "pendente" },
  { label: "Em Negociação", value: "em_negociacao" },
  { label: "Vencidas", value: "vencido" },
  { label: "Pagas", value: "pago" },
];

export default function DividasPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"valor" | "data" | "nome">("data");

  const filtered = mockDebts.filter((d) => {
    const matchSearch =
      d.devedor.nome.toLowerCase().includes(search.toLowerCase()) ||
      d.descricao.toLowerCase().includes(search.toLowerCase()) ||
      d.devedor.cpf_cnpj.includes(search);
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAberto = filtered
    .filter((d) => d.status !== "pago" && d.status !== "cancelado")
    .reduce((s, d) => s + d.valor_brl, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dívidas</h1>
          <p className="text-slate-500 mt-0.5">
            {filtered.length} registros encontrados · {formatCurrency(totalAberto)} em aberto
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-all text-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <Link
            href="/dividas/nova"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Nova Dívida
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-100">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por devedor, descrição ou CPF/CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all">
              <Filter className="w-3.5 h-3.5" />
              Filtros
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Ordenar
            </button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="px-6 py-3 flex items-center gap-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === f.value
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {f.label}
              {f.value !== "all" && (
                <span
                  className={`ml-1.5 text-xs ${
                    statusFilter === f.value ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  {mockDebts.filter((d) => d.status === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Devedor
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Descrição
              </th>
              <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Valor
              </th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Moeda
              </th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Vencimento
              </th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">Nenhuma dívida encontrada</p>
                  <p className="text-slate-300 text-sm mt-1">Tente ajustar os filtros ou adicione uma nova dívida</p>
                </td>
              </tr>
            ) : (
              filtered.map((debt) => (
                <tr key={debt.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-600 font-bold text-sm">
                          {debt.devedor.nome.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate max-w-[180px]">
                          {debt.devedor.nome}
                        </p>
                        <p className="text-slate-400 text-xs">{debt.devedor.cpf_cnpj}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-slate-700 text-sm truncate max-w-[220px]">{debt.descricao}</p>
                    <p className="text-slate-400 text-xs">{debt.devedor.cidade}/{debt.devedor.estado}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatCurrency(debt.valor_original, debt.moeda_original)}
                    </p>
                    <p className="text-slate-400 text-xs">{formatCurrency(debt.valor_brl)}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                      {debt.moeda_original}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`text-sm font-medium ${
                        new Date(debt.data_vencimento) < new Date() && debt.status !== "pago"
                          ? "text-red-600"
                          : "text-slate-600"
                      }`}
                    >
                      {formatDate(debt.data_vencimento)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeClass[debt.status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[debt.status]}`} />
                      {getStatusLabel(debt.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/dividas/${debt.id}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        title="Mais opções"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-medium">{filtered.length}</span> de{" "}
            <span className="font-medium">{mockDebts.length}</span> registros
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all">
              Anterior
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-all">
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
