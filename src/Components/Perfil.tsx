import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { User, Mail, Phone, Star, LogOut } from 'lucide-react';
import { UserRole } from '../core';
import React from 'react';
import { useAuth } from '../core';
import { ROLES } from '../core';

interface PerfilProps {
  role: UserRole;
  onLogout: () => void;
}

export function Perfil({ role, onLogout }: PerfilProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const getRoleName = (rol: UserRole) => {
    const names = {
      [ROLES.SOLICITANTE]: 'Solicitante de Servicios',
      [ROLES.PROVEEDOR_SERVICIO]: 'Proveedor de Servicios',
      [ROLES.PROVEEDOR_INSUMOS]: 'Proveedor de Insumos',
    };
    return names[rol] || rol;
  };
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl mb-1">Mi Perfil</h1>
          <p className="text-gray-500">Gestiona tu informaci�n personal</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 rounded-lg">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-[#2D7CF6] rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="mb-2">{user.nombre}</h2>
            <Badge className="bg-blue-100 text-blue-700">
              {getRoleName(user.rol)}
            </Badge>
            {user.rating && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg">{user.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">/5.0</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="nombre"
                  value={user.nombre}
                  disabled={!isEditing}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled={!isEditing}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Tel�fono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="telefono"
                  type="tel"
                  value={user.telefono || ''}
                  disabled={!isEditing}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
              >
                Editar perfil
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
                >
                  Guardar cambios
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Stats Card (for providers) */}
        {role !== ROLES.SOLICITANTE && (
          <Card className="p-6 rounded-lg">
            <h3 className="mb-4">Estad�sticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl text-[#2D7CF6] mb-1">
                  {role === ROLES.PROVEEDOR_SERVICIO ? '12' : '45'}
                </p>
                <p className="text-sm text-gray-600">
                  {role === ROLES.PROVEEDOR_SERVICIO ? 'Servicios realizados' : 'Insumos en cat�logo'}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl text-green-600 mb-1">
                  {role === ROLES.PROVEEDOR_SERVICIO ? '8' : '23'}
                </p>
                <p className="text-sm text-gray-600">
                  {role === ROLES.PROVEEDOR_SERVICIO ? 'Cotizaciones activas' : 'Ofertas enviadas'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Settings Card */}
        <Card className="p-6 rounded-lg">
          <h3 className="mb-4">Configuraci�n</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start rounded-lg">
              Notificaciones
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-lg">
              Privacidad y seguridad
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-lg">
              Ayuda y soporte
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-lg">
              T�rminos y condiciones
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar sesi�n
        </Button>
      </div>
    </div>
  );
}
