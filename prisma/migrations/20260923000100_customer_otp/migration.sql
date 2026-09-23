CREATE TABLE "customer_otp_challenges" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'login',
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_otp_challenges_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "customer_otp_challenges_phone_createdAt_idx"
ON "customer_otp_challenges"("phone", "createdAt");

CREATE INDEX "customer_otp_challenges_expiresAt_idx"
ON "customer_otp_challenges"("expiresAt");
