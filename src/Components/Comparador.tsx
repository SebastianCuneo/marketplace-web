import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Star, CheckCircle, Clock, Euro } from 'lucide-react';
import { Servicio } from '../core';
import { toast } from 'sonner';
import React from 'react';
import { useServices } from '../core';

interface ComparadorProps {
  servicio: Servicio;
  onVolver: () => void;
}

export function Comparador({ servicio, onVolver }: ComparadorProps) {
  const { state, selectQuotation } = useServices();
  const cotizaciones = state.quotes.filter(c => c.servicioId === servicio.id);

  const handleSeleccionar = (id: string) => {
    selectQuotation(servicio.id, id);
    toast.success('Cotización seleccionada - Servicio asignado');
    // Esperar un poco antes de volver para que el usuario vea el mensaje
    setTimeout(() => onVolver(), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <h1 className="text-2xl">Comparar Cotizaciones</h1>
            <p className="text-gray-500">{servicio.titulo}</p>
          </div>
        </div>

        {/* Comparison Cards View (Mobile) */}
        <div className="md:hidden space-y-4">
          {cotizaciones.map((cotizacion) => (
            <Card key={cotizacion.id} className={`p-6 rounded-lg ${
              servicio.cotizacionSeleccionada === cotizacion.id ? 'border-2 border-[#2D7CF6]' : ''
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="mb-1">{cotizacion.proveedorNombre}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{cotizacion.proveedorRating}</span>
                    </div>
                  </div>
                  {servicio.cotizacionSeleccionada === cotizacion.id && (
                    <Badge className="bg-green-100 text-green-700">
                      Seleccionada
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                      <Euro className="w-4 h-4" />
                      <span className="text-sm">Precio</span>
                    </div>
                    <p className="text-xl text-[#2D7CF6]">${cotizacion.precio.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Plazo</span>
                    </div>
                    <p>{cotizacion.plazo}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Incluye</p>
                  <ul className="space-y-1">
                    {cotizacion.itemsIncluidos.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleSeleccionar(cotizacion.id)}
                  className={`w-full rounded-lg ${
                    servicio.cotizacionSeleccionada === cotizacion.id
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-[#2D7CF6] hover:bg-[#1e5fd4]'
                  }`}
                >
                  {servicio.cotizacionSeleccionada === cotizacion.id ? 'Seleccionada' : 'Seleccionar'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Table View (Desktop) */}
        <div className="hidden md:block">
          <Card className="overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 w-48">Criterio</th>
                    {cotizaciones.map((cotizacion) => (
                      <th key={cotizacion.id} className="p-4 text-center">
                        <div className={`${
                          servicio.cotizacionSeleccionada === cotizacion.id ? 'bg-blue-50 border-2 border-[#2D7CF6]' : ''
                        } p-3 rounded-lg`}>
                          <p className="mb-1">{cotizacion.proveedorNombre}</p>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{cotizacion.proveedorRating}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Euro className="w-5 h-5 text-[#2D7CF6]" />
                        <span>Precio</span>
                      </div>
                    </td>
                    {cotizaciones.map((cotizacion) => (
                      <td key={cotizacion.id} className="p-4 text-center">
                        <p className="text-xl text-[#2D7CF6]">
                          ${cotizacion.precio.toLocaleString()}
                        </p>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-t bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#2D7CF6]" />
                        <span>Plazo</span>
                      </div>
                    </td>
                    {cotizaciones.map((cotizacion) => (
                      <td key={cotizacion.id} className="p-4 text-center">
                        <p>{cotizacion.plazo}</p>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-t">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2D7CF6]" />
                        <span>Incluye</span>
                      </div>
                    </td>
                    {cotizaciones.map((cotizacion) => (
                      <td key={cotizacion.id} className="p-4">
                        <ul className="space-y-1">
                          {cotizacion.itemsIncluidos.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-left">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-t bg-gray-50">
                    <td className="p-4">Notas</td>
                    {cotizaciones.map((cotizacion) => (
                      <td key={cotizacion.id} className="p-4">
                        <p className="text-sm text-gray-600">{cotizacion.notas}</p>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-t">
                    <td className="p-4">Acción</td>
                    {cotizaciones.map((cotizacion) => (
                      <td key={cotizacion.id} className="p-4">
                        <Button
                          onClick={() => handleSeleccionar(cotizacion.id)}
                          className={`w-full rounded-lg ${
                            servicio.cotizacionSeleccionada === cotizacion.id
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-[#2D7CF6] hover:bg-[#1e5fd4]'
                          }`}
                        >
                          {servicio.cotizacionSeleccionada === cotizacion.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Seleccionada
                            </>
                          ) : (
                            'Seleccionar'
                          )}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
