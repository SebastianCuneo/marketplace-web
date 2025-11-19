import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { InsumosCatalogo, useInsumos, useAuth } from '../core';
import { toast } from 'sonner';
import React from 'react';

interface ProveedorInsumosDashboardProps {
  onAgregarInsumo: () => void;
  onEditarInsumo: (insumo: InsumosCatalogo) => void;
  onOfrecerPack: () => void;
}

export function ProveedorInsumosDashboard({ onAgregarInsumo, onEditarInsumo, onOfrecerPack }: ProveedorInsumosDashboardProps) {
  const { state, deleteSupply } = useInsumos();
  const { user } = useAuth();
  
  // Filtrar solo los insumos del proveedor actual
  const insumos = state.supplies.filter(s => s.proveedorId === user?.id);

  const handleEliminar = (id: string) => {
    deleteSupply(id);
    toast.success('Insumo eliminado del catálogo');
  };
  
  const handleEditar = (insumo: InsumosCatalogo) => {
    onEditarInsumo(insumo);
  };

  const categoriasUnicas = Array.from(new Set(insumos.map(i => i.categoria)));

  const InsumoCard = ({ insumo }: { insumo: InsumosCatalogo }) => (
    <Card className="p-4 hover:shadow-md transition-shadow rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="mb-1">{insumo.nombre}</h3>
          <Badge className="bg-blue-100 text-blue-700">{insumo.categoria}</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditar(insumo)}
            className="rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEliminar(insumo.id)}
            className="rounded-lg text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-500">Precio unitario</p>
          <p className="text-xl text-[#2D7CF6]">${insumo.precioUnitario.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Stock disponible</p>
          <p className="text-xl">{insumo.stock} {insumo.unidad}</p>
        </div>
      </div>

      <div className={`p-2 rounded-lg text-center text-sm ${
        insumo.stock > 50 ? 'bg-green-50 text-green-700' :
        insumo.stock > 10 ? 'bg-yellow-50 text-yellow-700' :
        'bg-red-50 text-red-700'
      }`}>
        {insumo.stock > 50 ? '? Stock suficiente' :
         insumo.stock > 10 ? '? Stock medio' :
         '? Stock bajo'}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Catálogo de Insumos</h1>
            <p className="text-gray-500">Gestiona tu inventario y ofertas</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#2D7CF6]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total insumos</p>
                <p className="text-2xl">{insumos.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock alto</p>
                <p className="text-2xl">{insumos.filter(i => i.stock > 50).length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock medio</p>
                <p className="text-2xl">{insumos.filter(i => i.stock > 10 && i.stock <= 50).length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock bajo</p>
                <p className="text-2xl">{insumos.filter(i => i.stock <= 10).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={onAgregarInsumo}
            className="h-20 bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
          >
            <Plus className="w-6 h-6 mr-2" />
            Agregar nuevo insumo
          </Button>
          <Button
            onClick={onOfrecerPack}
            variant="outline"
            className="h-20 rounded-lg"
          >
            <Package className="w-6 h-6 mr-2" />
            Ofrecer pack a servicio
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList className="bg-white rounded-lg">
            <TabsTrigger value="todos" className="rounded-lg">
              Todos ({insumos.length})
            </TabsTrigger>
            {categoriasUnicas.map(categoria => (
              <TabsTrigger key={categoria} value={categoria} className="rounded-lg">
                {categoria} ({insumos.filter(i => i.categoria === categoria).length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="todos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insumos.map(insumo => (
              <InsumoCard key={insumo.id} insumo={insumo} />
            ))}
          </TabsContent>

          {categoriasUnicas.map(categoria => (
            <TabsContent key={categoria} value={categoria} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insumos.filter(i => i.categoria === categoria).map(insumo => (
                <InsumoCard key={insumo.id} insumo={insumo} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
