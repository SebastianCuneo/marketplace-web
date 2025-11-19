/**
 * Datos Mock de Servicios
 * Trabajo Práctico: Marketplace de Servicios con Insumos
 */

import { Service, Quote, Supply, SupplyOffer } from '../types/models';
import { SERVICE_STATES } from '../constants/serviceStates';
import { SERVICE_CATEGORIES, UNITS } from '../constants/categories';

/**
 * Servicios iniciales (seed data)
 */
export const MOCK_SERVICES: Service[] = [
  {
    id: 'srv-001',
    solicitanteId: 'sol-001',
    titulo: 'Limpieza de Jardín y Pileta',
    descripcion:
      'Necesito limpieza completa de jardín (aprox 100m²) y mantenimiento de pileta de 8x4m. Incluye corte de césped, poda de arbustos y limpieza de fondo de pileta.',
    categoria: SERVICE_CATEGORIES.JARDINERIA,
    direccion: 'Av. Rivera 3456',
    ciudad: 'Montevideo',
    fechaPreferida: '2025-12-01T00:00:00.000Z',
    insumosRequeridos: [
      { nombre: 'Cloro para pileta', cantidad: 5, unidad: UNITS.KILOGRAMOS },
      { nombre: 'Fertilizante para césped', cantidad: 10, unidad: UNITS.KILOGRAMOS },
      { nombre: 'Bolsas para residuos', cantidad: 20, unidad: UNITS.UNIDADES },
    ],
    estado: SERVICE_STATES.PUBLICADO,
    createdAt: '2025-11-01T10:30:00.000Z',
  },
  {
    id: 'srv-002',
    solicitanteId: 'sol-001',
    titulo: 'Mantenimiento de Piscina',
    descripcion:
      'Mantenimiento mensual de piscina: limpieza, control de pH, aplicación de químicos y revisión de filtros.',
    categoria: SERVICE_CATEGORIES.PISCINAS,
    direccion: 'Bulevar Artigas 1234',
    ciudad: 'Montevideo',
    fechaPreferida: '2025-11-20T00:00:00.000Z',
    insumosRequeridos: [
      { nombre: 'Cloro granulado', cantidad: 3, unidad: UNITS.KILOGRAMOS },
      { nombre: 'pH minus', cantidad: 2, unidad: UNITS.LITROS },
      { nombre: 'Alguicida', cantidad: 1, unidad: UNITS.LITROS },
    ],
    estado: SERVICE_STATES.EN_EVALUACION,
    createdAt: '2025-10-25T14:20:00.000Z',
  },
  {
    id: 'srv-003',
    solicitanteId: 'sol-002',
    titulo: 'Pintura Exterior de Casa',
    descripcion:
      'Pintura completa de fachada exterior, aproximadamente 150m². Incluye preparación de superficie y 2 manos de pintura.',
    categoria: SERVICE_CATEGORIES.PINTURA,
    direccion: '21 de Setiembre 567',
    ciudad: 'Maldonado',
    fechaPreferida: '2025-12-15T00:00:00.000Z',
    insumosRequeridos: [
      { nombre: 'Pintura exterior blanca', cantidad: 40, unidad: UNITS.LITROS },
      { nombre: 'Sellador para paredes', cantidad: 10, unidad: UNITS.LITROS },
      { nombre: 'Lija', cantidad: 20, unidad: UNITS.UNIDADES },
    ],
    estado: SERVICE_STATES.PUBLICADO,
    createdAt: '2025-11-03T09:15:00.000Z',
  },
];

/**
 * Cotizaciones iniciales (seed data)
 */
export const MOCK_QUOTES: Quote[] = [
  {
    id: 'quote-001',
    serviceId: 'srv-002',
    proveedorId: 'prov-serv-001',
    proveedorNombre: 'Carlos Rodríguez',
    precio: 3500,
    plazoDias: 1,
    detalle: 'Servicio completo de mantenimiento. Incluye todos los productos químicos necesarios.',
    itemsIncluidos: ['Limpieza profunda', 'Balance químico', 'Revisión de filtros', 'Aspirado de fondo'],
    itemsExcluidos: ['Reparación de equipos', 'Reemplazo de piezas'],
    ratingProveedorMock: 4.8,
    createdAt: '2025-10-26T11:30:00.000Z',
  },
  {
    id: 'quote-002',
    serviceId: 'srv-002',
    proveedorId: 'prov-serv-002',
    proveedorNombre: 'Ana García',
    precio: 4200,
    plazoDias: 2,
    detalle: 'Servicio premium con garantía. Incluye informe detallado del estado de la piscina.',
    itemsIncluidos: [
      'Limpieza completa',
      'Balance químico profesional',
      'Revisión de equipos',
      'Informe detallado',
      'Asesoramiento',
    ],
    itemsExcluidos: ['Productos químicos (se cotizan aparte)', 'Reparaciones'],
    ratingProveedorMock: 4.9,
    createdAt: '2025-10-27T15:45:00.000Z',
  },
  {
    id: 'quote-003',
    serviceId: 'srv-001',
    proveedorId: 'prov-serv-001',
    proveedorNombre: 'Carlos Rodríguez',
    precio: 5800,
    plazoDias: 3,
    detalle: 'Servicio completo de jardín y pileta. Equipo de 3 personas.',
    itemsIncluidos: [
      'Corte de césped',
      'Poda de arbustos',
      'Limpieza de pileta',
      'Retiro de residuos',
      'Aplicación de productos',
    ],
    itemsExcluidos: ['Insumos (cloro, fertilizantes)', 'Reparación de sistema de riego'],
    ratingProveedorMock: 4.8,
    createdAt: '2025-11-02T10:00:00.000Z',
  },
];

