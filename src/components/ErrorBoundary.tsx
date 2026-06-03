import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Ha ocurrido un error inesperado.';
      
      try {
        const errorInfo = JSON.parse(this.state.error?.message || '');
        if (errorInfo.error) {
          errorMessage = `Error de base de datos: ${errorInfo.error}`;
        }
      } catch {
        // Not a JSON error
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight">¡Ups! Algo salió mal</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            {errorMessage}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Recargar aplicación
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
