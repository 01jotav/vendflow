import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPresignedUpload } from "@/lib/r2";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.store?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { contentType, contentLength, folder } = body;

  if (!contentType || !contentLength || !folder) {
    return NextResponse.json({ error: "Parâmetros obrigatórios: contentType, contentLength, folder" }, { status: 400 });
  }

  const validFolders = ["products", "logos"];
  if (!validFolders.includes(folder)) {
    return NextResponse.json({ error: "Folder inválido" }, { status: 400 });
  }

  try {
    const result = await createPresignedUpload({
      folder,
      contentType,
      contentLength,
      storeId: session.user.store.id,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 422 });
  }
}
