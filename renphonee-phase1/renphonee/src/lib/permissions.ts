export type Role = "OWNER" | "ADMIN" | "STAFF";

// Tambah modul/aksi baru cukup di sini. "*" = semua, "modul:*" = semua aksi modul.
const MATRIX: Record<Role, string[]> = {
  OWNER: ["*"],
  ADMIN: ["product:*", "sale:*", "customer:*", "report:basic"],
  STAFF: ["sale:own", "attendance:self", "payslip:self"],
};

export function can(role: Role, permission: string): boolean {
  const [module] = permission.split(":");
  return MATRIX[role].some((p) => p === "*" || p === permission || p === `${module}:*`);
}

export function assertCan(role: Role, permission: string) {
  if (!can(role, permission)) throw new Error("Anda tidak punya akses untuk aksi ini.");
}
