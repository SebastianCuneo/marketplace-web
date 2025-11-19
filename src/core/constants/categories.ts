/**
 * Categorías UNIFICADAS para Servicios e Insumos
 * Trabajo Práctico: Marketplace de Servicios con Insumos
 * 
 * IMPORTANTE: Usar estas categorías en TODA la aplicación para mantener consistencia
 */

export const CATEGORIES = {
  CONSTRUCCION: 'Construcción',
  ELECTRICIDAD: 'Electricidad',
  PLOMERIA: 'Plomería',
  PINTURA: 'Pintura',
  JARDINERIA: 'Jardinería',
  LIMPIEZA: 'Limpieza',
  PISCINAS: 'Piscinas',
  QUIMICOS_PISCINA: 'Químicos para Piscina',
  REVESTIMIENTOS: 'Revestimientos',
  HERRAMIENTAS: 'Herramientas',
  OTROS: 'Otros',
} as const;

export const CATEGORIES_ARRAY = Object.values(CATEGORIES);

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

// Alias para compatibilidad con código existente
export const SERVICE_CATEGORIES = CATEGORIES;
export type ServiceCategory = Category;

/**
 * Unidades de medida para insumos
 */
export const UNITS = {
  UNIDADES: 'unidades',
  KILOGRAMOS: 'kg',
  LITROS: 'litros',
  METROS: 'metros',
  METROS_CUADRADOS: 'm²',
  SACOS: 'saco',
  CAJAS: 'caja',
  PAQUETES: 'paquete',
} as const;

export const UNITS_OPTIONS = [
  { value: UNITS.UNIDADES, label: 'Unidad' },
  { value: UNITS.KILOGRAMOS, label: 'Kilogramo (kg)' },
  { value: UNITS.LITROS, label: 'Litro' },
  { value: UNITS.METROS, label: 'Metro' },
  { value: UNITS.METROS_CUADRADOS, label: 'Metro cuadrado (m²)' },
  { value: UNITS.SACOS, label: 'Saco' },
  { value: UNITS.CAJAS, label: 'Caja' },
  { value: UNITS.PAQUETES, label: 'Paquete' },
] as const;

export type Unit = typeof UNITS[keyof typeof UNITS];

