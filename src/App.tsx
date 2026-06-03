import { useState, useEffect } from 'react';
import { EvaluationForm } from './components/EvaluationForm';
import { Dashboard } from './components/Dashboard';
import { PersonnelMatrix } from './components/PersonnelMatrix';
import { GoogleFormExport } from './components/GoogleFormExport';
import { Login } from './components/Login';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, LayoutDashboard, Table as TableIcon, FileOutput, LogOut, User, Loader2 } from 'lucide-react';
import { auth, isFirebaseEnabled } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'evaluate' | 'dashboard' | 'matrix' | 'export'>('evaluate');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({ email: firebaseUser.email || '' });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      return unsubscribe;
    } else {
      // Fallback local en modo demo
      const localUser = localStorage.getItem('demo_user');
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
      setIsLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (isFirebaseEnabled && auth) {
        await signOut(auth);
      } else {
        localStorage.removeItem('demo_user');
        setUser(null);
      }
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
          <span className="text-sm font-medium text-muted-foreground">Iniciando sistema...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] font-sans">
        <Login onLocalLogin={(u) => setUser(u)} />
      </div>
    );
  }

  // Obtener el nombre legible a partir del correo
  const getDisplayName = (email: string) => {
    const prefix = email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#1a1a1a]">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-md">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">
              Evaluación Tienda
            </h1>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant={activeTab === 'evaluate' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('evaluate')}
              className="gap-2 text-xs sm:text-sm h-9 px-3"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Evaluar</span>
            </Button>
            <Button 
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('dashboard')}
              className="gap-2 text-xs sm:text-sm h-9 px-3"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            <Button 
              variant={activeTab === 'matrix' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('matrix')}
              className="gap-2 text-xs sm:text-sm h-9 px-3"
            >
              <TableIcon className="h-4 w-4" />
              <span>Matriz</span>
            </Button>
            <Button 
              variant={activeTab === 'export' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('export')}
              className="gap-2 text-xs sm:text-sm h-9 px-3"
            >
              <FileOutput className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Perfil de Usuario y Cerrar Sesión */}
            <div className="flex items-center gap-2 rounded-full bg-[#f0f0f0] pl-3 pr-2 py-1 border shadow-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground hidden sm:inline-block">
                {getDisplayName(user.email)}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="h-7 w-7 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {activeTab === 'evaluate' && <EvaluationForm />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'matrix' && <PersonnelMatrix />}
        {activeTab === 'export' && <GoogleFormExport />}
      </main>
    </div>
  );
}
