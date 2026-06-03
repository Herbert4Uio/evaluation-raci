import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export const GoogleFormExport: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  const sections = [
    {
      title: 'SECCIÓN 1: DATOS GENERALES',
      content: `Título: Datos generales de la evaluación
1. Fecha de evaluación (Fecha)
2. Sucursal (Opción múltiple: Heroínas, Recoleta, Otra)
3. Nombre del evaluador (Lista desplegable: Leydi, Lucia, Rodrigo, Daniela, Shelly, Marco)
4. Nombre de la persona evaluada (Lista desplegable: Leydi, Lucia, Rodrigo, Daniela, Shelly, Marco)
5. Turno evaluado (Opción múltiple: Mañana, Tarde, Domingo, Jornada completa)
6. Tipo de evaluación (Opción múltiple: Diaria, Semanal, Mensual)
7. ¿La persona evaluada tenía asignadas las actividades? (Opción múltiple: Sí, Parcialmente, No)
8. Observación inicial de contexto (Párrafo)`
    },
    {
      title: 'SECCIÓN 2: EVALUACIÓN DIARIA',
      content: `1. Limpieza de la tienda (Escala 0-5)
2. Trapear la acera exterior (Escala 0-5)
3. Mantener limpio el baño (Escala 0-5)
4. Botar la basura (Escala 0-5)
5. Acomodar productos en mostrarios (Escala 0-5)
6. Cambiar dinero y dejar cambio (Escala 0-5)
7. Depositar ventas diarias (Escala 0-5)
8. Cuidar inventarios en ambos sistemas (Escala 0-5)
9. Cerrar caja en ambos sistemas (Escala 0-5)
10. Facturación diaria (Escala 0-5)
11. Limpieza de depósito (Escala 0-5)`
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exportar a Google Forms</CardTitle>
          <CardDescription>Texto listo para copiar y pegar en su formulario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-wider">{section.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(section.content)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto whitespace-pre-wrap font-mono border">
                {section.content}
              </pre>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
