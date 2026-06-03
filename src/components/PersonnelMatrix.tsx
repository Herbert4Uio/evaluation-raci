import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ACTIVITIES, STAFF, RESPONSIBILITY_MATRIX } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export const PersonnelMatrix: React.FC = () => {
  return (
    <Card className="w-full overflow-auto">
      <CardHeader>
        <CardTitle>Matriz de Funciones</CardTitle>
        <CardDescription>Responsabilidades asignadas por actividad y personal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2"><Badge className="bg-blue-500">R</Badge> <span className="text-sm">Responsable</span></div>
          <div className="flex items-center gap-2"><Badge className="bg-green-500">A</Badge> <span className="text-sm">Aprobador</span></div>
          <div className="flex items-center gap-2"><Badge className="bg-yellow-500">C</Badge> <span className="text-sm">Consultado</span></div>
          <div className="flex items-center gap-2"><Badge className="bg-gray-500">I</Badge> <span className="text-sm">Informado</span></div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Actividad</TableHead>
              <TableHead>Frecuencia</TableHead>
              {STAFF.map(person => (
                <TableHead key={person} className="text-center">{person}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVITIES.map(activity => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.name}</TableCell>
                <TableCell>{activity.frequency}</TableCell>
                {STAFF.map(person => {
                  const role = RESPONSIBILITY_MATRIX[activity.id]?.[person];
                  return (
                    <TableCell key={person} className="text-center">
                      {role ? (
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {role}
                        </Badge>
                      ) : (
                        <span className="text-xs opacity-50">-</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

