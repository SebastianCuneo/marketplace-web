/**
 * InsumosContext - Gestión de Insumos y Ofertas con useReducer
 * Marketplace de Servicios con Insumos
 * 
 * Fuente de Verdad: CONTEXTO_PROYECTO_GEMA.md
 * 
 * Responsabilidades:
 * - Estado de supplies[] (catálogo)
 * - Estado de supplyOffers[] (ofertas de packs)
 * - CRUD de insumos
 * - CRUD de ofertas
 * - Validación de stock
 * - Cálculo de totales
 */

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { InsumosCatalogo, OfertaInsumos } from '../types/index';
import { mockInsumosCatalogo, mockOfertasInsumos } from '../data/mockData';
import { useAuth } from './AuthContext';

// ============================================================================
// TIPOS
// ============================================================================

interface InsumosState {
  insumos: never[];
  supplies: InsumosCatalogo[];
  supplyOffers: OfertaInsumos[];
  loading: boolean;
  error: string | null;
  filters: {
    categoria?: string;
    proveedorId?: string;
    stockBajo?: boolean;
  };
}

type InsumosAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUPPLIES'; payload: InsumosCatalogo[] }
  | { type: 'SET_SUPPLY_OFFERS'; payload: OfertaInsumos[] }
  | { type: 'ADD_SUPPLY'; payload: InsumosCatalogo }
  | { type: 'UPDATE_SUPPLY'; payload: { id: string; updates: Partial<InsumosCatalogo> } }
  | { type: 'DELETE_SUPPLY'; payload: string }
  | { type: 'ADD_SUPPLY_OFFER'; payload: OfertaInsumos }
  | { type: 'UPDATE_SUPPLY_OFFER'; payload: { id: string; updates: Partial<OfertaInsumos> } }
  | { type: 'DELETE_SUPPLY_OFFER'; payload: string }
  | { type: 'UPDATE_STOCK'; payload: { id: string; cantidad: number } }
  | { type: 'SET_FILTERS'; payload: Partial<InsumosState['filters']> }
  | { type: 'CLEAR_FILTERS' };

interface InsumosContextValue {
  state: InsumosState;
  dispatch: React.Dispatch<InsumosAction>;
  
  // Helper functions - Supplies
  addSupply: (supply: InsumosCatalogo) => void;
  updateSupply: (id: string, updates: Partial<InsumosCatalogo>) => void;
  deleteSupply: (id: string) => void;
  updateStock: (id: string, cantidad: number) => void;
  
  // Helper functions - Supply Offers
  addSupplyOffer: (offer: OfertaInsumos) => void;
  updateSupplyOffer: (id: string, updates: Partial<OfertaInsumos>) => void;
  deleteSupplyOffer: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<InsumosState['filters']>) => void;
  clearFilters: () => void;
  
  // Getters
  getSupplyById: (id: string) => InsumosCatalogo | undefined;
  getSuppliesByProvider: (proveedorId: string) => InsumosCatalogo[];
  getMySupplies: () => InsumosCatalogo[];
  getLowStockSupplies: () => InsumosCatalogo[];
  getSupplyOffersByService: (servicioId: string) => OfertaInsumos[];
  getMySupplyOffers: () => OfertaInsumos[];
  getFilteredSupplies: () => InsumosCatalogo[];
  
  // Utilities
  checkStockAvailable: (supplyId: string, cantidad: number) => boolean;
  calculateOfferTotal: (items: OfertaInsumos['items']) => number;
}

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialState: InsumosState = {
  insumos: [],
  supplies: [],
  supplyOffers: [],
  loading: false,
  error: null,
  filters: {},
};

// ============================================================================
// REDUCER
// ============================================================================

