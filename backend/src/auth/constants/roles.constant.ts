export const USER_ROLES = {
  ADMIN: 'Administrador',
  CLIENT: 'Cliente',
  RESIDENT: 'Residente',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
