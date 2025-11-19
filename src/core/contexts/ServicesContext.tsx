/**
 * ServicesContext - Gestión de Servicios con useReducer
 * Marketplace de Servicios con Insumos
 * 
 * Fuente de Verdad: CONTEXTO_PROYECTO_GEMA.md
 * 
 * Responsabilidades:
 * - Estado de servicios[]
 * - CRUD de servicios
 * - Transiciones de estado automáticas
 * - Filtros y búsqueda
 * - Relación con cotizaciones
 */

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { Servicio, Cotizacion, OfertaInsumos } from '../types/index';
import { SERVICE_STATES, ServiceState, isValidTransition, canReceiveQuotes } from '../constants/serviceStates';
import { mockServicios, mockCotizaciones, mockOfertasInsumos } from '../data/mockData'; 
import { useAuth } from './AuthContext';

// ============================================================================
// TIPOS
// ============================================================================

interface ServicesState {
  servicios: Servicio[];
  quotes: Cotizacion[];
  supplyOffers: OfertaInsumos[];
  loading: boolean;
  error: string | null;
  filters: {
    estado?: ServiceState;
    categoria?: string;
    ciudad?: string;
    searchTerm?: string;
  };
}

type ServicesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SERVICES'; payload: Servicio[] }
  | { type: 'SET_QUOTES'; payload: Cotizacion[] }
  | { type: 'SET_SUPPLY_OFFERS'; payload: OfertaInsumos[] }
  | { type: 'ADD_SERVICE'; payload: Servicio }
  | { type: 'UPDATE_SERVICE'; payload: { id: string; updates: Partial<Servicio> } }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'CHANGE_SERVICE_STATE'; payload: { id: string; newState: ServiceState } }
  | { type: 'ADD_QUOTATION'; payload: Cotizacion }
  | { type: 'ACCEPT_QUOTATION'; payload: { servicioId: string; cotizacionId: string } }
  | { type: 'SELECT_QUOTATION'; payload: { servicioId: string; cotizacionId: string } }
  | { type: 'SET_FILTERS'; payload: Partial<ServicesState['filters']> }
  | { type: 'CLEAR_FILTERS' };

interface ServicesContextValue {
  state: ServicesState;
  dispatch: React.Dispatch<ServicesAction>;
  
  // Data access
  services: Servicio[]; // Alias para state.servicios
  
  // Helper functions
  addService: (servicio: Servicio) => void;
  updateService: (id: string, updates: Partial<Servicio>) => void;
  deleteService: (id: string) => void;
  changeServiceState: (id: string, newState: ServiceState) => void;
  addQuotation: (cotizacion: Cotizacion) => void;
  acceptQuotation: (servicioId: string, cotizacionId: string) => void;
  selectQuotation: (servicioId: string, cotizacionId: string) => void;
  setFilters: (filters: Partial<ServicesState['filters']>) => void;
  clearFilters: () => void;
  
  // Getters
  getServiceById: (id: string) => Servicio | undefined;
  getServicesByState: (estado: ServiceState) => Servicio[];
  getServicesByUser: (userId: string) => Servicio[];
  getMyServices: () => Servicio[];
  getPublishedServices: () => Servicio[];
  getFilteredServices: () => Servicio[];
}

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialState: ServicesState = {
  servicios: [],
  quotes: [],
  supplyOffers: [],
  loading: false,
  error: null,
  filters: {},
};

// ============================================================================
// REDUCER
// ============================================================================

function servicesReducer(state: ServicesState, action: ServicesAction): ServicesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_SERVICES':
      return { ...state, servicios: action.payload, loading: false, error: null };

    case 'SET_QUOTES':
      return { ...state, quotes: action.payload };

    case 'SET_SUPPLY_OFFERS':
      return { ...state, supplyOffers: action.payload };

    case 'ADD_SERVICE':
      return {
        ...state,
        servicios: [...state.servicios, action.payload],
      };

    case 'UPDATE_SERVICE':
      return {
        ...state,
        servicios: state.servicios.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };

    case 'DELETE_SERVICE':
      return {
        ...state,
        servicios: state.servicios.filter(s => s.id !== action.payload),
      };

    case 'CHANGE_SERVICE_STATE': {
      const { id, newState } = action.payload;
      const servicio = state.servicios.find(s => s.id === id);
      
      if (!servicio) {
        return { ...state, error: 'Servicio no encontrado' };
      }

      // Validar transición
      if (!isValidTransition(servicio.estado, newState)) {
        return { 
          ...state, 
          error: `Transición inválida: ${servicio.estado} -> ${newState}` 
        };
      }

      return {
        ...state,
        servicios: state.servicios.map(s =>
          s.id === id ? { ...s, estado: newState } : s
        ),
        error: null,
      };
    }

    case 'ADD_QUOTATION': {
      const servicio = state.servicios.find(s => s.id === action.payload.servicioId);
      if (!servicio) return state;

      // Verificar si es la primera cotización para este servicio
      const currentQuotes = state.quotes.filter(q => q.servicioId === servicio.id);
      const isFirstQuote = currentQuotes.length === 0;

      return {
        ...state,
        quotes: [...state.quotes, action.payload],
        servicios: state.servicios.map(s =>
          s.id === action.payload.servicioId
            ? {
                ...s,
                estado: s.estado === SERVICE_STATES.PUBLICADO && isFirstQuote
                  ? SERVICE_STATES.EN_EVALUACION
                  : s.estado,
              }
            : s
        ),
      };
    }

    case 'SELECT_QUOTATION': {
      return {
        ...state,
        servicios: state.servicios.map(s =>
          s.id === action.payload.servicioId
            ? {
                ...s,
                cotizacionSeleccionada: action.payload.cotizacionId,
                estado: SERVICE_STATES.ASIGNADO,
              }
            : s
        ),
      };
    }

    case 'ACCEPT_QUOTATION': {
      const { servicioId, cotizacionId } = action.payload;
      
      return {
        ...state,
        servicios: state.servicios.map(s => {
          if (s.id !== servicioId) return s;

          // Encontrar la cotización
          const cotizacion = s.cotizaciones?.find(c => c.id === cotizacionId);
          if (!cotizacion) return s;

          // TRANSICIÓN AUTOMÁTICA: ASIGNADO al aceptar cotización
          console.log(`🔄 Transición automática: ${s.titulo} -> ASIGNADO`);

          // Actualizar estado de cotizaciones
          const cotizacionesActualizadas = s.cotizaciones?.map(c => ({
            ...c,
            estado: c.id === cotizacionId ? 'aceptada' as const : 'retirada' as const,
          }));

          return {
            ...s,
            cotizacionSeleccionada: cotizacionId,
            estado: SERVICE_STATES.ASIGNADO,
            cotizaciones: cotizacionesActualizadas,
          };
        }),
      };
    }

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {},
      };

    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

