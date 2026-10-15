-- Existing orders remain deliveries by default.
CREATE TYPE "FulfillmentMethod" AS ENUM ('DELIVERY', 'PICKUP');
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'CASH_ON_PICKUP';
ALTER TABLE "orders"
  ADD COLUMN "fulfillmentMethod" "FulfillmentMethod" NOT NULL DEFAULT 'DELIVERY';
