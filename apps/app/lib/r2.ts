import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

let _r2: S3Client | null = null;

function getR2(): S3Client {
  if (_r2) return _r2;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !publicUrl) {
    throw new Error(
      "Credenciais R2 não configuradas. Defina R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY e R2_PUBLIC_URL no .env"
    );
  }

  _r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _r2;
}

const BUCKET = process.env.R2_BUCKET_NAME ?? "vendflow";
const PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Gera uma presigned URL para upload direto ao R2.
 * Retorna { uploadUrl, publicUrl, key }.
 */
export async function createPresignedUpload(opts: {
  folder: string;
  contentType: string;
  contentLength: number;
  storeId: string;
}) {
  if (!ALLOWED_TYPES.includes(opts.contentType)) {
    throw new Error("Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou AVIF.");
  }
  if (opts.contentLength > MAX_SIZE) {
    throw new Error("Arquivo muito grande. Máximo: 5 MB.");
  }

  const ext = opts.contentType.split("/")[1].replace("jpeg", "jpg");
  const key = `${opts.folder}/${opts.storeId}/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: opts.contentType,
    ContentLength: opts.contentLength,
  });

  const uploadUrl = await getSignedUrl(getR2(), command, { expiresIn: 300 }); // 5 min

  return {
    uploadUrl,
    publicUrl: `${PUBLIC_URL}/${key}`,
    key,
  };
}
