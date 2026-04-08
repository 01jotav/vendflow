"use client";

import { useActionState } from "react";
import { Zap, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="https://vendflow.com.br" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-white">Vendflow</span>
          </a>
          <p className="text-white/40 text-sm mt-2">Painel do lojista</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Bem-vinda de volta!</h1>
          <p className="text-gray-500 text-sm mb-6">Entre na sua conta para gerenciar sua loja.</p>

          {/* Erro global */}
          {state?.error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 disabled:opacity-50"
                disabled={isPending}
              />
              {state?.fieldErrors?.email && (
                <p className="mt-1 text-xs text-red-500">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <a href="#" className="text-xs text-primary-600 hover:underline font-medium">
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 pr-11 disabled:opacity-50"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {state?.fieldErrors?.password && (
                <p className="mt-1 text-xs text-red-500">{state.fieldErrors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-brand text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
              ) : (
                <><ArrowRight className="w-4 h-4" /> Entrar na minha conta</>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">ou</div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Não tem conta?{" "}
            <a href="/cadastro" className="text-primary-600 font-semibold hover:underline">
              Criar conta grátis
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          © 2025 Vendflow · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
