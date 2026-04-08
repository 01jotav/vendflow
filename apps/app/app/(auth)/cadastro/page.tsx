"use client";

import { useActionState, useState } from "react";
import { Zap, ArrowRight, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { registerAction } from "@/app/actions/auth";

const benefits = [
  "14 dias grátis, sem cartão",
  "Loja online em minutos",
  "WhatsApp automático incluso",
  "Suporte em português",
];

export default function CadastroPage() {
  const [state, action, isPending] = useActionState(registerAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative grid lg:grid-cols-2 gap-8 items-center">
        {/* Benefícios — desktop */}
        <div className="hidden lg:block text-white">
          <a href="https://vendflow.com.br" className="inline-flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold">Vendflow</span>
          </a>

          <h2 className="text-3xl font-extrabold mb-3 leading-tight">
            Crie sua loja de cosméticos{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">agora mesmo</span>
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Junte-se a mais de 2.400 lojistas que já vendem online com o Vendflow.
          </p>

          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-400/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-400" strokeWidth={3} />
                </div>
                <span className="text-white/70 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Formulário */}
        <div>
          <div className="text-center mb-6 lg:hidden">
            <a href="https://vendflow.com.br" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">Vendflow</span>
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Criar conta grátis</h1>
            <p className="text-gray-500 text-sm mb-6">14 dias grátis. Sem cartão de crédito.</p>

            {/* Erro global */}
            {state?.error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
                {state.error}
              </div>
            )}

            <form action={action} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Seu nome</label>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Maria Silva"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 disabled:opacity-50"
                  disabled={isPending}
                />
                {state?.fieldErrors?.name && (
                  <p className="mt-1 text-xs text-red-500">{state.fieldErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da loja</label>
                <input
                  name="storeName"
                  type="text"
                  placeholder="Ex: Bella Cosméticos"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 disabled:opacity-50"
                  disabled={isPending}
                />
                {state?.fieldErrors?.storeName && (
                  <p className="mt-1 text-xs text-red-500">{state.fieldErrors.storeName[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
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

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-0.5 flex-shrink-0"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                  Concordo com os{" "}
                  <a href="#" className="text-primary-600 hover:underline font-medium">Termos de uso</a>{" "}
                  e{" "}
                  <a href="#" className="text-primary-600 hover:underline font-medium">Política de privacidade</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-brand text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Criando sua conta...</>
                ) : (
                  <><ArrowRight className="w-4 h-4" /> Criar minha conta</>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Já tem conta?{" "}
              <a href="/login" className="text-primary-600 font-semibold hover:underline">Entrar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
