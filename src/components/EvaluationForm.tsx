import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ACTIVITIES, getCategory, STAFF, SUCURSALES, SHIFTS, EVALUATION_TYPES, AFFECTED_AREAS, RECOMMENDATIONS } from '@/lib/constants';
import { calculateCompliance } from '@/lib/calculations';
import { Evaluation } from '@/lib/types';
import { AlertCircle, CheckCircle2, Save, Send } from 'lucide-react';

export const EvaluationForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Evaluation>>({
    date: new Date().toISOString().split('T')[0],
    scores: {},
    observations: {},
    affectedAreas: [],
    type: 'Diaria'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredActivities = ACTIVITIES.filter(a => a.frequency === formData.type);

  const handleScoreChange = (activityId: string, score: string) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [activityId]: score === 'NA' ? 'NA' : parseInt(score)
      }
    }));
  };

  const handleObservationChange = (activityId: string, observation: string) => {
    setFormData(prev => ({
      ...prev,
      observations: {
        ...prev.observations,
        [activityId]: observation
      }
    }));
  };

  const handleAreaToggle = (area: string) => {
    setFormData(prev => {
      const current = prev.affectedAreas || [];
      if (current.includes(area)) {
        return { ...prev, affectedAreas: current.filter(a => a !== area) };
      } else {
        return { ...prev, affectedAreas: [...current, area] };
      }
    });
  };

  const { percentage } = calculateCompliance(formData.scores || {}, filteredActivities);
  const category = getCategory(percentage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.evaluator || !formData.evaluated || !formData.sucursal) {
      toast.error('Por favor complete los datos generales');
      return;
    }

    setIsSubmitting(true);
    try {
      // Here we would save to Firebase
      console.log('Saving evaluation:', { ...formData, compliancePercentage: percentage, category });
      toast.success('Evaluación guardada exitosamente');
      // Reset form or redirect
    } catch (error) {
      toast.error('Error al guardar la evaluación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Datos Generales</CardTitle>
          <CardDescription>Información básica de la evaluación</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input 
              id="date" 
              type="date" 
              value={formData.date} 
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sucursal">Sucursal</Label>
            <Select onValueChange={val => setFormData(prev => ({ ...prev, sucursal: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent>
                {SUCURSALES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="evaluator">Evaluador / Aprobador</Label>
            <Select onValueChange={val => setFormData(prev => ({ ...prev, evaluator: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar evaluador" />
              </SelectTrigger>
              <SelectContent>
                {STAFF.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="evaluated">Persona Evaluada</Label>
            <Select onValueChange={val => setFormData(prev => ({ ...prev, evaluated: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar persona" />
              </SelectTrigger>
              <SelectContent>
                {STAFF.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shift">Turno</Label>
            <Select onValueChange={val => setFormData(prev => ({ ...prev, shift: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar turno" />
              </SelectTrigger>
              <SelectContent>
                {SHIFTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Evaluación</Label>
            <Select 
              value={formData.type}
              onValueChange={val => setFormData(prev => ({ ...prev, type: val as any, scores: {} }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {EVALUATION_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Actividades - {formData.type}</CardTitle>
            <CardDescription>Califique el cumplimiento de cada actividad (0-5 o NA)</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{(percentage * 100).toFixed(1)}%</div>
            <Badge variant={percentage >= 0.7 ? "default" : "destructive"}>
              {category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <Progress value={percentage * 100} className="h-2" />
          
          <div className="space-y-12">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="space-y-4 border-b pb-8 last:border-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{index + 1}. {activity.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Tareas: {activity.tasks.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="sr-only">Puntaje</Label>
                    <Select onValueChange={(val: string) => handleScoreChange(activity.id, val)}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Nota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NA">NA</SelectItem>
                        {[0, 1, 2, 3, 4, 5].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`obs-${activity.id}`} className="text-xs uppercase tracking-wider opacity-70">Observaciones</Label>
                  <Input 
                    id={`obs-${activity.id}`}
                    placeholder="Detalles adicionales..."
                    onChange={e => handleObservationChange(activity.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conclusiones y Cierre</CardTitle>
          <CardDescription>Resumen final de la evaluación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="strengths">Fortaleza Principal</Label>
              <Textarea 
                id="strengths" 
                placeholder="¿Qué hizo bien?"
                onChange={e => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weaknesses">Principal Falla</Label>
              <Textarea 
                id="weaknesses" 
                placeholder="¿Qué debe mejorar?"
                onChange={e => setFormData(prev => ({ ...prev, weaknesses: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Áreas Afectadas</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {AFFECTED_AREAS.map(area => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox 
                    id={area} 
                    onCheckedChange={() => handleAreaToggle(area)}
                  />
                  <label 
                    htmlFor={area}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {area}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendation">Recomendación Final</Label>
            <Select onValueChange={val => setFormData(prev => ({ ...prev, finalRecommendation: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar recomendación" />
              </SelectTrigger>
              <SelectContent>
                {RECOMMENDATIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 border-t pt-6">
          <Button type="button" variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Borrador
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Enviando...' : 'Finalizar Evaluación'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
