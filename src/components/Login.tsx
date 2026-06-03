import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '@/lib/firebase';
import { KeyRound, Mail, ShieldAlert, Sparkles } from 'lucide-react';

interface LoginProps {
  onLocalLogin?: (user: { email: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLocalLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      if (isFirebaseEnabled && auth) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Sesión iniciada correctamente');
      } else {
        // Fallback local en modo demo
        const mockUser = { email };
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        if (onLocalLogin) {
          onLocalLogin(mockUser);
        }
        toast.success('Sesión iniciada en Modo Demo');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Error al iniciar sesión. Inténtelo de nuevo.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = 'Credenciales incorrectas. Verifique su correo o contraseña.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'El formato del correo no es válido.';
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        {/* Adornos estéticos traseros */}
        <div className="absolute -top-12 -left-12 -z-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 -z-10 h-40 w-40 rounded-full bg-purple-400/20 blur-3xl" />

        <Card className="border-white/20 bg-white/70 shadow-2xl backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
              <KeyRound className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Ingresa al Sistema de Evaluaciones de Personal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {/* Aviso si no está configurado Firebase */}
              {!isFirebaseEnabled && (
                <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-800 backdrop-blur-md">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
                  <div>
                    <span className="font-bold">Modo Demo Local:</span> Puedes ingresar escribiendo cualquier correo (ej: <code className="bg-amber-100 px-1 py-0.5 rounded font-bold">test@tienda.com</code>) y cualquier contraseña.
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@tienda.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full gap-2 font-semibold shadow-lg" disabled={isLoading}>
                {isLoading ? (
                  'Iniciando Sesión...'
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Ingresar al Sistema
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