/**
 * Catálogo de Insumos (seed data)
 */
export const MOCK_SUPPLIES: Supply[] = [
  {
    id: 'sup-001',
    vendedorId: 'prov-ins-001',
    nombre: 'Cloro Granulado HTH',
    categoria: 'Químicos para Piscina',
    unidad: UNITS.KILOGRAMOS,
    precioUnit: 450,
    stock: 50,
    tiempoEntregaDias: 2,
    descripcion: 'Cloro granulado de alta calidad para desinfección de piscinas.',
  },
  {
    id: 'sup-002',
    vendedorId: 'prov-ins-001',
    nombre: 'pH Minus Líquido',
    categoria: 'Químicos para Piscina',
    unidad: UNITS.LITROS,
    precioUnit: 280,
    stock: 30,
    tiempoEntregaDias: 2,
    descripcion: 'Reductor de pH para agua de piscina.',
  },
  {
    id: 'sup-003',
    vendedorId: 'prov-ins-001',
    nombre: 'Alguicida Concentrado',
    categoria: 'Químicos para Piscina',
    unidad: UNITS.LITROS,
    precioUnit: 520,
    stock: 25,
    tiempoEntregaDias: 2,
    descripcion: 'Previene y elimina algas en piscinas.',
  },
  {
    id: 'sup-004',
    vendedorId: 'prov-ins-002',
    nombre: 'Fertilizante Cesped Verde',
    categoria: 'Jardinería',
    unidad: UNITS.KILOGRAMOS,
    precioUnit: 180,
    stock: 100,
    tiempoEntregaDias: 1,
    descripcion: 'Fertilizante NPK para césped. Promoción por cantidad.',
  },
  {
    id: 'sup-005',
    vendedorId: 'prov-ins-002',
    nombre: 'Bolsas Residuos Jardín 100L',
    categoria: 'Jardinería',
    unidad: UNITS.UNIDADES,
    precioUnit: 45,
    stock: 200,
    tiempoEntregaDias: 1,
    descripcion: 'Bolsas resistentes para residuos de jardín.',
  },
  {
    id: 'sup-006',
    vendedorId: 'prov-ins-002',
    nombre: 'Pintura Exterior Premium',
    categoria: 'Pintura',
    unidad: UNITS.LITROS,
    precioUnit: 350,
    stock: 80,
    tiempoEntregaDias: 3,
    descripcion: 'Pintura acrílica exterior de alta cobertura.',
  },
];

/**
 * Ofertas de Packs de Insumos (seed data)
 */
export const MOCK_SUPPLY_OFFERS: SupplyOffer[] = [
  {
    id: 'offer-001',
    serviceId: 'srv-002',
    vendedorId: 'prov-ins-001',
    vendedorNombre: 'Luis Martínez',
    items: [
      {
        supplyId: 'sup-001',
        nombre: 'Cloro Granulado HTH',
        cantidad: 3,
        precioUnit: 450,
        subtotal: 1350,
      },
      {
        supplyId: 'sup-002',
        nombre: 'pH Minus Líquido',
        cantidad: 2,
        precioUnit: 280,
        subtotal: 560,
      },
      {
        supplyId: 'sup-003',
        nombre: 'Alguicida Concentrado',
        cantidad: 1,
        precioUnit: 520,
        subtotal: 520,
      },
    ],
    precioTotal: 2430,
    notas: 'Pack completo para mantenimiento mensual. Descuento del 5% aplicado. Entrega en 48hs.',
    tiempoEntregaDias: 2,
    createdAt: '2025-10-27T09:00:00.000Z',
  },
  {
    id: 'offer-002',
    serviceId: 'srv-001',
    vendedorId: 'prov-ins-002',
    vendedorNombre: 'Laura Fernández',
    items: [
      {
        supplyId: 'sup-004',
        nombre: 'Fertilizante Cesped Verde',
        cantidad: 10,
        precioUnit: 180,
        subtotal: 1800,
      },
      {
        supplyId: 'sup-005',
        nombre: 'Bolsas Residuos Jardín 100L',
        cantidad: 20,
        precioUnit: 45,
        subtotal: 900,
      },
    ],
    precioTotal: 2700,
    notas: 'Pack para jardinería. Descuento por cantidad. Entrega inmediata.',
    tiempoEntregaDias: 1,
    createdAt: '2025-11-02T12:30:00.000Z',
  },
];

