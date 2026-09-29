BEGIN;

-- 1. Normaliser les numéros existants.
UPDATE "customers"
SET "phone" =
  CASE
    WHEN length(regexp_replace("phone", '[^0-9]', '', 'g')) = 8
      THEN '+226' || regexp_replace("phone", '[^0-9]', '', 'g')

    WHEN regexp_replace("phone", '[^0-9]', '', 'g') LIKE '226%'
      AND length(regexp_replace("phone", '[^0-9]', '', 'g')) = 11
      THEN '+' || regexp_replace("phone", '[^0-9]', '', 'g')

    WHEN btrim("phone") LIKE '+%'
      AND length(regexp_replace("phone", '[^0-9]', '', 'g')) BETWEEN 8 AND 15
      THEN '+' || regexp_replace("phone", '[^0-9]', '', 'g')

    ELSE btrim("phone")
  END;

-- 1b. Normaliser aussi les références téléphoniques
-- conservées dans les anciens challenges OTP/email.
UPDATE "customer_otp_challenges"
SET "phone" =
  CASE
    WHEN length(regexp_replace("phone", '[^0-9]', '', 'g')) = 8
      THEN '+226' || regexp_replace("phone", '[^0-9]', '', 'g')

    WHEN regexp_replace("phone", '[^0-9]', '', 'g') LIKE '226%'
      AND length(regexp_replace("phone", '[^0-9]', '', 'g')) = 11
      THEN '+' || regexp_replace("phone", '[^0-9]', '', 'g')

    WHEN btrim("phone") LIKE '+%'
      AND length(regexp_replace("phone", '[^0-9]', '', 'g')) BETWEEN 8 AND 15
      THEN '+' || regexp_replace("phone", '[^0-9]', '', 'g')

    ELSE btrim("phone")
  END;

UPDATE "customer_email_challenges"
SET "phone" =
  CASE
    WHEN "phone" IS NULL THEN NULL

    WHEN length(regexp_replace("phone", '[^0-9]', '', 'g')) = 8
      THEN '+226' || regexp_replace("phone", '[^0-9]', '', 'g')

    WHEN regexp_replace("phone", '[^0-9]', '', 'g') LIKE '226%'
      AND length(regexp_replace("phone", '[^0-9]', '', 'g')) = 11
      THEN '+' || regexp_replace("phone", '[^0-9]', '', 'g')

    WHEN btrim("phone") LIKE '+%'
      AND length(regexp_replace("phone", '[^0-9]', '', 'g')) BETWEEN 8 AND 15
      THEN '+' || regexp_replace("phone", '[^0-9]', '', 'g')

    ELSE btrim("phone")
  END
WHERE "phone" IS NOT NULL;

-- 2. Construire la liste des doublons et choisir
-- la meilleure fiche comme fiche principale.
CREATE TEMP TABLE "_customer_phone_merge" AS
WITH ranked AS (
  SELECT
    "id",
    "phone",
    FIRST_VALUE("id") OVER (
      PARTITION BY "phone"
      ORDER BY
        ("pinHash" IS NOT NULL) DESC,
        ("emailVerifiedAt" IS NOT NULL) DESC,
        ("email" IS NOT NULL AND "email" <> '') DESC,
        "updatedAt" DESC,
        "createdAt" ASC,
        "id" ASC
    ) AS "keeperId",
    ROW_NUMBER() OVER (
      PARTITION BY "phone"
      ORDER BY
        ("pinHash" IS NOT NULL) DESC,
        ("emailVerifiedAt" IS NOT NULL) DESC,
        ("email" IS NOT NULL AND "email" <> '') DESC,
        "updatedAt" DESC,
        "createdAt" ASC,
        "id" ASC
    ) AS "rowNumber"
  FROM "customers"
)
SELECT
  "id" AS "duplicateId",
  "keeperId"
FROM ranked
WHERE "rowNumber" > 1;

-- 3. Conserver les informations utiles provenant
-- éventuellement des anciennes fiches, sans jamais
-- transférer la vérification d'un email vers un autre email.
WITH best_duplicate AS (
  SELECT DISTINCT ON (merge."keeperId")
    merge."keeperId",
    NULLIF(duplicate."email", '') AS "email",
    duplicate."emailVerifiedAt",
    NULLIF(duplicate."address", '') AS "address"
  FROM "_customer_phone_merge" AS merge
  JOIN "customers" AS duplicate
    ON duplicate."id" = merge."duplicateId"
  ORDER BY
    merge."keeperId",
    (duplicate."emailVerifiedAt" IS NOT NULL) DESC,
    (NULLIF(duplicate."email", '') IS NOT NULL) DESC,
    duplicate."updatedAt" DESC
)
UPDATE "customers" AS keeper
SET
  "email" = COALESCE(
    NULLIF(keeper."email", ''),
    best."email"
  ),
  "emailVerifiedAt" =
    CASE
      WHEN keeper."emailVerifiedAt" IS NOT NULL
        THEN keeper."emailVerifiedAt"

      WHEN NULLIF(keeper."email", '') IS NULL
        THEN best."emailVerifiedAt"

      WHEN best."email" IS NOT NULL
        AND lower(best."email") =
            lower(keeper."email")
        THEN best."emailVerifiedAt"

      ELSE keeper."emailVerifiedAt"
    END,
  "address" = COALESCE(
    NULLIF(keeper."address", ''),
    best."address"
  ),
  "pinFailedAttempts" = 0,
  "pinLockedUntil" = NULL
FROM best_duplicate AS best
WHERE keeper."id" = best."keeperId";

-- 4. Rattacher toutes les commandes à la fiche principale.
UPDATE "orders" AS orders
SET "customerId" = merge."keeperId"
FROM "_customer_phone_merge" AS merge
WHERE orders."customerId" = merge."duplicateId";

-- 5. Préserver les demandes de récupération PIN encore actives.
UPDATE "customer_email_challenges" AS challenge
SET "payload" =
  jsonb_set(
    challenge."payload",
    '{customerId}',
    to_jsonb(merge."keeperId"::text),
    false
  )
FROM "_customer_phone_merge" AS merge
WHERE challenge."purpose" = 'reset_pin'
  AND challenge."payload" IS NOT NULL
  AND challenge."payload"->>'customerId' = merge."duplicateId";

-- 6. Supprimer uniquement les fiches devenues doublons.
DELETE FROM "customers" AS customer
USING "_customer_phone_merge" AS merge
WHERE customer."id" = merge."duplicateId";

-- 7. Harmoniser le numéro affiché dans les commandes.
UPDATE "orders" AS orders
SET "customerPhone" = customer."phone"
FROM "customers" AS customer
WHERE orders."customerId" = customer."id"
  AND orders."customerPhone" IS DISTINCT FROM customer."phone";

DROP TABLE "_customer_phone_merge";

-- 8. Empêcher définitivement deux fiches avec
-- exactement le même numéro canonique.
CREATE UNIQUE INDEX "customers_phone_key"
ON "customers"("phone");

COMMIT;
