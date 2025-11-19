// Importaciones principales de React y componentes
import { useState } from 'react';
// Componente para mostrar notificaciones toast
import { Toaster } from './Components/ui/sonner';
// Hooks para acceder a los contextos (desde core)
import { useAuth } from './core';
// Componentes de las diferentes pantallas de la aplicación
import { Login } from './Components/Login';
import { SolicitanteDashboard } from './Components/SolicitanteDashboard';
import { PublicarServicio } from './Components/PublicarServicio';
import { DetalleServicio } from './Components/DetalleServicio';
import { Comparador } from './Components/Comparador';
import { ProveedorServicioDashboard } from './Components/ProveedorServicioDashboard';
import { EnviarCotizacion } from './Components/EnviarCotizacion';
import { MisCotizaciones } from './Components/MisCotizaciones';
import { ProveedorInsumosDashboard } from './Components/ProveedorInsumosDashboard';
import { AgregarInsumo } from './Components/AgregarInsumo';
import { OfrecerPack } from './Components/OfrecerPack';
import { BottomNav } from './Components/BottomNav';
import { Perfil } from './Components/Perfil';
// Tipos de TypeScript para definir la estructura de datos (desde core)
import { Servicio } from './core';

export default function App() {
  // Acceso al contexto de autenticación
  const { logout, user, isAuthenticated } = useAuth();
  
  // Estados principales de la aplicación
  const [currentScreen, setCurrentScreen] = useState('login'); // Pantalla actual
  const [activeTab, setActiveTab] = useState('servicios'); // Pestaña activa en el dashboard
  const [selectedServicio, setSelectedServicio] = useState(null); // Servicio seleccionado
  const [selectedInsumo, setSelectedInsumo] = useState(null); // Insumo seleccionado para editar

  // Función para manejar el login del usuario
  const handleLogin = () => {
    setCurrentScreen('dashboard'); // Va al dashboard principal
    // Configura la pestaña inicial según el rol del usuario autenticado
    if (user?.rol === 'PROVEEDOR_INSUMOS') {
      setActiveTab('catalogo'); // Los proveedores de insumos ven el catálogo
    } else {
      setActiveTab('servicios'); // Otros roles ven servicios
    }
  };

  // Función para manejar el logout del usuario
  const handleLogout = () => {
    logout(); // Limpia el usuario del contexto de autenticación
    setCurrentScreen('login'); // Regresa a la pantalla de login
    setActiveTab('servicios'); // Resetea la pestaña activa
    setSelectedServicio(null); // Limpia el servicio seleccionado
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Handle navigation based on role and tab
    const userRole = user?.rol;
    
    if (userRole === 'SOLICITANTE') {
      switch (tab) {
        case 'servicios':
          setCurrentScreen('dashboard');
          break;
        case 'publicar':
          setCurrentScreen('publicar-servicio');
          break;
        case 'perfil':
          setCurrentScreen('perfil');
          break;
      }
    } else if (userRole === 'PROVEEDOR_SERVICIO') {
      switch (tab) {
        case 'servicios':
          setCurrentScreen('dashboard');
          break;
        case 'cotizaciones':
          setCurrentScreen('mis-cotizaciones');
          break;
        case 'perfil':
          setCurrentScreen('perfil');
          break;
      }
    } else if (userRole === 'PROVEEDOR_INSUMOS') {
      switch (tab) {
        case 'catalogo':
          setCurrentScreen('dashboard');
          break;
        case 'ofertas':
          setCurrentScreen('dashboard');
          break;
        case 'perfil':
          setCurrentScreen('perfil');
          break;
      }
    }
  };

  const handleVerDetalle = (servicio) => {
    setSelectedServicio(servicio);
    setCurrentScreen('detalle-servicio');
  };

  const handleComparar = () => {
    setCurrentScreen('comparador');
  };

  const handleEnviarCotizacion = (servicio) => {
    setSelectedServicio(servicio);
    setCurrentScreen('enviar-cotizacion');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login onLogin={handleLogin} />;

      case 'dashboard':
        if (user?.rol === 'SOLICITANTE') {
          return (
            <SolicitanteDashboard
              onPublicarServicio={() => setCurrentScreen('publicar-servicio')}
              onVerDetalle={handleVerDetalle}
            />
          );
        } else if (user?.rol === 'PROVEEDOR_SERVICIO') {
          return (
            <ProveedorServicioDashboard
              onVerServicio={handleVerDetalle}
              onEnviarCotizacion={handleEnviarCotizacion}
              onVerMisCotizaciones={() => setCurrentScreen('mis-cotizaciones')}
            />
          );
        } else {
          return (
            <ProveedorInsumosDashboard
              onAgregarInsumo={() => {
                setSelectedInsumo(null); // Limpiar insumo seleccionado para modo crear
                setCurrentScreen('agregar-insumo');
              }}
              onEditarInsumo={(insumo) => {
                setSelectedInsumo(insumo); // Establecer insumo a editar
                setCurrentScreen('agregar-insumo');
              }}
              onOfrecerPack={() => setCurrentScreen('ofrecer-pack')}
            />
          );
        }

      case 'publicar-servicio':
        return (
          <PublicarServicio
            onVolver={() => {
              setCurrentScreen('dashboard');
              setActiveTab('servicios');
            }}
          />
        );

      case 'detalle-servicio':
        return selectedServicio ? (
          <DetalleServicio
            servicio={selectedServicio}
            onVolver={() => setCurrentScreen('dashboard')}
            onComparar={user?.rol === 'SOLICITANTE' ? handleComparar : undefined}
          />
        ) : null;

      case 'comparador':
        return selectedServicio ? (
          <Comparador
            servicio={selectedServicio}
            onVolver={() => setCurrentScreen('detalle-servicio')}
          />
        ) : null;

      case 'enviar-cotizacion':
        return selectedServicio ? (
          <EnviarCotizacion
            servicio={selectedServicio}
            onVolver={() => setCurrentScreen('dashboard')}
          />
        ) : null;

      case 'mis-cotizaciones':
        return (
          <MisCotizaciones
            onVolver={() => {
              setCurrentScreen('dashboard');
              setActiveTab('servicios');
            }}
          />
        );

      case 'agregar-insumo':
        return (
          <AgregarInsumo
            insumoToEdit={selectedInsumo}
            onVolver={() => {
              setSelectedInsumo(null); // Limpiar insumo seleccionado
              setCurrentScreen('dashboard');
              setActiveTab('catalogo');
            }}
          />
        );

      case 'ofrecer-pack':
        return (
          <OfrecerPack
            onVolver={() => {
              setCurrentScreen('dashboard');
              setActiveTab('catalogo');
            }}
          />
        );

      case 'perfil':
        return (
          <Perfil
            role={user?.rol || 'SOLICITANTE'}
            onLogout={handleLogout}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
      
      {currentScreen !== 'login' && user && (
        <BottomNav
          role={user.rol}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
}
