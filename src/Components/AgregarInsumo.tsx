// Importaciones de React y hooks
import { useState, useEffect } from 'react';
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
import { InsumosCatalogo, useInsumos, useAuth, CATEGORIES_ARRAY, UNITS_OPTIONS } from '../core';

// Interface que define las props que recibe el componente
interface AgregarInsumoProps {
  onVolver: () => void; // Función para volver a la pantalla anterior
  insumoToEdit?: InsumosCatalogo | null; // Insumo a editar (opcional)
}

// Componente para agregar/editar un insumo al catálogo
export function AgregarInsumo({ onVolver, insumoToEdit }: AgregarInsumoProps) {
  const { addSupply, updateSupply } = useInsumos();
  const { user } = useAuth();
  
  // Estados para manejar los datos del formulario
  const [nombre, setNombre] = useState(''); // Nombre del insumo
  const [categoria, setCategoria] = useState(''); // Categoría del insumo
  const [unidad, setUnidad] = useState(''); // Unidad de medida
  const [precioUnitario, setPrecioUnitario] = useState(''); // Precio por unidad
  const [stock, setStock] = useState(''); // Cantidad en stock

  // Si hay un insumo para editar, cargar sus datos
  useEffect(() => {
    if (insumoToEdit) {
      setNombre(insumoToEdit.nombre);
      setCategoria(insumoToEdit.categoria);
      setUnidad(insumoToEdit.unidad);
      setPrecioUnitario(insumoToEdit.precioUnitario.toString());
      setStock(insumoToEdit.stock.toString());
    }
  }, [insumoToEdit]);

  const handleGuardar = () => {
    if (!nombre || !categoria || !unidad || !precioUnitario || !stock) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    if (!user) {
      toast.error('Debes estar logueado');
      return;
    }

    if (insumoToEdit) {
      // Modo edición
      updateSupply(insumoToEdit.id, {
        nombre,
        categoria,
        unidad,
        precioUnitario: parseFloat(precioUnitario),
        stock: parseInt(stock),
      });
      toast.success('Insumo actualizado exitosamente');
    } else {
      // Modo creación
      const nuevoInsumo: InsumosCatalogo = {
        id: `sup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        proveedorId: user.id,
        nombre,
        categoria,
        unidad,
        precioUnitario: parseFloat(precioUnitario),
        stock: parseInt(stock),
      };
      addSupply(nuevoInsumo);
      toast.success('Insumo agregado al catálogo exitosamente');
    }
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
            <h1 className="text-2xl">{insumoToEdit ? 'Editar Insumo' : 'Agregar Insumo'}</h1>
            <p className="text-gray-500">
              {insumoToEdit ? 'Modifica los datos del insumo' : 'Añade un nuevo insumo a tu catálogo'}
            </p>
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
                <Label htmlFor="categoria">Categoría *</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="rounded-lg bg-white">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {CATEGORIES_ARRAY.map((cat) => (
                      <SelectItem key={cat} value={cat} className="bg-white hover:bg-gray-100">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidad">Unidad de medida *</Label>
                <Select value={unidad} onValueChange={setUnidad}>
                  <SelectTrigger className="rounded-lg bg-white">
                    <SelectValue placeholder="Selecciona unidad" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {UNITS_OPTIONS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value} className="bg-white hover:bg-gray-100">
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio unitario ($) *</Label>
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
                  <p className="text-sm text-gray-600">{categoria || 'Sin categoría'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl text-[#2D7CF6]">${parseFloat(precioUnitario).toFixed(2)}</p>
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
              {insumoToEdit ? 'Actualizar insumo' : 'Guardar insumo'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
