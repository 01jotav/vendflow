export interface StoreFooterData {
  name: string;
  description?: string | null;
  themeColor: string;
  logoInitial: string;
}

export default function StoreFooter({ store }: { store: StoreFooterData }) {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: store.themeColor }}
          >
            {store.logoInitial}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{store.name}</p>
            {store.description && <p className="text-xs text-gray-400">{store.description}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {store.name}. Todos os direitos reservados.</p>
          <a
            href="https://wa.me/5551992148242?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20como%20criar%20uma%20loja%20com%20o%20Vendflow."
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            Loja criada com{" "}
            <span className="font-semibold" style={{ color: store.themeColor }}>
              Vendflow
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
