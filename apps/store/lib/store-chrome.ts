import type { StoreHeaderData } from "@/components/layout/StoreHeader";
import type { StoreFooterData } from "@/components/layout/StoreFooter";

export function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

type StoreChromeInput = {
  slug: string;
  name: string;
  description: string | null;
  themeColor: string;
};

export function buildStoreChrome(store: StoreChromeInput): {
  header: StoreHeaderData;
  footer: StoreFooterData;
} {
  const logoInitial = store.name.charAt(0).toUpperCase();
  return {
    header: { slug: store.slug, name: store.name, themeColor: store.themeColor, logoInitial },
    footer: { name: store.name, description: store.description, themeColor: store.themeColor, logoInitial },
  };
}
