export function getJwtSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET_NOT_CONFIGURED");
  }

  return secret;
}
