import { Instagram, MessageCircle } from "lucide-react";
import { store } from "@/lib/mock-store";

export default function StoreFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: store.themeColor }}
            >
              {store.logoInitial}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{store.name}</p>
              <p className="text-xs text-gray-400">{store.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {store.instagram && (
              <a
                href={`https://instagram.com/${store.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                {store.instagram}
              </a>
            )}
            {store.whatsapp && (
              <a
                href={`https://wa.me/${store.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-white px-3 py-1.5 rounded-lg font-medium bg-green-500 hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Falar conosco
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {store.name}. Todos os direitos reservados.</p>
          <p>
            Loja criada com{" "}
            <a href="https://vendflow.com.br" className="font-semibold hover:underline" style={{ color: store.themeColor }}>
              Vendflow
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
