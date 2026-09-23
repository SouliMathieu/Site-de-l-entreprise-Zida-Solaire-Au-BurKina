CREATE TABLE "customer_notifications" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "phone" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "route" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "customer_notification_preferences" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderUpdates" BOOLEAN NOT NULL DEFAULT true,
    "installationUpdates" BOOLEAN NOT NULL DEFAULT true,
    "savUpdates" BOOLEAN NOT NULL DEFAULT true,
    "promotions" BOOLEAN NOT NULL DEFAULT false,
    "solarTips" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "customer_notification_preferences_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "customer_notifications_customerId_readAt_idx" ON "customer_notifications"("customerId", "readAt");
CREATE INDEX "customer_notifications_phone_createdAt_idx" ON "customer_notifications"("phone", "createdAt");
CREATE INDEX "customer_notifications_createdAt_idx" ON "customer_notifications"("createdAt");
CREATE UNIQUE INDEX "customer_notification_preferences_customerId_key" ON "customer_notification_preferences"("customerId");

ALTER TABLE "customer_notifications"
ADD CONSTRAINT "customer_notifications_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "customer_notification_preferences"
ADD CONSTRAINT "customer_notification_preferences_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
