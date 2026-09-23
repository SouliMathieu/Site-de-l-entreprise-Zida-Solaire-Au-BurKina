CREATE TABLE "customer_push_tokens" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "deviceId" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "customer_push_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customer_push_tokens_token_key" ON "customer_push_tokens"("token");
CREATE INDEX "customer_push_tokens_customerId_active_idx" ON "customer_push_tokens"("customerId", "active");

ALTER TABLE "customer_push_tokens"
ADD CONSTRAINT "customer_push_tokens_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
