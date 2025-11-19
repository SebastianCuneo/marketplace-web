/**
 * AuthContext - Autenticación con useReducer
 * Marketplace de Servicios con Insumos
 * 
 * Fuente de Verdad: CONTEXTO_PROYECTO_GEMA.md
 */

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { Usuario } from '../types/index';
import { authenticateUser, getUserById, HARDCODED_USERS } from '../data/hardcodedUsers';

// ============================================================================
// TIPOS
// ============================================================================

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: Usuario }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: Usuario }
  | { type: 'CLEAR_ERROR' };

interface AuthContextValue {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  
  // Helper functions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
  user: Usuario | null;
}

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ============================================================================
// REDUCER
// ============================================================================

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      // Limpiar localStorage
      localStorage.removeItem('currentUserId');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restaurar sesión al cargar (opcional)
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      const user = getUserById(savedUserId);
      if (user) {
        dispatch({ type: 'RESTORE_SESSION', payload: user });
      }
    }
  }, []);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Login con email y password hardcodeado
   */
  const login = (email: string, password: string): boolean => {
    dispatch({ type: 'LOGIN_START' });

    const user = authenticateUser(email, password);

    if (user) {
      // Guardar en localStorage (opcional)
      localStorage.setItem('currentUserId', user.id);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } else {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Email o contraseña incorrectos' 
      });
      return false;
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  /**
   * Limpiar error
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // ============================================================================
  // VALUE
  // ============================================================================

  const value: AuthContextValue = {
    state,
    dispatch,
    login,
    logout,
    clearError,
    // Shortcuts para facilitar uso
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};

export default AuthContext;

