/**
 * Modelos de Datos según Especificación del Trabajo Práctico
 * Marketplace de Servicios con Insumos
 */

import { UserRole } from '../constants/roles';
import { ServiceState } from '../constants/serviceStates';
import { ServiceCategory, Unit } from '../constants/categories';

/**
 * Usuario (hardcodeado)
 */
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  password?: string; // Para auth hardcodeada
}

/**
 * Insumo Requerido en un Servicio
 */
export interface InsumoRequerido {
  nombre: string;
  cantidad: number;
  unidad: Unit;
}

/**
 * Servicio publicado por un Solicitante
 */
export interface Service {
  id: string;
  solicitanteId: string;
  titulo: string;
  descripcion: string;
  categoria: ServiceCategory;
  direccion: string;
  ciudad: string;
  fechaPreferida: string; // ISO Date string
  insumosRequeridos: InsumoRequerido[];
  estado: ServiceState;
  cotizacionSeleccionadaId?: string;
  createdAt: string;
}

/**
 * Cotización de un Proveedor de Servicio
 */
export interface Quote {
  id: string;
  serviceId: string;
  proveedorId: string;
  proveedorNombre?: string; // Desnormalizado para UI
  precio: number;
  plazoDias: number;
  detalle?: string;
  itemsIncluidos?: string[]; // Lista de qué incluye
  itemsExcluidos?: string[]; // Lista de qué NO incluye
  ratingProveedorMock?: number; // 1-5 (hardcodeado)
  createdAt: string;
  canEdit?: boolean; // Calculado: si el servicio aún permite edición
}

/**
 * Insumo en el catálogo de un Proveedor de Insumos
 */
export interface Supply {
  id: string;
  vendedorId: string;
  nombre: string;
  categoria: string;
  unidad: Unit;
  precioUnit: number;
  stock: number;
  tiempoEntregaDias?: number;
  descripcion?: string;
}

/**
 * Item en un pack de insumos
 */
export interface SupplyOfferItem {
  supplyId: string;
  nombre: string; // Desnormalizado
  cantidad: number;
  precioUnit: number;
  subtotal: number;
}

/**
 * Pack de Insumos ofrecido por un Proveedor de Insumos a un Servicio
 */
export interface SupplyOffer {
  id: string;
  serviceId: string;
  vendedorId: string;
  vendedorNombre?: string; // Desnormalizado para UI
  items: SupplyOfferItem[];
  precioTotal: number; // Calculado
  notas?: string;
  tiempoEntregaDias?: number;
  createdAt: string;
}

/**
 * Comparación de Cotizaciones
 * Estructura auxiliar para el componente Comparador
 */
export interface QuoteComparison {
  quote: Quote;
  precioTotal: number;
  plazoDias: number;
  rating: number;
  score?: number; // Calculado para ordenamiento
}

