export function roleToDashboard(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "decorator") return "/dashboard/decorator";
  return "/dashboard/user";
}
