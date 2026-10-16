-- Read-only investigation: NO UPDATE or DELETE.
-- Prior releases linked guest orders to Customer records by phone;
-- the historical account ownership is not provable from the order alone.
SELECT
  COUNT(*) AS total_orders,
  COUNT(*) FILTER (WHERE "guestCheckout" = true) AS marked_guest,
  COUNT(*) FILTER (WHERE "guestCheckout" = false) AS marked_account,
  COUNT(*) FILTER (WHERE "stockReservedAt" IS NOT NULL) AS reserved_by_new_flow
FROM "orders";

SELECT
  o."id",
  o."orderNumber",
  o."createdAt",
  o."guestCheckout",
  o."customerId",
  o."customerPhone",
  (c."pinHash" IS NOT NULL) AS account_has_pin,
  (c."emailVerifiedAt" IS NOT NULL) AS email_verified,
  c."createdAt" AS customer_created_at,
  o."status"
FROM "orders" o
JOIN "customers" c ON c."id" = o."customerId"
WHERE o."guestCheckout" = false
  AND (
    c."pinHash" IS NULL
    OR c."emailVerifiedAt" IS NULL
    OR o."createdAt" < c."createdAt"
  )
ORDER BY o."createdAt" DESC
LIMIT 100;

-- Do not automatically reassign or disclose any orders flagged by this query.
-- Validate provenance using authorized administrative records.
