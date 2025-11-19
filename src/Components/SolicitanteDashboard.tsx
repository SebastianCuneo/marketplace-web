import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Package, Clock, CheckCircle, FileText } from 'lucide-react';
import { Servicio } from '../core';
import { useAuth, useServices } from '../core';
import { SERVICE_STATES } from '../core';
import React from 'react';

interface SolicitanteDashboardProps {
  onPublicarServicio: () => void;
  onVerDetalle: (servicio: Servicio) => void;
}

export function SolicitanteDashboard({ onPublicarServicio, onVerDetalle }: SolicitanteDashboardProps) {
  const { user } = useAuth();
  const { services } = useServices();
  
  // Filtrar solo los servicios del usuario actual
  const servicios = services.filter(s => s.solicitanteId === user?.id);

  const getEstadoBadge = (estado: string) => {
    const styles = {
      [SERVICE_STATES.PUBLICADO]: 'bg-blue-100 text-blue-700',
      [SERVICE_STATES.EN_EVALUACION]: 'bg-purple-100 text-purple-700',
      [SERVICE_STATES.ASIGNADO]: 'bg-yellow-100 text-yellow-700',
      [SERVICE_STATES.COMPLETADO]: 'bg-green-100 text-green-700',
    };
    return styles[estado as keyof typeof styles] || styles[SERVICE_STATES.PUBLICADO];
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case SERVICE_STATES.PUBLICADO:
        return <Package className="w-4 h-4" />;
      case SERVICE_STATES.EN_EVALUACION:
        return <FileText className="w-4 h-4" />;
      case SERVICE_STATES.ASIGNADO:
        return <Clock className="w-4 h-4" />;
      case SERVICE_STATES.COMPLETADO:
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filtrarServicios = (estado: string) => {
    if (estado === 'todos') return servicios;
    return servicios.filter(s => s.estado === estado);
  };

  const ServicioCard = ({ servicio }: { servicio: Servicio }) => (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer rounded-lg"
      onClick={() => onVerDetalle(servicio)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="mb-1">{servicio.titulo}</h3>
          <p className="text-sm text-gray-500">{servicio.categoria}</p>
        </div>
        <Badge className={`${getEstadoBadge(servicio.estado)} flex items-center gap-1`}>
          {getEstadoIcon(servicio.estado)}
          {servicio.estado.charAt(0).toUpperCase() + servicio.estado.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>?? {servicio.ciudad}</span>
          <span>?? {new Date(servicio.fechaPreferida).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span>{servicio.insumosRequeridos.length} insumos requeridos</span>
          {servicio.estado === SERVICE_STATES.PUBLICADO && (
            <span className="text-[#2D7CF6]">Esperando cotizaciones ?</span>
          )}
          {servicio.estado === SERVICE_STATES.EN_EVALUACION && (
            <span className="text-purple-600">Ver cotizaciones ?</span>
          )}
          {servicio.estado === SERVICE_STATES.ASIGNADO && (
            <span className="text-green-600">✓ Cotización seleccionada</span>
          )}
          {servicio.estado === SERVICE_STATES.COMPLETADO && (
            <span className="text-gray-600">? Completado</span>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Mis Servicios</h1>
            <p className="text-gray-500">Gestiona tus solicitudes y cotizaciones</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#2D7CF6]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Publicados</p>
                <p className="text-2xl">
                  {servicios.filter(s => 
                    s.estado === SERVICE_STATES.PUBLICADO || 
                    s.estado === SERVICE_STATES.EN_EVALUACION
                  ).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En progreso</p>
                <p className="text-2xl">{servicios.filter(s => s.estado === SERVICE_STATES.ASIGNADO).length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completados</p>
                <p className="text-2xl">{servicios.filter(s => s.estado === SERVICE_STATES.COMPLETADO).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Services List */}
        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList className="bg-white rounded-lg">
            <TabsTrigger value="todos" className="rounded-lg">Todos</TabsTrigger>
            <TabsTrigger value={SERVICE_STATES.PUBLICADO} className="rounded-lg">Publicados</TabsTrigger>
            <TabsTrigger value={SERVICE_STATES.ASIGNADO} className="rounded-lg">Asignados</TabsTrigger>
            <TabsTrigger value={SERVICE_STATES.COMPLETADO} className="rounded-lg">Completados</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-4">
            {servicios.length === 0 ? (
              <Card className="p-12 text-center rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No has publicado servicios aún</p>
                <p className="text-sm text-gray-400 mt-2">Haz clic en el botón + para crear tu primer servicio</p>
              </Card>
            ) : (
              filtrarServicios('todos').map(servicio => (
                <ServicioCard key={servicio.id} servicio={servicio} />
              ))
            )}
          </TabsContent>

          <TabsContent value={SERVICE_STATES.PUBLICADO} className="space-y-4">
            {filtrarServicios(SERVICE_STATES.PUBLICADO).length === 0 ? (
              <Card className="p-12 text-center rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No tienes servicios publicados</p>
              </Card>
            ) : (
              filtrarServicios(SERVICE_STATES.PUBLICADO).map(servicio => (
                <ServicioCard key={servicio.id} servicio={servicio} />
              ))
            )}
          </TabsContent>

          <TabsContent value={SERVICE_STATES.ASIGNADO} className="space-y-4">
            {filtrarServicios(SERVICE_STATES.ASIGNADO).length === 0 ? (
              <Card className="p-12 text-center rounded-lg">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No tienes servicios asignados</p>
              </Card>
            ) : (
              filtrarServicios(SERVICE_STATES.ASIGNADO).map(servicio => (
                <ServicioCard key={servicio.id} servicio={servicio} />
              ))
            )}
          </TabsContent>

          <TabsContent value={SERVICE_STATES.COMPLETADO} className="space-y-4">
            {filtrarServicios(SERVICE_STATES.COMPLETADO).length === 0 ? (
              <Card className="p-12 text-center rounded-lg">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aún no tienes servicios completados</p>
              </Card>
            ) : (
              filtrarServicios(SERVICE_STATES.COMPLETADO).map(servicio => (
                <ServicioCard key={servicio.id} servicio={servicio} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <Button
          onClick={onPublicarServicio}
          className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-[#2D7CF6] hover:bg-[#1e5fd4] shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
