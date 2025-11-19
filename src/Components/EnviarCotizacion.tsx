import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import type { Servicio, Cotizacion } from '../core';
import { toast } from 'sonner';
import React from 'react';
import { useAuth, useServices } from '../core';

interface EnviarCotizacionProps {
  servicio: Servicio;
  onVolver: () => void;
}

export function EnviarCotizacion({ servicio, onVolver }: EnviarCotizacionProps) {
  const { user } = useAuth();
  const { addQuotation } = useServices();
  
  const [precio, setPrecio] = useState('');
  const [plazo, setPlazo] = useState('');
  const [notas, setNotas] = useState('');
  const [itemsIncluidos, setItemsIncluidos] = useState<string[]>(['']);
  const [itemsExcluidos, setItemsExcluidos] = useState<string[]>(['']);

  const agregarItemIncluido = () => {
    setItemsIncluidos([...itemsIncluidos, '']);
  };

  const agregarItemExcluido = () => {
    setItemsExcluidos([...itemsExcluidos, '']);
  };

  const eliminarItemIncluido = (index: number) => {
    if (itemsIncluidos.length > 1) {
      setItemsIncluidos(itemsIncluidos.filter((_, i) => i !== index));
    }
  };

  const eliminarItemExcluido = (index: number) => {
    if (itemsExcluidos.length > 1) {
      setItemsExcluidos(itemsExcluidos.filter((_, i) => i !== index));
    }
  };

  const actualizarItemIncluido = (index: number, valor: string) => {
    const nuevos = [...itemsIncluidos];
    nuevos[index] = valor;
    setItemsIncluidos(nuevos);
  };

  const actualizarItemExcluido = (index: number, valor: string) => {
    const nuevos = [...itemsExcluidos];
    nuevos[index] = valor;
    setItemsExcluidos(nuevos);
  };

  const handleEnviar = () => {
    if (!precio || !plazo) {
      toast.error('Por favor completa el precio y el plazo');
      return;
    }
    
    if (!user) {
      toast.error('Debes estar logueado para enviar una cotizaci�n');
      return;
    }
    
    const nuevaCotizacion: Cotizacion = {
      id: `cot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      servicioId: servicio.id,
      proveedorId: user.id,
      proveedorNombre: user.nombre,
      proveedorRating: user.rating || 4.0,
      precio: parseFloat(precio),
      plazo,
      notas,
      itemsIncluidos: itemsIncluidos.filter(i => i.trim() !== ''),
      itemsExcluidos: itemsExcluidos.filter(i => i.trim() !== ''),
      estado: 'enviada',
      fechaEnvio: new Date().toISOString(),
    };
    
    addQuotation(nuevaCotizacion);
    toast.success('Cotizaci�n enviada exitosamente');
    onVolver();
  };

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
            <h1 className="text-2xl">Enviar Cotizaci�n</h1>
            <p className="text-gray-500">{servicio.titulo}</p>
          </div>
        </div>

        {/* Service Info */}
        <Card className="p-4 bg-blue-50 border-blue-200 rounded-lg">
          <h3 className="mb-2">Resumen del servicio</h3>
          <p className="text-sm text-gray-600 mb-2">{servicio.descripcion}</p>
          <div className="text-sm text-gray-600">
            <p>?? {servicio.ciudad}</p>
            <p>?? {new Date(servicio.fecha).toLocaleDateString('es-ES')}</p>
            <p>?? {servicio.insumos.length} insumos requeridos</p>
          </div>
        </Card>

        {/* Form */}
        <Card className="p-6 space-y-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio total (�) *</Label>
              <Input
                id="precio"
                type="number"
                placeholder="0.00"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plazo">Plazo de ejecuci�n *</Label>
              <Input
                id="plazo"
                placeholder="ej. 15 d�as"
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas adicionales</Label>
            <Textarea
              id="notas"
              placeholder="Informaci�n adicional sobre tu cotizaci�n..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="rounded-lg"
            />
          </div>

          {/* Items Incluidos */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <Label>Servicios incluidos</Label>
                <p className="text-sm text-gray-500">�Qu� incluye tu cotizaci�n?</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarItemIncluido}
                className="rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>

            <div className="space-y-2">
              {itemsIncluidos.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="ej. Instalaci�n completa"
                    value={item}
                    onChange={(e) => actualizarItemIncluido(index, e.target.value)}
                    className="rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => eliminarItemIncluido(index)}
                    disabled={itemsIncluidos.length === 1}
                    className="rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Items Excluidos */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <Label>No incluye</Label>
                <p className="text-sm text-gray-500">�Qu� no incluye tu cotizaci�n?</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarItemExcluido}
                className="rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>

            <div className="space-y-2">
              {itemsExcluidos.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="ej. Materiales"
                    value={item}
                    onChange={(e) => actualizarItemExcluido(index, e.target.value)}
                    className="rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => eliminarItemExcluido(index)}
                    disabled={itemsExcluidos.length === 1}
                    className="rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
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
              Enviar cotizaci�n
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
