/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { EvaluationForm } from './components/EvaluationForm';
import { Dashboard } from './components/Dashboard';
import { PersonnelMatrix } from './components/PersonnelMatrix';
import { GoogleFormExport } from './components/GoogleFormExport';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, LayoutDashboard, Table as TableIcon, FileOutput } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'evaluate' | 'dashboard' | 'matrix' | 'export'>('evaluate');

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#1a1a1a]">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              Evaluación Tienda
            </h1>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-4">
            <Button 
              variant={activeTab === 'evaluate' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('evaluate')}
              className="gap-2"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Evaluar</span>
            </Button>
            <Button 
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('dashboard')}
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button 
              variant={activeTab === 'matrix' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('matrix')}
              className="gap-2"
            >
              <TableIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Matriz</span>
            </Button>
            <Button 
              variant={activeTab === 'export' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('export')}
              className="gap-2"
            >
              <FileOutput className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Settings or Profile */}
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



