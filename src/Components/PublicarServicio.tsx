import { useState } from 'react';
import { Button } from './ui/button';  
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Insumo, Servicio } from '../core';
import React from 'react';
import { useAuth, useServices } from '../core';
import { SERVICE_STATES, CATEGORIES_ARRAY } from '../core';

interface PublicarServicioProps {
  onVolver: () => void;
}

export function PublicarServicio({ onVolver }: PublicarServicioProps) {
  // Contexts
  const { user } = useAuth();
  const { addService } = useServices();
  
  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');
  const [insumos, setInsumos] = useState<Insumo[]>([
    { id: '1', nombre: '', cantidad: 0, unidad: '' }
  ]);

  const agregarInsumo = () => {
    setInsumos([...insumos, { id: Date.now().toString(), nombre: '', cantidad: 0, unidad: '' }]);
  };

  const eliminarInsumo = (id: string) => {
    if (insumos.length > 1) {
      setInsumos(insumos.filter(i => i.id !== id));
    }
  };

  const actualizarInsumo = (id: string, campo: keyof Insumo, valor: string | number) => {
    setInsumos(insumos.map(i => i.id === id ? { ...i, [campo]: valor } : i));
  };

  const handleGuardarBorrador = () => {
    toast.success('Borrador guardado exitosamente');
    onVolver();
  };

  const handlePublicar = () => {
    // Validar campos obligatorios
    if (!titulo || !descripcion || !direccion || !ciudad || !fecha || !categoria) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    
    // Validar insumos
    const insumosValidos = insumos.filter(i => i.nombre && i.cantidad > 0 && i.unidad);
    if (insumosValidos.length === 0) {
      toast.error('Debes agregar al menos un insumo válido');
      return;
    }
    
    // Validar usuario logueado
    if (!user) {
      toast.error('Debes estar logueado para publicar un servicio');
      return;
    }
    
    // Crear servicio
    const nuevoServicio: Servicio = {
      id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      solicitanteId: user.id,
      titulo,
      descripcion,
      categoria,
      direccion,
      ciudad,
      fecha,
      fechaPreferida: fecha,
      insumos: insumosValidos,
      insumosRequeridos: insumosValidos,
      estado: SERVICE_STATES.PUBLICADO,
    };
    
    // Guardar en Context
    addService(nuevoServicio);
    
    toast.success('Servicio publicado exitosamente');
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
            <h1 className="text-2xl">Publicar Servicio</h1>
            <p className="text-gray-500">Describe el servicio que necesitas</p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-6 space-y-6 rounded-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del servicio *</Label>
              <Input
                id="titulo"
                placeholder="ej. Remodelación de cocina"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe en detalle el servicio que necesitas..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
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
                <Label htmlFor="fecha">Fecha deseada *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                placeholder="Calle y número"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Input
                id="ciudad"
                placeholder="ej. Madrid"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Insumos Section */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="mb-1">Insumos requeridos</h3>
                <p className="text-sm text-gray-500">Lista los materiales necesarios</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarInsumo}
                className="rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>

            <div className="space-y-3">
              {insumos.map((insumo, index) => (
                <div key={insumo.id} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`insumo-${insumo.id}`}>
                      {index === 0 ? 'Nombre' : ''}
                    </Label>
                    <Input
                      id={`insumo-${insumo.id}`}
                      placeholder="ej. Cemento"
                      value={insumo.nombre}
                      onChange={(e) => actualizarInsumo(insumo.id, 'nombre', e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="w-28 space-y-2">
                    <Label htmlFor={`cantidad-${insumo.id}`}>
                      {index === 0 ? 'Cantidad' : ''}
                    </Label>
                    <Input
                      id={`cantidad-${insumo.id}`}
                      type="number"
                      placeholder="0"
                      value={insumo.cantidad || ''}
                      onChange={(e) => actualizarInsumo(insumo.id, 'cantidad', parseFloat(e.target.value) || 0)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label htmlFor={`unidad-${insumo.id}`}>
                      {index === 0 ? 'Unidad' : ''}
                    </Label>
                    <Input
                      id={`unidad-${insumo.id}`}
                      placeholder="ej. kg"
                      value={insumo.unidad}
                      onChange={(e) => actualizarInsumo(insumo.id, 'unidad', e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => eliminarInsumo(insumo.id)}
                    disabled={insumos.length === 1}
                    className="rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleGuardarBorrador}
              className="flex-1 rounded-lg"
            >
              Guardar borrador
            </Button>
            <Button
              onClick={handlePublicar}
              className="flex-1 bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
            >
              Publicar servicio
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
