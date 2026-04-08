import { ArrowRight, Star, ShoppingBag, Sparkles } from "lucide-react";

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
              lojistas que querem crescer online com estilo, pagamentos integrados
              e automações no WhatsApp.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <a
                href="https://app.vendflow.com.br/cadastro"
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

              {/* Badge flutuante - WhatsApp */}
              <div className="absolute -left-6 top-1/3 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Pedido confirmado!</p>
                  <p className="text-xs text-gray-500">Enviado no WhatsApp ✓</p>
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