function insumosReducer(state: InsumosState, action: InsumosAction): InsumosState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_SUPPLIES':
      return { ...state, supplies: action.payload, loading: false, error: null };

    case 'SET_SUPPLY_OFFERS':
      return { ...state, supplyOffers: action.payload, loading: false, error: null };

    case 'ADD_SUPPLY':
      return {
        ...state,
        supplies: [...state.supplies, action.payload],
      };

    case 'UPDATE_SUPPLY':
      return {
        ...state,
        supplies: state.supplies.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };

    case 'DELETE_SUPPLY':
      return {
        ...state,
        supplies: state.supplies.filter(s => s.id !== action.payload),
      };

    case 'ADD_SUPPLY_OFFER':
      return {
        ...state,
        supplyOffers: [...state.supplyOffers, action.payload],
      };

    case 'UPDATE_SUPPLY_OFFER':
      return {
        ...state,
        supplyOffers: state.supplyOffers.map(o =>
          o.id === action.payload.id ? { ...o, ...action.payload.updates } : o
        ),
      };

    case 'DELETE_SUPPLY_OFFER':
      return {
        ...state,
        supplyOffers: state.supplyOffers.filter(o => o.id !== action.payload),
      };

    case 'UPDATE_STOCK': {
      const { id, cantidad } = action.payload;
      return {
        ...state,
        supplies: state.supplies.map(s =>
          s.id === id ? { ...s, stock: Math.max(0, s.stock + cantidad) } : s
        ),
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

const InsumosContext = createContext<InsumosContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export const InsumosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(insumosReducer, initialState);
  const { user } = useAuth();

  // Cargar datos mock al iniciar
  useEffect(() => {
    dispatch({ type: 'SET_SUPPLIES', payload: mockInsumosCatalogo });
    dispatch({ type: 'SET_SUPPLY_OFFERS', payload: mockOfertasInsumos });
  }, []);

  // ============================================================================
  // HELPER FUNCTIONS - SUPPLIES
  // ============================================================================

  const addSupply = (supply: InsumosCatalogo) => {
    dispatch({ type: 'ADD_SUPPLY', payload: supply });
  };

  const updateSupply = (id: string, updates: Partial<InsumosCatalogo>) => {
    dispatch({ type: 'UPDATE_SUPPLY', payload: { id, updates } });
  };

  const deleteSupply = (id: string) => {
    dispatch({ type: 'DELETE_SUPPLY', payload: id });
  };

  const updateStock = (id: string, cantidad: number) => {
    dispatch({ type: 'UPDATE_STOCK', payload: { id, cantidad } });
  };

  // ============================================================================
  // HELPER FUNCTIONS - SUPPLY OFFERS
  // ============================================================================

  const addSupplyOffer = (offer: OfertaInsumos) => {
    // Validar stock antes de crear oferta
    const insufficientStock = offer.items.some(item => {
      const supply = state.supplies.find(s => s.id === item.insumoId);
      return !supply || supply.stock < item.cantidad;
    });

    if (insufficientStock) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Stock insuficiente para uno o más insumos' 
      });
      return;
    }

    dispatch({ type: 'ADD_SUPPLY_OFFER', payload: offer });
  };

  const updateSupplyOffer = (id: string, updates: Partial<OfertaInsumos>) => {
    dispatch({ type: 'UPDATE_SUPPLY_OFFER', payload: { id, updates } });
  };

  const deleteSupplyOffer = (id: string) => {
    dispatch({ type: 'DELETE_SUPPLY_OFFER', payload: id });
  };

  // ============================================================================
  // FILTERS
  // ============================================================================

  const setFilters = (filters: Partial<InsumosState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // ============================================================================
  // GETTERS
  // ============================================================================

  const getSupplyById = (id: string): InsumosCatalogo | undefined => {
    return state.supplies.find(s => s.id === id);
  };

  const getSuppliesByProvider = (proveedorId: string): InsumosCatalogo[] => {
    return state.supplies.filter(s => s.proveedorId === proveedorId);
  };

  const getMySupplies = (): InsumosCatalogo[] => {
    if (!user) return [];
    return getSuppliesByProvider(user.id);
  };

  const getLowStockSupplies = (): InsumosCatalogo[] => {
    return state.supplies.filter(s => s.stock <= 10);
  };

  const getSupplyOffersByService = (servicioId: string): OfertaInsumos[] => {
    return state.supplyOffers.filter(o => o.servicioId === servicioId);
  };

  const getMySupplyOffers = (): OfertaInsumos[] => {
    if (!user) return [];
    return state.supplyOffers.filter(o => o.proveedorId === user.id);
  };

  const getFilteredSupplies = (): InsumosCatalogo[] => {
    let filtered = [...state.supplies];

    // Filtro por categoría
    if (state.filters.categoria) {
      filtered = filtered.filter(s => s.categoria === state.filters.categoria);
    }

    // Filtro por proveedor
    if (state.filters.proveedorId) {
      filtered = filtered.filter(s => s.proveedorId === state.filters.proveedorId);
    }

    // Filtro por stock bajo
    if (state.filters.stockBajo) {
      filtered = filtered.filter(s => s.stock <= 10);
    }

    return filtered;
  };

  // ============================================================================
  // UTILITIES
  // ============================================================================

  const checkStockAvailable = (supplyId: string, cantidad: number): boolean => {
    const supply = getSupplyById(supplyId);
    return supply ? supply.stock >= cantidad : false;
  };

  const calculateOfferTotal = (items: OfertaInsumos['items']): number => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  // ============================================================================
  // VALUE
  // ============================================================================

  const value: InsumosContextValue = {
    state,
    dispatch,
    addSupply,
    updateSupply,
    deleteSupply,
    updateStock,
    addSupplyOffer,
    updateSupplyOffer,
    deleteSupplyOffer,
    setFilters,
    clearFilters,
    getSupplyById,
    getSuppliesByProvider,
    getMySupplies,
    getLowStockSupplies,
    getSupplyOffersByService,
    getMySupplyOffers,
    getFilteredSupplies,
    checkStockAvailable,
    calculateOfferTotal,
  };

  return (
    <InsumosContext.Provider value={value}>
      {children}
    </InsumosContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useInsumos = (): InsumosContextValue => {
  const context = useContext(InsumosContext);
  
  if (!context) {
    throw new Error('useInsumos debe ser usado dentro de InsumosProvider');
  }
  
  return context;
};

export default InsumosContext;

