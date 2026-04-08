import { UserPlus, Store, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Cadastre sua loja",
    description:
      "Crie sua conta em minutos. Adicione o nome da loja, faça upload da sua logo e escolha a cor que combina com sua marca.",
    highlight: "Sem cartão de crédito para começar",
  },
  {
    number: "02",
    icon: Store,
    title: "Configure e personalize",
    description:
      "Escolha um dos 4 temas exclusivos, adicione seus produtos com fotos e preços e conecte seu WhatsApp para automações.",
    highlight: "Configuração em menos de 10 minutos",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Compartilhe e venda",
    description:
      "Sua loja fica disponível com link próprio. Compartilhe nas redes sociais e comece a receber pedidos agora mesmo.",
    highlight: "Pagamentos direto na sua conta",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gray-50">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            Como funciona
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Do zero à sua loja{" "}
            <span className="gradient-text-soft">no ar</span>
          </h2>
          <p className="text-lg text-gray-500">
            Três passos simples e sua loja de cosméticos está pronta para vender.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Linha conectora (desktop) */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary-200 via-accent-300 to-primary-200" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Número + Ícone */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-brand shadow-xl shadow-primary-500/30 flex items-center justify-center z-10 relative">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white border-2 border-primary-200 text-xs font-black text-primary-600 flex items-center justify-center shadow-sm">
                      {index + 1}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all w-full">
                    <div className="text-xs font-bold text-gray-300 mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      <span className="text-xs font-semibold text-primary-600">
                        {step.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA central */}
        <div className="text-center mt-14">
          <a
            href="https://app.vendflow.com.br/cadastro"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-gradient-brand text-white shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all"
          >
            Criar minha loja agora
          </a>
          <p className="text-sm text-gray-400 mt-3">
            Grátis por 14 dias. Sem cartão de crédito.
          </p>
        </div>
      </div>
    </section>
  );
}
