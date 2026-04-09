-- CreateTable
CREATE TABLE "mercadopago_configs" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "mpUserId" TEXT,
    "liveMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "mercadopago_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mercadopago_configs_storeId_key" ON "mercadopago_configs"("storeId");

-- AddForeignKey
ALTER TABLE "mercadopago_configs" ADD CONSTRAINT "mercadopago_configs_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
