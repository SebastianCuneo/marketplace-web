import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, MapPin, Calendar, Package, Filter } from 'lucide-react';
import { Servicio, CATEGORIES_ARRAY } from '../core';
import React from 'react';
import { useServices } from '../core';
import { SERVICE_STATES } from '../core';

interface ProveedorServicioDashboardProps {
  onVerServicio: (servicio: Servicio) => void;
  onEnviarCotizacion: (servicio: Servicio) => void;
  onVerMisCotizaciones: () => void;
}

export function ProveedorServicioDashboard({ 
  onVerServicio, 
  onEnviarCotizacion,
  onVerMisCotizaciones 
}: ProveedorServicioDashboardProps) {
  const { services } = useServices();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [ciudadFiltro, setCiudadFiltro] = useState('todas');

  const serviciosDisponibles = services.filter(s => 
    s.estado === SERVICE_STATES.PUBLICADO || s.estado === SERVICE_STATES.EN_EVALUACION
  );

  const serviciosFiltrados = serviciosDisponibles.filter(servicio => {
    const matchBusqueda = servicio.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                         servicio.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro === 'todas' || 
                          servicio.categoria.toLowerCase() === categoriaFiltro.toLowerCase();
    const matchCiudad = ciudadFiltro === 'todas' || servicio.ciudad === ciudadFiltro;
    
    return matchBusqueda && matchCategoria && matchCiudad;
  });

  const ciudadesUnicas = ['todas', ...Array.from(new Set(serviciosDisponibles.map(s => s.ciudad)))];

  const ServicioCard = ({ servicio }: { servicio: Servicio }) => (
    <Card className="p-4 hover:shadow-md transition-shadow rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="mb-1">{servicio.titulo}</h3>
          <Badge className="bg-blue-100 text-blue-700">{servicio.categoria}</Badge>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{servicio.descripcion}</p>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#2D7CF6]" />
          <span>{servicio.direccion}, {servicio.ciudad}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2D7CF6]" />
          <span>{new Date(servicio.fechaPreferida || servicio.fecha).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#2D7CF6]" />
          <span>{(servicio.insumosRequeridos || servicio.insumos).length} insumos requeridos</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onVerServicio(servicio)}
          className="flex-1 rounded-lg"
        >
          Ver detalles
        </Button>
        <Button
          onClick={() => onEnviarCotizacion(servicio)}
          className="flex-1 bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
        >
          Enviar cotización
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Servicios Disponibles</h1>
            <p className="text-gray-500">Encuentra servicios para cotizar</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 space-y-4 rounded-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar servicios..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Categoría</span>
              </div>
              <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                <SelectTrigger className="rounded-lg bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="todas" className="bg-white hover:bg-gray-100">Todas las categorías</SelectItem>
                  {CATEGORIES_ARRAY.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()} className="bg-white hover:bg-gray-100">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Ciudad</span>
              </div>
              <Select value={ciudadFiltro} onValueChange={setCiudadFiltro}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ciudadesUnicas.map(ciudad => (
                    <SelectItem key={ciudad} value={ciudad}>
                      {ciudad === 'todas' ? 'Todas las ciudades' : ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="disponibles" className="space-y-4">
          <TabsList className="bg-white rounded-lg">
            <TabsTrigger value="disponibles" className="rounded-lg">
              Disponibles ({serviciosFiltrados.length})
            </TabsTrigger>
            <TabsTrigger value="mis-cotizaciones" className="rounded-lg">
              Mis Cotizaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disponibles" className="space-y-4">
            {serviciosFiltrados.length === 0 ? (
              <Card className="p-12 text-center rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {busqueda || categoriaFiltro !== 'todas' || ciudadFiltro !== 'todas'
                    ? 'No se encontraron servicios con los filtros aplicados'
                    : 'No hay servicios disponibles en este momento'}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviciosFiltrados.map(servicio => (
                  <ServicioCard key={servicio.id} servicio={servicio} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mis-cotizaciones">
            <Card 
              className="p-12 text-center rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={onVerMisCotizaciones}
            >
              <Package className="w-12 h-12 text-[#2D7CF6] mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Ver todas mis cotizaciones</p>
              <Button className="bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg">
                Ir a Mis Cotizaciones
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
