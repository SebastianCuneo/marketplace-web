/**
 * Constantes de Roles del Sistema
 * Trabajo Práctico: Marketplace de Servicios con Insumos
 * 
 * IMPORTANTE: Usar SIEMPRE estas constantes, nunca strings hardcodeados
 */

export const ROLES = {
  SOLICITANTE: 'SOLICITANTE',
  PROVEEDOR_SERVICIO: 'PROVEEDOR_SERVICIO',
  PROVEEDOR_INSUMOS: 'PROVEEDOR_INSUMOS',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Mapeo de roles a nombres legibles
 */
export const ROLE_NAMES: Record<UserRole, string> = {
  [ROLES.SOLICITANTE]: 'Solicitante de Servicios',
  [ROLES.PROVEEDOR_SERVICIO]: 'Proveedor de Servicio',
  [ROLES.PROVEEDOR_INSUMOS]: 'Proveedor de Insumos',
};

/**
 * Verifica si un rol es válido
 */
export const isValidRole = (role: string): role is UserRole => {
  return Object.values(ROLES).includes(role as UserRole);
};

