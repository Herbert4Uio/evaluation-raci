export interface Activity {
  id: string;
  name: string;
  tasks: string[];
  frequency: 'Diaria' | 'Semanal' | 'Mensual';
  weight: number;
}

export interface Evaluation {
  id: string;
  date: string;
  sucursal: string;
  evaluator: string;
  evaluated: string;
  shift: string;
  type: 'Diaria' | 'Semanal' | 'Mensual';
  assignedActivities: 'Sí' | 'Parcialmente' | 'No';
  contextObservation?: string;
  scores: Record<string, number | 'NA'>;
  observations: Record<string, string>;
  strengths: string;
  weaknesses: string;
  requiresFollowUp: boolean;
  requiresTraining?: boolean;
  requiresImprovementPlan?: boolean;
  affectedAreas: string[];
  finalRecommendation: string;
  compliancePercentage: number;
  category: string;
  timestamp: any;
}

