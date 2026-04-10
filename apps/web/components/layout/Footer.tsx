import { Zap, Instagram, Youtube, Twitter } from "lucide-react";

const footerLinks = {
  Produto: [
    { label: "Funcionalidades", href: "#features" },
    { label: "Temas", href: "#themes" },
    { label: "Planos e preços", href: "#pricing" },
    { label: "Roadmap", href: "#" },
  ],
  Suporte: [
    { label: "Central de ajuda", href: "#" },
    { label: "Tutoriais em vídeo", href: "#" },
    { label: "E-mail de suporte", href: "#" },
    { label: "Status da plataforma", href: "#" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Programa de afiliados", href: "#" },
    { label: "Trabalhe conosco", href: "#" },
  ],
  Legal: [
    { label: "Termos de uso", href: "#" },
    { label: "Política de privacidade", href: "#" },
    { label: "Política de cookies", href: "#" },
    { label: "LGPD", href: "#" },
  ],
};

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container-max section-padding py-14">
        {/* Top */}
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Vendflow</span>
            </a>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              A plataforma completa para lojistas de cosméticos venderem online com estilo.
            </p>
            {/* Redes sociais */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Vendflow. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Feito com</span>
            <span className="text-red-400">♥</span>
            <span>para lojistas brasileiras</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
