import { db } from "./index";

interface RateLimitConfig {
  /** Prefixo do bucket, ex: "login", "signup" */
  prefix: string;
  /** Chave única (IP, email, etc.) */
  key: string;
  /** Máximo de tentativas permitidas na janela */
  maxAttempts: number;
  /** Janela em segundos */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Rate limiter baseado em banco de dados (Prisma).
 * Funciona cross-instance (serverless/Vercel) sem Redis.
 */
export async function checkRateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const bucketKey = `${config.prefix}:${config.key}`;
  const windowStart = new Date(Date.now() - config.windowSeconds * 1000);

  // Limpar entradas expiradas (fire-and-forget, não bloqueia o request)
  db.rateLimitEntry.deleteMany({
    where: { key: bucketKey, createdAt: { lt: windowStart } },
  }).catch(() => {});

  // Contar tentativas na janela
  const count = await db.rateLimitEntry.count({
    where: { key: bucketKey, createdAt: { gte: windowStart } },
  });

  if (count >= config.maxAttempts) {
    // Buscar a entrada mais antiga na janela pra calcular retry-after
    const oldest = await db.rateLimitEntry.findFirst({
      where: { key: bucketKey, createdAt: { gte: windowStart } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
    const retryAfterSeconds = oldest
      ? Math.ceil((oldest.createdAt.getTime() + config.windowSeconds * 1000 - Date.now()) / 1000)
      : config.windowSeconds;

    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, retryAfterSeconds) };
  }

  return { allowed: true, remaining: config.maxAttempts - count - 1, retryAfterSeconds: 0 };
}

/** Registra uma tentativa no bucket. Chamar APÓS validação falhar. */
export async function recordAttempt(prefix: string, key: string): Promise<void> {
  await db.rateLimitEntry.create({
    data: { key: `${prefix}:${key}` },
  });
}
