import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { STAFF } from '@/lib/constants';
import { getRecentEvaluations } from '@/services/evaluationService';
import { isFirebaseEnabled } from '@/lib/firebase';
import { Evaluation } from '@/lib/types';
import { TrendingUp, Users, Calendar, AlertTriangle, Cloud, HardDrive, Info, ClipboardCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getRecentEvaluations(50);
      setEvaluations(data || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const seedDemoData = () => {
    const mockEvaluations: Omit<Evaluation, 'id' | 'timestamp'>[] = [
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sucursal: 'Heroínas',
        evaluator: 'Rodrigo',
        evaluated: 'Lucia',
        shift: 'Mañana',
        type: 'Diaria',
        assignedActivities: 'Sí',
        contextObservation: 'Excelente inicio de jornada, personal uniformado.',
        scores: { '1': 5, '2': 5, '3': 4, '4': 5, '5': 4 },
        observations: { '3': 'Faltó limpiar un sector pequeño del baño' },
        strengths: 'Puntualidad y limpieza general impecable.',
        weaknesses: 'Mejorar el orden en depósito.',
        requiresFollowUp: false,
        affectedAreas: [],
        finalRecommendation: 'Felicitación verbal',
        compliancePercentage: 0.92,
        category: 'Excelente'
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sucursal: 'Recoleta',
        evaluator: 'Lucia',
        evaluated: 'Rodrigo',
        shift: 'Tarde',
        type: 'Diaria',
        assignedActivities: 'Sí',
        contextObservation: 'Mucho movimiento de clientes.',
        scores: { '1': 4, '2': 3, '3': 4, '4': 4, '5': 5 },
        observations: {},
        strengths: 'Atención proactiva al cliente.',
        weaknesses: 'Retraso en limpieza exterior.',
        requiresFollowUp: false,
        affectedAreas: ['Limpieza exterior'],
        finalRecommendation: 'Monitoreo de rutina',
        compliancePercentage: 0.80,
        category: 'Muy bueno'
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sucursal: 'Heroínas',
        evaluator: 'Leydi',
        evaluated: 'Daniela',
        shift: 'Tarde',
        type: 'Diaria',
        assignedActivities: 'Parcialmente',
        contextObservation: 'Corte de luz parcial durante la tarde.',
        scores: { '1': 3, '2': 2, '3': 3, '4': 2, '5': 3 },
        observations: { '2': 'La acera no se barrió por completo', '4': 'Basurero lleno al terminar turno' },
        strengths: 'Buena actitud ante problemas eléctricos.',
        weaknesses: 'Falta de proactividad en tareas básicas.',
        requiresFollowUp: true,
        affectedAreas: ['Limpieza de tienda', 'Depósito'],
        finalRecommendation: 'Retroalimentación formal',
        compliancePercentage: 0.58,
        category: 'Crítico'
      },
      {
        date: new Date().toISOString().split('T')[0],
        sucursal: 'Recoleta',
        evaluator: 'Rodrigo',
        evaluated: 'Leydi',
        shift: 'Mañana',
        type: 'Diaria',
        assignedActivities: 'Sí',
        contextObservation: 'Todo en orden.',
        scores: { '1': 4, '2': 4, '3': 4, '4': 5, '5': 4 },
        observations: {},
        strengths: 'Cumplimiento constante del plan.',
        weaknesses: 'Ninguna relevante hoy.',
        requiresFollowUp: false,
        affectedAreas: [],
        finalRecommendation: 'Monitoreo de rutina',
        compliancePercentage: 0.84,
        category: 'Muy bueno'
      }
    ];

    const localEvals = mockEvaluations.map((item, idx) => ({
      ...item,
      id: `seed_${idx}_` + Math.random().toString(36).substring(2, 9),
      timestamp: new Date(Date.now() - (3 - idx) * 24 * 60 * 60 * 1000).toISOString()
    }));

    localStorage.setItem('evaluations', JSON.stringify(localEvals));
    loadData();
  };

  const totalCount = evaluations.length;
  const avgCompliance = totalCount > 0 
    ? evaluations.reduce((sum, item) => sum + (item.compliancePercentage || 0), 0) / totalCount 
    : 0;
  const uniqueEvaluated = new Set(evaluations.map(e => e.evaluated)).size;
  const criticalAlertsCount = evaluations.filter(e => (e.compliancePercentage || 0) < 0.7).length;

  const stats = [
    { label: 'Evaluaciones Totales', value: totalCount.toString(), icon: Calendar, color: 'text-blue-600' },
    { label: 'Promedio General', value: `${(avgCompliance * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Personal Evaluado', value: `${uniqueEvaluated} / ${STAFF.length}`, icon: Users, color: 'text-purple-600' },
    { label: 'Alertas Críticas', value: criticalAlertsCount.toString(), icon: AlertTriangle, color: 'text-red-600' },
  ];

  const staffAverages = STAFF.map(person => {
    const personEvals = evaluations.filter(e => e.evaluated === person);
    const avg = personEvals.length > 0 
      ? personEvals.reduce((sum, e) => sum + (e.compliancePercentage || 0), 0) / personEvals.length 
      : null;
    return {
      name: person,
      avg: avg !== null ? avg * 100 : null,
      count: personEvals.length
    };
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-sm">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner de Estado de la Base de Datos */}
      {!isFirebaseEnabled ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
          <HardDrive className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5 sm:mt-0" />
          <div className="flex-1 text-sm">
            <span className="font-bold">Modo Demo Local (localStorage):</span> Las evaluaciones se guardan únicamente en tu navegador. Configura las variables de entorno de Firebase en Vercel para conectarlo a la nube.
          </div>
          {totalCount === 0 && (
            <Button size="sm" onClick={seedDemoData} className="mt-2 sm:mt-0 bg-amber-600 text-white hover:bg-amber-700 border-none">
              Generar datos de prueba
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
          <Cloud className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" />
          <div className="flex-1 text-sm">
            <span className="font-bold">Conectado a Firebase Firestore:</span> Los datos están sincronizados en la nube en tiempo real.
          </div>
        </div>
      )}

      {/* Grid de Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secciones del Dashboard */}
      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Evaluaciones Recientes</CardTitle>
            <CardDescription>Últimos registros de cumplimiento</CardDescription>
          </CardHeader>
          <CardContent>
            {totalCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Info className="h-8 w-8 text-muted-foreground opacity-50 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No hay evaluaciones registradas aún.</p>
                <p className="text-xs text-muted-foreground mt-1">Completa una evaluación en la pestaña 'Evaluar' para ver los resultados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Persona</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Cumplimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.slice(0, 10).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.date}</TableCell>
                        <TableCell>{item.evaluated}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm font-bold">{((item.compliancePercentage || 0) * 100).toFixed(0)}%</span>
                            <Badge variant={(item.compliancePercentage || 0) >= 0.7 ? "default" : "destructive"}>
                              {item.category}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Desempeño por Personal</CardTitle>
            <CardDescription>Promedio de cumplimiento acumulado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {staffAverages.map((person) => {
              const displayVal = person.avg !== null ? `${person.avg.toFixed(1)}%` : 'Sin datos';
              const progressVal = person.avg !== null ? person.avg : 0;
              return (
                <div key={person.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {displayVal} {person.count > 0 && `(${person.count} ${person.count === 1 ? 'eval.' : 'evals.'})`}
                    </span>
                  </div>
                  <Progress value={progressVal} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
