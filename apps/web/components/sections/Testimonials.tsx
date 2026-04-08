import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Fernanda Oliveira",
    role: "Dona da Loja Belle Beauté",
    location: "São Paulo, SP",
    avatar: "FO",
    avatarColor: "bg-pink-400",
    rating: 5,
    text: "Em menos de um dia já tinha minha loja funcionando com pagamento online. O WhatsApp automático foi o que mais me surpreendeu — meus clientes ficam muito mais seguros e eu economizo horas respondendo mensagens.",
    highlight: "Faturei R$ 3.200 no primeiro mês",
  },
  {
    name: "Juliana Mendes",
    role: "Empreendedora — Juliana Cosméticos",
    location: "Belo Horizonte, MG",
    avatar: "JM",
    avatarColor: "bg-violet-400",
    rating: 5,
    text: "Testei outras plataformas antes e eram muito complicadas. O Vendflow é diferente — em 15 minutos eu tinha escolhido o tema Young, colocado os meus produtos e compartilhado o link no Instagram. Simples assim.",
    highlight: "150+ pedidos em 2 meses",
  },
  {
    name: "Camila Rocha",
    role: "Consultora de Beleza",
    location: "Curitiba, PR",
    avatar: "CR",
    avatarColor: "bg-emerald-400",
    rating: 5,
    text: "O tema Elegant é perfeito para o meu público. Minha loja ficou com uma cara de butique de luxo e meus clientes elogiam toda vez. Vale muito mais do que o investimento mensal.",
    highlight: "Ticket médio aumentou 40%",
  },
  {
    name: "Tatiane Silva",
    role: "Revendedora de Cosméticos",
    location: "Fortaleza, CE",
    avatar: "TS",
    avatarColor: "bg-orange-400",
    rating: 5,
    text: "Antes eu vendia só pelo WhatsApp e perdia muito pedido. Agora tenho uma loja profissional, aceito PIX na hora e ainda recebo confirmação automática para minha cliente. Meu negócio cresceu demais!",
    highlight: "Saiu do WhatsApp para o e-commerce",
  },
  {
    name: "Priscila Nunes",
    role: "Empresária — Glam Store",
    location: "Recife, PE",
    avatar: "PN",
    avatarColor: "bg-blue-400",
    rating: 5,
    text: "O suporte é incrível. Tive uma dúvida sobre integração de pagamento e resolvi em minutos no chat. A plataforma é estável, nunca tive problema de loja fora do ar. Recomendo para qualquer lojista.",
    highlight: "Usa o Vendflow há 8 meses",
  },
  {
    name: "Amanda Costa",
    role: "Influenciadora & Lojista",
    location: "Rio de Janeiro, RJ",
    avatar: "AC",
    avatarColor: "bg-rose-400",
    rating: 5,
    text: "Indico o Vendflow para todas as minhas seguidoras que querem abrir uma loja de cosméticos. Tanto a configuração quanto a experiência do cliente final é muito fluida. Minha taxa de conversão melhorou muito.",
    highlight: "+R$ 8.000 em vendas no mês",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Quem usa,{" "}
            <span className="gradient-text-soft">recomenda</span>
          </h2>
          <p className="text-lg text-gray-500">
            Mais de 2.400 lojistas já transformaram seu negócio com o Vendflow.
          </p>
        </div>

        {/* Grid de depoimentos */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="break-inside-avoid bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all group"
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-primary-200 mb-3" fill="#ddd6fe" />

              {/* Estrelas */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400" fill="#facc15" />
                ))}
              </div>

              {/* Texto */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Highlight */}
              <div className="inline-flex items-center gap-1.5 bg-primary-50 px-3 py-1 rounded-full mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                <span className="text-xs font-semibold text-primary-600">
                  {testimonial.highlight}
                </span>
              </div>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div
                  className={`w-9 h-9 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
