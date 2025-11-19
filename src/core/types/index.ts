/**
 * Tipos del Sistema - Marketplace de Servicios con Insumos
 * Fuente de Verdad: CONTEXTO_PROYECTO_GEMA.md
 */

// Importar constantes (source of truth)
import { UserRole } from '../constants/roles';
import { ServiceState } from '../constants/serviceStates';

// Tipos de estado de cotización
export type EstadoCotizacion = 'enviada' | 'retirada' | 'aceptada';

// Re-exportar para compatibilidad
export type { UserRole, ServiceState };
export type EstadoServicio = ServiceState; // Alias legacy

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  telefono?: string;
  rating?: number;
}

export interface Insumo {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface Servicio {
  id: string;
  titulo: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  fecha: string; // Legacy
  fechaPreferida: string; // Según TP
  categoria: string;
  estado: EstadoServicio;
  insumos: Insumo[]; // Legacy
  insumosRequeridos: Insumo[]; // Según TP
  solicitanteId: string;
  cotizaciones?: Cotizacion[];
  ofertas?: OfertaInsumos[];
  cotizacionSeleccionada?: string;
}

export interface Cotizacion {
  id: string;
  servicioId: string;
  proveedorId: string;
  proveedorNombre: string;
  proveedorRating: number;
  precio: number;
  plazo: string;
  notas: string;
  itemsIncluidos: string[];
  itemsExcluidos: string[];
  estado: EstadoCotizacion;
  fechaEnvio: string;
}

export interface InsumosCatalogo {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  precioUnitario: number;
  stock: number;
  proveedorId: string;
}

export interface OfertaInsumos {
  id: string;
  servicioId: string;
  proveedorId: string;
  proveedorNombre: string;
  items: {
    insumoId: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
  total: number;
  notas: string;
  fechaEnvio: string;
}
