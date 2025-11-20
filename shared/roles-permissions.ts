export const ROLE_PERMISSIONS: Record<string, string[]> = {
  MANAGER: ["dashboard", "materials", "addMaterial", "updateMaterial", "users"],
  STORE_KEEPER: ["dashboard", "materials", "addMaterial", "updateMaterial"],
  ENGINEER: ["dashboard", "materials", "updateMaterial"],
  FOREMAN: ["updateMaterial"],
};

export const ROLE_OPTIONS = [
  { value: 1, label: "Manager" },
  { value: 2, label: "Engineer" },
  { value: 3, label: "Store Keeper" },
  { value: 4, label: "Foreman" },
];
