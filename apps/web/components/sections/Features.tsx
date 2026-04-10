import {
  Palette,
  MessageCircle,
  CreditCard,
  LayoutTemplate,
  BarChart3,
  Package,
  Globe,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: LayoutTemplate,
    color: "bg-violet-100 text-primary-600",
    title: "4 temas exclusivos",
    description:
      "Escolha entre Modern, Young, Elegant e Minimal. Cada tema é pensado para um estilo diferente de negócio.",
  },
  {
    icon: Palette,
    color: "bg-pink-100 text-accent-600",
    title: "Personalização total",
    description:
      "Defina sua logo, cor tema, nome e descrição da loja. Sua identidade visual, do jeito que você quer.",
  },
  {
    icon: MessageCircle,
    color: "bg-green-100 text-green-600",
    title: "Gestão de pedidos",
    description:
      "Acompanhe cada pedido em tempo real, altere status e mantenha seus clientes informados.",
  },
  {
    icon: CreditCard,
    color: "bg-blue-100 text-blue-600",
    title: "Pagamentos online",
    description:
      "PIX, cartão de crédito e boleto integrados. Receba com segurança via Mercado Pago ou Stripe.",
  },
  {
    icon: Package,
    color: "bg-orange-100 text-orange-600",
    title: "Gestão de produtos",
    description:
      "Cadastre produtos com fotos, descrição, estoque e categorias. Simples e rápido.",
  },
  {
    icon: BarChart3,
    color: "bg-emerald-100 text-emerald-600",
    title: "Relatórios e métricas",
    description:
      "Acompanhe vendas, produtos mais pedidos e faturamento em tempo real no seu painel.",
  },
  {
    icon: Globe,
    color: "bg-cyan-100 text-cyan-600",
    title: "Loja pública otimizada",
    description:
      "Sua loja tem URL própria e é otimizada para SEO, garantindo que clientes te encontrem no Google.",
  },
  {
    icon: Shield,
    color: "bg-red-100 text-red-600",
    title: "Segurança e confiabilidade",
    description:
      "Certificado SSL, backups automáticos e 99.9% de uptime para sua loja nunca ficar fora do ar.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Tudo que você precisa para{" "}
            <span className="gradient-text-soft">vender mais</span>
          </h2>
          <p className="text-lg text-gray-500">
            Do cadastro da loja até a gestão dos pedidos, o
            Vendflow cuida de tudo para você focar no que importa: seus clientes.
          </p>
        </div>

        {/* Grid de features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-primary-100 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
