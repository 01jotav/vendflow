export function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function storeUrl(slug: string) {
  const base = process.env.NEXT_PUBLIC_STORE_URL ?? "https://vendflow-store.vercel.app";
  return `${base}/${slug}`;
}
