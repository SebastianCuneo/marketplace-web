/**
 * Datos Mock del Sistema - Consolidados
 * Marketplace de Servicios con Insumos
 * 
 * Este archivo contiene todos los datos de prueba del sistema:
 * - Servicios publicados por solicitantes
 * - Cotizaciones de proveedores de servicios
 * - Catálogo de insumos
 * - Ofertas de packs de insumos
 */

import { SERVICE_STATES } from '../constants/serviceStates';
import { Servicio, Cotizacion, InsumosCatalogo, OfertaInsumos } from '../types';

/**
 * Servicios Mock
 */
export const mockServicios: Servicio[] = [
  {
    id: 'srv-001',
    solicitanteId: 'sol-001',
    titulo: 'Limpieza de Jardín y Pileta',
    descripcion: 'Necesito limpieza completa de jardín (aprox 100m²) y mantenimiento de pileta de 8x4m. Incluye corte de césped, poda de arbustos y limpieza de fondo de pileta.',
    categoria: 'Jardinería',
    direccion: 'Av. Rivera 3456',
    ciudad: 'Montevideo',
    fecha: '2025-12-01',
    fechaPreferida: '2025-12-01T00:00:00.000Z',
    insumos: [
      { id: 'i1', nombre: 'Cloro para pileta', cantidad: 5, unidad: 'kg' },
      { id: 'i2', nombre: 'Fertilizante para césped', cantidad: 10, unidad: 'kg' },
      { id: 'i3', nombre: 'Bolsas para residuos', cantidad: 20, unidad: 'unidades' },
    ],
    insumosRequeridos: [
      { id: 'i1', nombre: 'Cloro para pileta', cantidad: 5, unidad: 'kg' },
      { id: 'i2', nombre: 'Fertilizante para césped', cantidad: 10, unidad: 'kg' },
      { id: 'i3', nombre: 'Bolsas para residuos', cantidad: 20, unidad: 'unidades' },
    ],
    estado: SERVICE_STATES.PUBLICADO,
  },
  {
    id: 'srv-002',
    solicitanteId: 'sol-001',
    titulo: 'Mantenimiento de Piscina',
    descripcion: 'Mantenimiento mensual de piscina: limpieza, control de pH, aplicación de químicos y revisión de filtros.',
    categoria: 'Piscinas',
    direccion: 'Bulevar Artigas 1234',
    ciudad: 'Montevideo',
    fecha: '2025-11-20',
    fechaPreferida: '2025-11-20T00:00:00.000Z',
    insumos: [
      { id: 'i4', nombre: 'Cloro granulado', cantidad: 3, unidad: 'kg' },
      { id: 'i5', nombre: 'pH minus', cantidad: 2, unidad: 'litros' },
      { id: 'i6', nombre: 'Alguicida', cantidad: 1, unidad: 'litros' },
    ],
    insumosRequeridos: [
      { id: 'i4', nombre: 'Cloro granulado', cantidad: 3, unidad: 'kg' },
      { id: 'i5', nombre: 'pH minus', cantidad: 2, unidad: 'litros' },
      { id: 'i6', nombre: 'Alguicida', cantidad: 1, unidad: 'litros' },
    ],
    estado: SERVICE_STATES.EN_EVALUACION,
  },
  {
    id: 'srv-003',
    solicitanteId: 'sol-002',
    titulo: 'Pintura Exterior de Casa',
    descripcion: 'Pintura completa de fachada exterior, aproximadamente 150m². Incluye preparación de superficie y 2 manos de pintura.',
    categoria: 'Pintura',
    direccion: '21 de Setiembre 567',
    ciudad: 'Maldonado',
    fecha: '2025-12-15',
    fechaPreferida: '2025-12-15T00:00:00.000Z',
    insumos: [
      { id: 'i7', nombre: 'Pintura exterior blanca', cantidad: 40, unidad: 'litros' },
      { id: 'i8', nombre: 'Sellador para paredes', cantidad: 10, unidad: 'litros' },
      { id: 'i9', nombre: 'Lija', cantidad: 20, unidad: 'unidades' },
    ],
    insumosRequeridos: [
      { id: 'i7', nombre: 'Pintura exterior blanca', cantidad: 40, unidad: 'litros' },
      { id: 'i8', nombre: 'Sellador para paredes', cantidad: 10, unidad: 'litros' },
      { id: 'i9', nombre: 'Lija', cantidad: 20, unidad: 'unidades' },
    ],
    estado: SERVICE_STATES.PUBLICADO,
  },
];

/**
 * Cotizaciones Mock
 */
