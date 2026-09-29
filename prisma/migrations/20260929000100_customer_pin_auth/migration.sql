ALTER TABLE "customers"
ADD COLUMN "pinHash" TEXT,
ADD COLUMN "pinFailedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "pinLockedUntil" TIMESTAMP(3),
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

CREATE TABLE "customer_email_challenges" (
    "id" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "codeHash" TEXT NOT NULL,
    "payload" JSONB,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_email_challenges_pkey"
    PRIMARY KEY ("id")
);

CREATE INDEX "customer_email_challenges_email_purpose_createdAt_idx"
ON "customer_email_challenges"("email", "purpose", "createdAt");

CREATE INDEX "customer_email_challenges_expiresAt_idx"
ON "customer_email_challenges"("expiresAt");
