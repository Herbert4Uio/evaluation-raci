import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { STAFF } from '@/lib/constants';
import { TrendingUp, Users, Calendar, AlertTriangle } from 'lucide-react';

// Mock data for initial view
const MOCK_STATS = [
  { label: 'Evaluaciones Totales', value: '24', icon: Calendar, color: 'text-blue-600' },
  { label: 'Promedio General', value: '84.5%', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Personal Evaluado', value: '6', icon: Users, color: 'text-purple-600' },
  { label: 'Alertas Críticas', value: '2', icon: AlertTriangle, color: 'text-red-600' },
];

const MOCK_RECENT = [
  { id: '1', date: '2026-04-10', evaluated: 'Lucia', type: 'Diaria', score: 0.92, category: 'Excelente' },
  { id: '2', date: '2026-04-09', evaluated: 'Rodrigo', type: 'Semanal', score: 0.78, category: 'Aceptable' },
  { id: '3', date: '2026-04-08', evaluated: 'Leydi', type: 'Diaria', score: 0.85, category: 'Muy bueno' },
  { id: '4', date: '2026-04-07', evaluated: 'Daniela', type: 'Diaria', score: 0.58, category: 'Crítico' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
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

      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Evaluaciones Recientes</CardTitle>
            <CardDescription>Últimos registros de cumplimiento</CardDescription>
          </CardHeader>
          <CardContent>
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
                {MOCK_RECENT.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.evaluated}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm font-bold">{(item.score * 100).toFixed(0)}%</span>
                        <Badge variant={item.score >= 0.7 ? "default" : "destructive"}>
                          {item.category}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Desempeño por Personal</CardTitle>
            <CardDescription>Promedio de cumplimiento acumulado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {STAFF.map((person) => {
              const mockScore = Math.random() * 40 + 60; // Random score between 60-100
              return (
                <div key={person} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{person}</span>
                    <span className="text-muted-foreground">{mockScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={mockScore} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