export const mockCotizaciones: Cotizacion[] = [
  {
    id: 'quote-001',
    servicioId: 'srv-002',
    proveedorId: 'prov-serv-001',
    proveedorNombre: 'Carlos Rodríguez',
    proveedorRating: 4.8,
    precio: 3500,
    plazo: '1 día',
    notas: 'Servicio completo de mantenimiento. Incluye todos los productos químicos necesarios.',
    itemsIncluidos: ['Limpieza profunda', 'Balance químico', 'Revisión de filtros', 'Aspirado de fondo'],
    itemsExcluidos: ['Reparación de equipos', 'Reemplazo de piezas'],
    estado: 'enviada',
    fechaEnvio: '2025-10-26',
  },
  {
    id: 'quote-002',
    servicioId: 'srv-002',
    proveedorId: 'prov-serv-002',
    proveedorNombre: 'Ana García',
    proveedorRating: 4.9,
    precio: 4200,
    plazo: '2 días',
    notas: 'Servicio premium con garantía. Incluye informe detallado del estado de la piscina.',
    itemsIncluidos: ['Limpieza completa', 'Balance químico profesional', 'Revisión de equipos', 'Informe detallado', 'Asesoramiento'],
    itemsExcluidos: ['Productos químicos (se cotizan aparte)', 'Reparaciones'],
    estado: 'enviada',
    fechaEnvio: '2025-10-27',
  },
  {
    id: 'quote-003',
    servicioId: 'srv-001',
    proveedorId: 'prov-serv-001',
    proveedorNombre: 'Carlos Rodríguez',
    proveedorRating: 4.8,
    precio: 5800,
    plazo: '3 días',
    notas: 'Servicio completo de jardín y pileta. Equipo de 3 personas.',
    itemsIncluidos: ['Corte de césped', 'Poda de arbustos', 'Limpieza de pileta', 'Retiro de residuos', 'Aplicación de productos'],
    itemsExcluidos: ['Insumos (cloro, fertilizantes)', 'Reparación de sistema de riego'],
    estado: 'enviada',
    fechaEnvio: '2025-11-02',
  },
];

/**
 * Catálogo de Insumos Mock
 */
export const mockInsumosCatalogo: InsumosCatalogo[] = [
  {
    id: 'sup-001',
    proveedorId: 'prov-ins-001',
    nombre: 'Cloro Granulado HTH',
    categoria: 'Químicos para Piscina',
    unidad: 'kg',
    precioUnitario: 450,
    stock: 50,
  },
  {
    id: 'sup-002',
    proveedorId: 'prov-ins-001',
    nombre: 'pH Minus Líquido',
    categoria: 'Químicos para Piscina',
    unidad: 'litros',
    precioUnitario: 280,
    stock: 30,
  },
  {
    id: 'sup-003',
    proveedorId: 'prov-ins-001',
    nombre: 'Alguicida Concentrado',
    categoria: 'Químicos para Piscina',
    unidad: 'litros',
    precioUnitario: 520,
    stock: 25,
  },
  {
    id: 'sup-004',
    proveedorId: 'prov-ins-002',
    nombre: 'Fertilizante Cesped Verde',
    categoria: 'Jardinería',
    unidad: 'kg',
    precioUnitario: 180,
    stock: 100,
  },
  {
    id: 'sup-005',
    proveedorId: 'prov-ins-002',
    nombre: 'Bolsas Residuos Jardín 100L',
    categoria: 'Jardinería',
    unidad: 'unidades',
    precioUnitario: 45,
    stock: 200,
  },
  {
    id: 'sup-006',
    proveedorId: 'prov-ins-002',
    nombre: 'Pintura Exterior Premium',
    categoria: 'Pintura',
    unidad: 'litros',
    precioUnitario: 350,
    stock: 80,
  },
];

/**
 * Ofertas de Insumos Mock (Packs)
 */
export const mockOfertasInsumos: OfertaInsumos[] = [
  {
    id: 'offer-001',
    servicioId: 'srv-002',
    proveedorId: 'prov-ins-001',
    proveedorNombre: 'Luis Martínez',
    items: [
      {
        insumoId: 'sup-001',
        nombre: 'Cloro Granulado HTH',
        cantidad: 3,
        precioUnitario: 450,
        subtotal: 1350,
      },
      {
        insumoId: 'sup-002',
        nombre: 'pH Minus Líquido',
        cantidad: 2,
        precioUnitario: 280,
        subtotal: 560,
      },
      {
        insumoId: 'sup-003',
        nombre: 'Alguicida Concentrado',
        cantidad: 1,
        precioUnitario: 520,
        subtotal: 520,
      },
    ],
    total: 2430,
    notas: 'Pack completo para mantenimiento mensual. Descuento del 5% aplicado. Entrega en 48hs.',
    fechaEnvio: '2025-10-27',
  },
  {
    id: 'offer-002',
    servicioId: 'srv-001',
    proveedorId: 'prov-ins-002',
    proveedorNombre: 'Laura Fernández',
    items: [
      {
        insumoId: 'sup-004',
        nombre: 'Fertilizante Cesped Verde',
        cantidad: 10,
        precioUnitario: 180,
        subtotal: 1800,
      },
      {
        insumoId: 'sup-005',
        nombre: 'Bolsas Residuos Jardín 100L',
        cantidad: 20,
        precioUnitario: 45,
        subtotal: 900,
      },
    ],
    total: 2700,
    notas: 'Pack para jardinería. Descuento por cantidad. Entrega inmediata.',
    fechaEnvio: '2025-11-02',
  },
];
