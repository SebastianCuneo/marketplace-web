/**
 * Categorías de Servicios
 * Trabajo Práctico: Marketplace de Servicios con Insumos
 */

export const SERVICE_CATEGORIES = {
  JARDINERIA: 'jardineria',
  PISCINAS: 'piscinas',
  LIMPIEZA: 'limpieza',
  CONSTRUCCION: 'construccion',
  ELECTRICIDAD: 'electricidad',
  PLOMERIA: 'plomeria',
  PINTURA: 'pintura',
  OTROS: 'otros',
} as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES];

/**
 * Nombres legibles de categorías
 */
export const CATEGORY_NAMES: Record<ServiceCategory, string> = {
  [SERVICE_CATEGORIES.JARDINERIA]: 'Jardinería',
  [SERVICE_CATEGORIES.PISCINAS]: 'Piscinas',
  [SERVICE_CATEGORIES.LIMPIEZA]: 'Limpieza',
  [SERVICE_CATEGORIES.CONSTRUCCION]: 'Construcción',
  [SERVICE_CATEGORIES.ELECTRICIDAD]: 'Electricidad',
  [SERVICE_CATEGORIES.PLOMERIA]: 'Plomería',
  [SERVICE_CATEGORIES.PINTURA]: 'Pintura',
  [SERVICE_CATEGORIES.OTROS]: 'Otros',
};

/**
 * Unidades de medida para insumos
 */
export const UNITS = {
  LITROS: 'lts',
  KILOGRAMOS: 'kg',
  GRAMOS: 'g',
  METROS: 'm',
  METROS_CUADRADOS: 'm2',
  METROS_CUBICOS: 'm3',
  UNIDADES: 'unidad',
  SACOS: 'saco',
  CAJAS: 'caja',
} as const;

export type Unit = typeof UNITS[keyof typeof UNITS];

/**
 * Nombres legibles de unidades
 */
export const UNIT_NAMES: Record<Unit, string> = {
  [UNITS.LITROS]: 'Litros',
  [UNITS.KILOGRAMOS]: 'Kilogramos',
  [UNITS.GRAMOS]: 'Gramos',
  [UNITS.METROS]: 'Metros',
  [UNITS.METROS_CUADRADOS]: 'Metros Cuadrados',
  [UNITS.METROS_CUBICOS]: 'Metros Cúbicos',
  [UNITS.UNIDADES]: 'Unidades',
  [UNITS.SACOS]: 'Sacos',
  [UNITS.CAJAS]: 'Cajas',
};

