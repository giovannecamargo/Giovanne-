export function shouldShowAdminSignup(hasAdmin: boolean | undefined, invite: string) {
  return hasAdmin === false || invite.length > 0;
}

export function adminConfirmationUrl(origin: string, invite: string) {
  const url = new URL("/admin", origin);
  if (invite) url.searchParams.set("convite", invite);
  return url.toString();
}

export function passwordResetUrl(origin: string) {
  return new URL("/reset-password", origin).toString();
}
