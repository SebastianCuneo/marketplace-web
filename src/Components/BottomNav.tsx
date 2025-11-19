import { Home, FileText, Package, User, Plus } from 'lucide-react';
import { UserRole, ROLES } from '../core';
import React from 'react';

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ role, activeTab, onTabChange }: BottomNavProps) {
  const getSolicitanteItems = () => [
    { id: 'servicios', icon: Home, label: 'Servicios' },
    { id: 'publicar', icon: Plus, label: 'Publicar' },
    { id: 'perfil', icon: User, label: 'Perfil' },
  ];

  const getProveedorServicioItems = () => [
    { id: 'servicios', icon: Home, label: 'Servicios' },
    { id: 'cotizaciones', icon: FileText, label: 'Cotizaciones' },
    { id: 'perfil', icon: User, label: 'Perfil' },
  ];

  const getProveedorInsumosItems = () => [
    { id: 'catalogo', icon: Package, label: 'Catálogo' },
    { id: 'ofertas', icon: FileText, label: 'Ofertas' },
    { id: 'perfil', icon: User, label: 'Perfil' },
  ];

  const getItems = () => {
    switch (role) {
      case ROLES.SOLICITANTE:
        return getSolicitanteItems();
      case ROLES.PROVEEDOR_SERVICIO:
        return getProveedorServicioItems();
      case ROLES.PROVEEDOR_INSUMOS:
        return getProveedorInsumosItems();
      default:
        return [];
    }
  };

  const items = getItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-6xl mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#2D7CF6]' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-[#2D7CF6]' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
