-- CreateTable
-- Signed investor NDAs for the data room: the typed-name signature with its
-- evidence (version, time, IP, user agent) and the hash of the personal link.
CREATE TABLE "dataroom_ndas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firm" TEXT,
    "ndaVersion" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,
    "tokenHash" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "firstOpenedAt" TIMESTAMP(3),
    "lastOpenedAt" TIMESTAMP(3),
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dataroom_ndas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dataroom_ndas_tokenHash_key" ON "dataroom_ndas"("tokenHash");

-- CreateIndex
CREATE INDEX "dataroom_ndas_email_idx" ON "dataroom_ndas"("email");

-- CreateIndex
CREATE INDEX "dataroom_ndas_signedAt_idx" ON "dataroom_ndas"("signedAt");
