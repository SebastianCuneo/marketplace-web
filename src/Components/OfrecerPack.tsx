import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { ArrowLeft, Plus, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { mockServicios, mockInsumosCatalogo } from '../core';
import React from 'react';
import { SERVICE_STATES } from '../core';

interface OfrecerPackProps {
  onVolver: () => void;
}

interface ItemPack {
  id: string;
  insumoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export function OfrecerPack({ onVolver }: OfrecerPackProps) {
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [items, setItems] = useState<ItemPack[]>([]);
  const [notas, setNotas] = useState('');

  const serviciosDisponibles = mockServicios.filter(s => s.estado === SERVICE_STATES.PUBLICADO);

  const agregarItem = () => {
    const nuevoItem: ItemPack = {
      id: Date.now().toString(),
      insumoId: '',
      nombre: '',
      cantidad: 0,
      precioUnitario: 0,
      subtotal: 0,
    };
    setItems([...items, nuevoItem]);
  };

  const eliminarItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const actualizarItem = (id: string, insumoId: string) => {
    const insumo = mockInsumosCatalogo.find(i => i.id === insumoId);
    if (!insumo) return;

    setItems(items.map(i => {
      if (i.id === id) {
        const cantidad = i.cantidad || 1;
        return {
          ...i,
          insumoId,
          nombre: insumo.nombre,
          precioUnitario: insumo.precioUnitario,
          subtotal: cantidad * insumo.precioUnitario,
        };
      }
      return i;
    }));
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    setItems(items.map(i => {
      if (i.id === id) {
        return {
          ...i,
          cantidad,
          subtotal: cantidad * i.precioUnitario,
        };
      }
      return i;
    }));
  };

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleEnviar = () => {
    if (!servicioSeleccionado) {
      toast.error('Por favor selecciona un servicio');
      return;
    }
    if (items.length === 0 || items.some(i => !i.insumoId || i.cantidad === 0)) {
      toast.error('Por favor completa todos los items del pack');
      return;
    }
    toast.success('Oferta de pack enviada exitosamente');
    onVolver();
  };

  const servicioInfo = serviciosDisponibles.find(s => s.id === servicioSeleccionado);

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-20">
      <div className="max-w-3xl mx-auto space-y-6">
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
            <h1 className="text-2xl">Ofrecer Pack de Insumos</h1>
            <p className="text-gray-500">Crea una oferta para un servicio</p>
          </div>
        </div>

        {/* Service Selection */}
        <Card className="p-6 space-y-4 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="servicio">Seleccionar servicio *</Label>
            <Select value={servicioSeleccionado} onValueChange={setServicioSeleccionado}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {serviciosDisponibles.map(servicio => (
                  <SelectItem key={servicio.id} value={servicio.id}>
                    {servicio.titulo} - {servicio.ciudad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {servicioInfo && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="mb-2">Insumos requeridos</h3>
              <div className="space-y-1">
                {servicioInfo.insumos.map(insumo => (
                  <div key={insumo.id} className="flex justify-between text-sm">
                    <span>{insumo.nombre}</span>
                    <span className="text-gray-600">{insumo.cantidad} {insumo.unidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Items Pack */}
        <Card className="p-6 space-y-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3>Items del pack</h3>
              <p className="text-sm text-gray-500">Selecciona los insumos a ofrecer</p>
            </div>
            <Button
              onClick={agregarItem}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar item
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed rounded-lg">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Aún no has agregado items</p>
              <Button
                onClick={agregarItem}
                variant="outline"
                className="mt-4 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar primer item
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 items-end p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label>Insumo</Label>
                    <Select 
                      value={item.insumoId} 
                      onValueChange={(value) => actualizarItem(item.id, value)}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Selecciona insumo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInsumosCatalogo.map(insumo => (
                          <SelectItem key={insumo.id} value={insumo.id}>
                            {insumo.nombre} - ${insumo.precioUnitario}/{insumo.unidad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-28 space-y-2">
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.cantidad || ''}
                      onChange={(e) => actualizarCantidad(item.id, parseFloat(e.target.value) || 0)}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="w-32 space-y-2">
                    <Label>Subtotal</Label>
                    <div className="h-10 px-3 flex items-center bg-gray-50 rounded-lg">
                      <span className="text-[#2D7CF6]">${item.subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => eliminarItem(item.id)}
                    className="rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="flex justify-end items-center p-4 bg-gray-50 rounded-lg">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl text-[#2D7CF6]">${calcularTotal().toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Notes */}
        <Card className="p-6 space-y-4 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="notas">Notas adicionales</Label>
            <Textarea
              id="notas"
              placeholder="Información sobre entrega, descuentos, etc."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="rounded-lg"
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onVolver}
            className="flex-1 rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEnviar}
            className="flex-1 bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
          >
            Enviar oferta
          </Button>
        </div>
      </div>
    </div>
  );
}
