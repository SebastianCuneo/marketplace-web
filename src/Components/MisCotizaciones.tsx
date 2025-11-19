import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { EstadoCotizacion, Cotizacion } from '../core';
import React from 'react';
import { useAuth, useServices } from '../core';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface MisCotizacionesProps {
  onVolver: () => void;
  onEditarCotizacion?: (cotizacion: Cotizacion) => void;
}

export function MisCotizaciones({ onVolver, onEditarCotizacion }: MisCotizacionesProps) {
  const { user } = useAuth();
  const { state, services, dispatch } = useServices();
  const [filtroEstado, setFiltroEstado] = useState<EstadoCotizacion | 'todas'>('todas');

  // Filtrar cotizaciones del proveedor actual
  const misCotizaciones = state.quotes.filter(c => c.proveedorId === user?.id);
  
  const handleRetirarCotizacion = (cotizacionId: string) => {
    // Actualizar el estado de la cotización a 'retirada'
    const cotizacionesActualizadas = state.quotes.map(c => 
      c.id === cotizacionId ? { ...c, estado: 'retirada' as EstadoCotizacion } : c
    );
    dispatch({ type: 'SET_QUOTES', payload: cotizacionesActualizadas });
    toast.success('Cotización retirada exitosamente');
  };
  
  const handleEditarCotizacion = (cotizacion: Cotizacion) => {
    if (onEditarCotizacion) {
      onEditarCotizacion(cotizacion);
    } else {
      toast.info('Funcionalidad de edición en desarrollo');
    }
  };

  const getEstadoBadge = (estado: EstadoCotizacion) => {
    const styles = {
      enviada: { bg: 'bg-blue-100 text-blue-700', icon: <FileText className="w-4 h-4" /> },
      retirada: { bg: 'bg-gray-100 text-gray-700', icon: <XCircle className="w-4 h-4" /> },
      aceptada: { bg: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
    };
    return styles[estado];
  };

  const cotizacionesFiltradas = filtroEstado === 'todas' 
    ? misCotizaciones 
    : misCotizaciones.filter(c => c.estado === filtroEstado);

  const getServicio = (servicioId: string) => {
    return services.find(s => s.id === servicioId);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onVolver}
            className="rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl">Mis Cotizaciones</h1>
            <p className="text-gray-500">Gestiona tus cotizaciones enviadas</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Enviadas</p>
                <p className="text-2xl">{misCotizaciones.filter(c => c.estado === 'enviada').length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aceptadas</p>
                <p className="text-2xl">{misCotizaciones.filter(c => c.estado === 'aceptada').length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Retiradas</p>
                <p className="text-2xl">{misCotizaciones.filter(c => c.estado === 'retirada').length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 rounded-lg">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filtroEstado === 'todas' ? 'default' : 'outline'}
              onClick={() => setFiltroEstado('todas')}
              className={`rounded-lg ${filtroEstado === 'todas' ? 'bg-[#2D7CF6]' : ''}`}
            >
              Todas
            </Button>
            <Button
              variant={filtroEstado === 'enviada' ? 'default' : 'outline'}
              onClick={() => setFiltroEstado('enviada')}
              className={`rounded-lg ${filtroEstado === 'enviada' ? 'bg-[#2D7CF6]' : ''}`}
            >
              Enviadas
            </Button>
            <Button
              variant={filtroEstado === 'aceptada' ? 'default' : 'outline'}
              onClick={() => setFiltroEstado('aceptada')}
              className={`rounded-lg ${filtroEstado === 'aceptada' ? 'bg-[#2D7CF6]' : ''}`}
            >
              Aceptadas
            </Button>
            <Button
              variant={filtroEstado === 'retirada' ? 'default' : 'outline'}
              onClick={() => setFiltroEstado('retirada')}
              className={`rounded-lg ${filtroEstado === 'retirada' ? 'bg-[#2D7CF6]' : ''}`}
            >
              Retiradas
            </Button>
          </div>
        </Card>

        {/* Cotizaciones List */}
        <div className="space-y-4">
          {cotizacionesFiltradas.length === 0 ? (
            <Card className="p-12 text-center rounded-lg">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No hay cotizaciones {filtroEstado !== 'todas' ? `en estado "${filtroEstado}"` : ''}
              </p>
            </Card>
          ) : (
            cotizacionesFiltradas.map((cotizacion) => {
              const servicio = getServicio(cotizacion.servicioId);
              const estadoInfo = getEstadoBadge(cotizacion.estado);
              
              return (
                <Card key={cotizacion.id} className="p-6 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="mb-1">{servicio?.titulo || 'Servicio'}</h3>
                      <p className="text-sm text-gray-500">
                        {servicio?.categoria} • {servicio?.ciudad}
                      </p>
                    </div>
                    <Badge className={`${estadoInfo.bg} flex items-center gap-1`}>
                      {estadoInfo.icon}
                      {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Precio</p>
                      <p className="text-xl text-[#2D7CF6]">${cotizacion.precio.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Plazo</p>
                      <p>{cotizacion.plazo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Fecha envío</p>
                      <p>{new Date(cotizacion.fechaEnvio).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Notas</p>
                    <p className="text-sm text-gray-600">{cotizacion.notas}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Incluye</p>
                      <ul className="space-y-1">
                        {cotizacion.itemsIncluidos.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">No incluye</p>
                      <ul className="space-y-1">
                        {cotizacion.itemsExcluidos.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-4 h-4 flex items-center justify-center">✕</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {cotizacion.estado === 'enviada' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-lg"
                        onClick={() => handleEditarCotizacion(cotizacion)}
                      >
                        Editar cotización
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="flex-1 rounded-lg text-red-600 hover:text-red-700">
                            Retirar cotización
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Retirar cotización?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción retirará tu cotización del servicio. El solicitante no podrá seleccionarla. 
                              ¿Estás seguro de continuar?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRetirarCotizacion(cotizacion.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Sí, retirar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
