CREATE TABLE "customer_notification_preferences" (
    "customerId" TEXT NOT NULL,
    "orderUpdates" BOOLEAN NOT NULL DEFAULT true,
    "installationUpdates" BOOLEAN NOT NULL DEFAULT true,
    "savUpdates" BOOLEAN NOT NULL DEFAULT true,
    "promotions" BOOLEAN NOT NULL DEFAULT false,
    "solarTips" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_notification_preferences_pkey"
        PRIMARY KEY ("customerId")
);

CREATE TABLE "customer_notification_reads" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_notification_reads_pkey"
        PRIMARY KEY ("id")
);

CREATE TABLE "customer_push_tokens" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "deviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_push_tokens_pkey"
        PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX
    "customer_notification_reads_customerId_notificationId_key"
ON "customer_notification_reads"("customerId", "notificationId");

CREATE INDEX
    "customer_notification_reads_customerId_readAt_idx"
ON "customer_notification_reads"("customerId", "readAt");

CREATE UNIQUE INDEX
    "customer_push_tokens_token_key"
ON "customer_push_tokens"("token");

CREATE INDEX
    "customer_push_tokens_customerId_idx"
ON "customer_push_tokens"("customerId");

ALTER TABLE "customer_notification_preferences"
ADD CONSTRAINT "customer_notification_preferences_customerId_fkey"
FOREIGN KEY ("customerId")
REFERENCES "customers"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "customer_notification_reads"
ADD CONSTRAINT "customer_notification_reads_customerId_fkey"
FOREIGN KEY ("customerId")
REFERENCES "customers"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "customer_push_tokens"
ADD CONSTRAINT "customer_push_tokens_customerId_fkey"
FOREIGN KEY ("customerId")
REFERENCES "customers"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
