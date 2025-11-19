export const ROLE_PERMISSIONS: Record<string, string[]> = {
  MANAGER: ["dashboard", "materials", "addMaterial", "updateMaterial", "users"],
  STORE_KEEPER: ["dashboard", "materials", "addMaterial", "updateMaterial"],
  ENGINEER: ["dashboard", "materials", "updateMaterial"],
  FOREMAN: ["updateMaterial"],
};
