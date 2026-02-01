export type LoginRequestDTO = {
  identifier: string;
  password: string;
};

export type LoginResponseDTO = {
  userId: string;
  role: "SUPER_ADMIN" | "CASHIER" | "REPAIR_STAFF";
  displayName: string;
};

export type SessionDTO = {
  token: string;
  expiresAt: string;
};
