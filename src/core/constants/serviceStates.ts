/**
 * Estados del Servicio
 * Trabajo Práctico: Marketplace de Servicios con Insumos
 * 
 * Flujo: PUBLICADO → EN_EVALUACION → ASIGNADO → COMPLETADO
 */

export const SERVICE_STATES = {
  PUBLICADO: 'PUBLICADO',
  EN_EVALUACION: 'EN_EVALUACION',
  ASIGNADO: 'ASIGNADO',
  COMPLETADO: 'COMPLETADO',
} as const;

export type ServiceState = typeof SERVICE_STATES[keyof typeof SERVICE_STATES];

/**
 * Mapeo de estados a nombres legibles
 */
export const SERVICE_STATE_NAMES: Record<ServiceState, string> = {
  [SERVICE_STATES.PUBLICADO]: 'Publicado',
  [SERVICE_STATES.EN_EVALUACION]: 'En Evaluación',
  [SERVICE_STATES.ASIGNADO]: 'Asignado',
  [SERVICE_STATES.COMPLETADO]: 'Completado',
};

/**
 * Colores para cada estado (Tailwind classes)
 */
export const SERVICE_STATE_COLORS: Record<ServiceState, string> = {
  [SERVICE_STATES.PUBLICADO]: 'bg-blue-100 text-blue-700',
  [SERVICE_STATES.EN_EVALUACION]: 'bg-yellow-100 text-yellow-700',
  [SERVICE_STATES.ASIGNADO]: 'bg-purple-100 text-purple-700',
  [SERVICE_STATES.COMPLETADO]: 'bg-green-100 text-green-700',
};

/**
 * Transiciones de estado permitidas
 */
export const ALLOWED_TRANSITIONS: Record<ServiceState, ServiceState[]> = {
  [SERVICE_STATES.PUBLICADO]: [SERVICE_STATES.EN_EVALUACION],
  [SERVICE_STATES.EN_EVALUACION]: [SERVICE_STATES.ASIGNADO],
  [SERVICE_STATES.ASIGNADO]: [SERVICE_STATES.COMPLETADO],
  [SERVICE_STATES.COMPLETADO]: [], // Estado final
};

/**
 * Verifica si una transición de estado es válida
 */
export const isValidTransition = (from: ServiceState, to: ServiceState): boolean => {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
};

/**
 * Verifica si se pueden recibir nuevas cotizaciones en este estado
 */
export const canReceiveQuotes = (state: ServiceState): boolean => {
  return state === SERVICE_STATES.PUBLICADO || state === SERVICE_STATES.EN_EVALUACION;
};

/**
 * Verifica si se pueden editar/retirar cotizaciones en este estado
 */
export const canEditQuotes = (state: ServiceState): boolean => {
  return state === SERVICE_STATES.PUBLICADO || state === SERVICE_STATES.EN_EVALUACION;
};

