import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, MapPin, Calendar, Package, Star, CheckCircle } from 'lucide-react';
import { Servicio } from '../core';
import { toast } from 'sonner';
import React from 'react';
import { useAuth, useServices } from '../core';
import { SERVICE_STATES } from '../core';

interface DetalleServicioProps {
  servicio: Servicio;
  onVolver: () => void;
  onComparar?: () => void;
}

export function DetalleServicio({ servicio, onVolver, onComparar }: DetalleServicioProps) {
  const { user } = useAuth();
  const { state, selectQuotation } = useServices();
  
  // Obtener cotizaciones y ofertas del Context
  const cotizaciones = state.quotes?.filter(c => c.servicioId === servicio.id) || [];
  const ofertas = state.supplyOffers?.filter(o => o.servicioId === servicio.id) || [];

  const handleSeleccionarCotizacion = (cotizacionId: string) => {
    selectQuotation(servicio.id, cotizacionId);
    toast.success('Cotización seleccionada exitosamente');
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
          <div className="flex-1">
            <h1 className="text-2xl mb-1">{servicio.titulo}</h1>
            <p className="text-gray-500">{servicio.categoria}</p>
          </div>
        </div>

        {/* Service Details */}
        <Card className="p-6 space-y-4 rounded-lg">
          <div className="space-y-3">
            <h3>Descripción</h3>
            <p className="text-gray-600">{servicio.descripcion}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-[#2D7CF6]" />
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p>{servicio.direccion}, {servicio.ciudad}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5 text-[#2D7CF6]" />
              <div>
                <p className="text-sm text-gray-500">Fecha deseada</p>
                <p>{new Date(servicio.fechaPreferida || servicio.fecha).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-[#2D7CF6]" />
              <h3>Insumos requeridos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(servicio.insumosRequeridos || servicio.insumos).map((insumo) => (
                <div key={insumo.id} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span>{insumo.nombre}</span>
                  <span className="text-gray-600">{insumo.cantidad} {insumo.unidad}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="cotizaciones" className="space-y-4">
          <TabsList className="bg-white rounded-lg">
            <TabsTrigger value="cotizaciones" className="rounded-lg">
              Cotizaciones ({cotizaciones.length})
            </TabsTrigger>
            <TabsTrigger value="insumos" className="rounded-lg">
              Ofertas Insumos ({ofertas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cotizaciones" className="space-y-4">
            {cotizaciones.length === 0 ? (
              <Card className="p-12 text-center rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aún no hay cotizaciones para este servicio</p>
                <p className="text-sm text-gray-400 mt-2">
                  Los proveedores comenzarán a enviar cotizaciones pronto
                </p>
              </Card>
            ) : (
              <>
                {onComparar && cotizaciones.length > 1 && (
                  <Button
                    onClick={onComparar}
                    variant="outline"
                    className="w-full rounded-lg"
                  >
                    Comparar todas las cotizaciones
                  </Button>
                )}
                
                {cotizaciones.map((cotizacion) => (
                  <Card key={cotizacion.id} className={`p-6 rounded-lg ${
                    servicio.cotizacionSeleccionada === cotizacion.id ? 'border-2 border-[#2D7CF6]' : ''
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="mb-1">{cotizacion.proveedorNombre}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{cotizacion.proveedorRating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-[#2D7CF6]">${cotizacion.precio.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{cotizacion.plazo}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Notas</p>
                        <p className="text-gray-600">{cotizacion.notas}</p>
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
                    </div>

                    {servicio.cotizacionSeleccionada === cotizacion.id ? (
                      <Badge className="w-full justify-center bg-green-100 text-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Cotización seleccionada
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleSeleccionarCotizacion(cotizacion.id)}
                        className="w-full bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
                        disabled={cotizacion.estado === 'retirada'}
                      >
                        Seleccionar esta cotización
                      </Button>
                    )}
                  </Card>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="insumos" className="space-y-4">
            {ofertas.length === 0 ? (
              <Card className="p-12 text-center rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aún no hay ofertas de insumos</p>
              </Card>
            ) : (
              ofertas.map((oferta) => (
                <Card key={oferta.id} className="p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="mb-1">{oferta.proveedorNombre}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(oferta.fechaEnvio).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <p className="text-2xl text-[#2D7CF6]">${oferta.total.toFixed(2)}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {oferta.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p>{item.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {item.cantidad} × ${item.precioUnitario}
                          </p>
                        </div>
                        <p>${item.subtotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {oferta.notas && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">{oferta.notas}</p>
                    </div>
                  )}

                  <Button className="w-full bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg">
                    Aceptar oferta
                  </Button>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
