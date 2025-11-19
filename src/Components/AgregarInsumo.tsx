// Importaciones de React y hooks
import { useState } from 'react';
// Componentes de interfaz reutilizables (shadcn/ui)
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
// Iconos de Lucide React
import { ArrowLeft } from 'lucide-react';
// Sistema de notificaciones toast
import { toast } from 'sonner';
import React from 'react';

// Interface que define las props que recibe el componente
interface AgregarInsumoProps {
  onVolver: () => void; // Funci�n para volver a la pantalla anterior
}

// Componente para agregar un nuevo insumo al cat�logo
export function AgregarInsumo({ onVolver }: AgregarInsumoProps) {
  // Estados para manejar los datos del formulario
  const [nombre, setNombre] = useState(''); // Nombre del insumo
  const [categoria, setCategoria] = useState(''); // Categor�a del insumo
  const [unidad, setUnidad] = useState(''); // Unidad de medida
  const [precioUnitario, setPrecioUnitario] = useState(''); // Precio por unidad
  const [stock, setStock] = useState(''); // Cantidad en stock

  const handleGuardar = () => {
    if (!nombre || !categoria || !unidad || !precioUnitario || !stock) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    toast.success('Insumo agregado al cat�logo exitosamente');
    onVolver();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
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
            <h1 className="text-2xl">Agregar Insumo</h1>
            <p className="text-gray-500">A�ade un nuevo insumo a tu cat�logo</p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-6 space-y-6 rounded-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del insumo *</Label>
              <Input
                id="nombre"
                placeholder="ej. Cemento Portland"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categor�a *</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Selecciona una categor�a" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Construcci�n">Construcci�n</SelectItem>
                    <SelectItem value="Electricidad">Electricidad</SelectItem>
                    <SelectItem value="Plomer�a">Plomer�a</SelectItem>
                    <SelectItem value="Pintura">Pintura</SelectItem>
                    <SelectItem value="Revestimientos">Revestimientos</SelectItem>
                    <SelectItem value="Herramientas">Herramientas</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidad">Unidad de medida *</Label>
                <Select value={unidad} onValueChange={setUnidad}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Selecciona unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidad">Unidad</SelectItem>
                    <SelectItem value="kg">Kilogramo (kg)</SelectItem>
                    <SelectItem value="litro">Litro</SelectItem>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="m�">Metro cuadrado (m�)</SelectItem>
                    <SelectItem value="saco">Saco</SelectItem>
                    <SelectItem value="caja">Caja</SelectItem>
                    <SelectItem value="paquete">Paquete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio unitario (�) *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock disponible *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {nombre && precioUnitario && stock && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-500 mb-2">Vista previa</p>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="mb-1">{nombre}</h3>
                  <p className="text-sm text-gray-600">{categoria || 'Sin categor�a'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl text-[#2D7CF6]">�{parseFloat(precioUnitario).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Stock: {stock} {unidad}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onVolver}
              className="flex-1 rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGuardar}
              className="flex-1 bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
            >
              Guardar insumo
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
