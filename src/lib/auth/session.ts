import crypto from "crypto";

export function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function getPortalFromPath(pathname: string) {
  if (pathname.startsWith("/accounting")) {
    return "ACCOUNTING";
  }
  return "OPERATION";
}

export function getSessionCookieName(portal: "OPERATION" | "ACCOUNTING") {
  return portal === "ACCOUNTING" ? "dob_acc_session" : "dob_op_session";
}
