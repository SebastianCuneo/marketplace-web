import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Package2 } from 'lucide-react';
import React from 'react';
import { useAuth } from '../core';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, state } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que haya email y contraseña
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }
    
    if (!password) {
      setError('Por favor ingresa tu contraseña');
      return;
    }
    
    // Intentar hacer login con el contexto
    const success = login(email, password);
    
    if (success) {
      // Login exitoso, limpiar error y continuar al dashboard
      setError('');
      onLogin();
    } else {
      // Login fallido, mostrar error
      setError(state.error || 'Email o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#2D7CF6] rounded-2xl flex items-center justify-center">
              <Package2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl">Marketplace de Servicios</h1>
          <p className="text-gray-500">
            Conecta con proveedores de servicios e insumos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#2D7CF6] hover:bg-[#1e5fd4] rounded-lg"
          >
            Ingresar
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>¿No tienes cuenta? <span className="text-[#2D7CF6] cursor-pointer">Regístrate</span></p>
        </div>

        {/* Credenciales de prueba */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">💡 Credenciales de prueba:</p>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Solicitante:</strong> solicitante@marketplace.com / solicitante123</p>
            <p><strong>Proveedor Servicio:</strong> proveedor@marketplace.com / proveedor123</p>
            <p><strong>Proveedor Insumos:</strong> insumos@marketplace.com / insumos123</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