const ServicesContext = createContext<ServicesContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(servicesReducer, initialState);
  const { user } = useAuth();

  // Cargar datos mock al iniciar
  useEffect(() => {
    dispatch({ type: 'SET_SERVICES', payload: mockServicios });
    dispatch({ type: 'SET_QUOTES', payload: mockCotizaciones });
    dispatch({ type: 'SET_SUPPLY_OFFERS', payload: mockOfertasInsumos });
  }, []);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const addService = (servicio: Servicio) => {
    dispatch({ type: 'ADD_SERVICE', payload: servicio });
  };

  const updateService = (id: string, updates: Partial<Servicio>) => {
    dispatch({ type: 'UPDATE_SERVICE', payload: { id, updates } });
  };

  const deleteService = (id: string) => {
    dispatch({ type: 'DELETE_SERVICE', payload: id });
  };

  const changeServiceState = (id: string, newState: ServiceState) => {
    dispatch({ type: 'CHANGE_SERVICE_STATE', payload: { id, newState } });
  };

  const addQuotation = (cotizacion: Cotizacion) => {
    dispatch({ type: 'ADD_QUOTATION', payload: cotizacion });
  };

  const acceptQuotation = (servicioId: string, cotizacionId: string) => {
    dispatch({ type: 'ACCEPT_QUOTATION', payload: { servicioId, cotizacionId } });
  };

  const selectQuotation = (servicioId: string, cotizacionId: string) => {
    dispatch({ type: 'SELECT_QUOTATION', payload: { servicioId, cotizacionId } });
  };

  const setFilters = (filters: Partial<ServicesState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // ============================================================================
  // GETTERS
  // ============================================================================

  const getServiceById = (id: string): Servicio | undefined => {
    return state.servicios.find(s => s.id === id);
  };

  const getServicesByState = (estado: ServiceState): Servicio[] => {
    return state.servicios.filter(s => s.estado === estado);
  };

  const getServicesByUser = (userId: string): Servicio[] => {
    return state.servicios.filter(s => s.solicitanteId === userId);
  };

  const getMyServices = (): Servicio[] => {
    if (!user) return [];
    return getServicesByUser(user.id);
  };

  const getPublishedServices = (): Servicio[] => {
    return state.servicios.filter(s => 
      s.estado === SERVICE_STATES.PUBLICADO || 
      s.estado === SERVICE_STATES.EN_EVALUACION
    );
  };

  const getFilteredServices = (): Servicio[] => {
    let filtered = [...state.servicios];

    // Filtro por estado
    if (state.filters.estado) {
      filtered = filtered.filter(s => s.estado === state.filters.estado);
    }

    // Filtro por categoría
    if (state.filters.categoria) {
      filtered = filtered.filter(s => s.categoria === state.filters.categoria);
    }

    // Filtro por ciudad
    if (state.filters.ciudad) {
      filtered = filtered.filter(s => s.ciudad === state.filters.ciudad);
    }

    // Búsqueda por texto
    if (state.filters.searchTerm) {
      const term = state.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.titulo.toLowerCase().includes(term) ||
        s.descripcion.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  // ============================================================================
  // VALUE
  // ============================================================================

  const value: ServicesContextValue = {
    state,
    dispatch,
    services: state.servicios, // Alias para fácil acceso
    addService,
    updateService,
    deleteService,
    changeServiceState,
    addQuotation,
    acceptQuotation,
    selectQuotation,
    setFilters,
    clearFilters,
    getServiceById,
    getServicesByState,
    getServicesByUser,
    getMyServices,
    getPublishedServices,
    getFilteredServices,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useServices = (): ServicesContextValue => {
  const context = useContext(ServicesContext);
  
  if (!context) {
    throw new Error('useServices debe ser usado dentro de ServicesProvider');
  }
  
  return context;
};

export default ServicesContext;

