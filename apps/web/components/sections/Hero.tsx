import { ArrowRight, Star, ShoppingBag, Sparkles } from "lucide-react";
import { APP_URL } from "@/lib/urls";

const stats = [
  { value: "2.400+", label: "Lojistas ativos" },
  { value: "R$ 12M+", label: "Em vendas geradas" },
  { value: "98%", label: "Satisfação" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-dark">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-800/20 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container-max section-padding w-full pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Conteúdo esquerdo */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span className="text-sm text-white/80 font-medium">
                A plataforma nº1 para lojistas de cosméticos
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Sua loja de{" "}
              <span className="relative">
                <span className="gradient-text">cosméticos</span>
              </span>{" "}
              online em{" "}
              <span className="gradient-text">minutos</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Crie, personalize e venda. O Vendflow é a plataforma completa para
              lojistas que querem crescer online com estilo e pagamentos
              integrados.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <a
                href={`${APP_URL}/cadastro`}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-base bg-gradient-brand text-white shadow-xl shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-105 transition-all"
              >
                Começar grátis agora
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                Ver como funciona
              </a>
            </div>

            {/* Avaliações */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["bg-pink-400", "bg-violet-400", "bg-blue-400", "bg-emerald-400", "bg-orange-400"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${color} border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  )
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400" fill="#facc15" />
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-0.5">
                  +2.400 lojistas satisfeitas
                </p>
              </div>
            </div>
          </div>

          {/* Mockup direito */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative animate-float">
              {/* Card principal - mockup da loja */}
              <div className="w-72 sm:w-80 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header da loja mockup */}
                <div className="bg-gradient-brand p-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Bella Cosméticos</p>
                    <p className="text-white/60 text-xs">loja.vendflow.com.br</p>
                  </div>
                </div>

                {/* Produtos mockup */}
                <div className="p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Produtos em destaque
                  </p>
                  {[
                    { name: "Sérum Facial Vitamina C", price: "R$ 89,90", color: "bg-orange-100" },
                    { name: "Máscara Hidratante", price: "R$ 54,90", color: "bg-pink-100" },
                    { name: "Protetor Solar FPS 60", price: "R$ 67,90", color: "bg-yellow-100" },
                  ].map((product, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                      <div className={`w-10 h-10 rounded-xl ${product.color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-primary-600 font-semibold">{product.price}</p>
                      </div>
                      <button className="text-xs bg-gradient-brand text-white px-2.5 py-1 rounded-lg font-medium flex-shrink-0">
                        +
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer mockup */}
                <div className="px-4 pb-4">
                  <button className="w-full py-3 rounded-xl bg-gradient-brand text-white text-sm font-semibold">
                    Ver todos os produtos
                  </button>
                </div>
              </div>

              {/* Badge flutuante - Pedido */}
              <div className="absolute -left-6 top-1/3 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Pagamento confirmado!</p>
                  <p className="text-xs text-gray-500">PIX aprovado ✓</p>
                </div>
              </div>

              {/* Badge flutuante - Venda */}
              <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-500 mb-0.5">Nova venda</p>
                <p className="text-lg font-bold text-gray-900">R$ 89,90</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-xs text-green-600 font-medium">Aprovado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 lg:mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-sm text-white/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80L48 74.7C96 69.3 192 58.7 288 58.7C384 58.7 480 69.3 576 72C672 74.7 768 69.3 864 61.3C960 53.3 1056 42.7 1152 42.7C1248 42.7 1344 53.3 1392 58.7L1440 64V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
