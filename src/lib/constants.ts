import { Activity } from './types';

export const ACTIVITIES: Activity[] = [
  {
    id: 'A1',
    name: 'Limpieza de la tienda',
    tasks: ['desempolvar productos', 'limpiar muebles', 'barrer el piso', 'trapear el piso'],
    frequency: 'Diaria',
    weight: 2
  },
  {
    id: 'A2',
    name: 'Trapear acera exterior',
    tasks: ['hechar agua con detergente', 'refregar con escoba', 'dejar entrada seca y limpia'],
    frequency: 'Diaria',
    weight: 1
  },
  {
    id: 'A3',
    name: 'Mantener limpio el baño',
    tasks: ['espejo', 'lavamanos', 'taza con detergente', 'sacar basura', 'trapear piso'],
    frequency: 'Diaria',
    weight: 2
  },
  {
    id: 'A4',
    name: 'Botar la basura',
    tasks: ['el basurero pasa por las mañanas'],
    frequency: 'Diaria',
    weight: 1
  },
  {
    id: 'A5',
    name: 'Acomodar productos en mostrarios',
    tasks: ['sacar productos del depósito', 'acomodo frontal', 'revisión de vencimientos'],
    frequency: 'Diaria',
    weight: 3
  },
  {
    id: 'A6',
    name: 'Cambiar dinero y dejar cambio',
    tasks: ['llevar monto al banco', 'fraccionar en cortes', 'dejar fraccionado para domingos/feriados'],
    frequency: 'Diaria',
    weight: 4
  },
  {
    id: 'A7',
    name: 'Depositar ventas diarias',
    tasks: ['revisar monto vendido', 'entregar bajo firma', 'enviar comprobante con fecha'],
    frequency: 'Diaria',
    weight: 5
  },
  {
    id: 'A8',
    name: 'Cuidar inventarios en ambos sistemas',
    tasks: ['detectar irregularidades de caja/producto'],
    frequency: 'Diaria',
    weight: 5
  },
  {
    id: 'A9',
    name: 'Cerrar caja en ambos sistemas',
    tasks: ['sin sobrantes ni faltantes injustificados'],
    frequency: 'Diaria',
    weight: 5
  },
  {
    id: 'A10',
    name: 'Facturación diaria',
    tasks: ['facturas al día', 'sin errores'],
    frequency: 'Diaria',
    weight: 5
  },
  {
    id: 'A11',
    name: 'Limpieza de depósito',
    tasks: ['desempolvar', 'barrer', 'mantener orden'],
    frequency: 'Diaria',
    weight: 2
  },
  {
    id: 'A12',
    name: 'Realizar pedidos de productos',
    tasks: ['hoja de cálculo', 'registro de faltantes', 'seguimiento'],
    frequency: 'Semanal',
    weight: 4
  },
  {
    id: 'A13',
    name: 'Seguimiento a pedidos de supermercados',
    tasks: ['seguimiento hasta completar entrega'],
    frequency: 'Semanal',
    weight: 3
  },
  {
    id: 'A14',
    name: 'Inventarios por categorías',
    tasks: ['verificar productos e informar incidencias'],
    frequency: 'Semanal',
    weight: 4
  },
  {
    id: 'A15',
    name: 'Guardar documentos/facturas',
    tasks: ['mantener orden de documentos'],
    frequency: 'Mensual',
    weight: 3
  },
  {
    id: 'A16',
    name: 'Seguimiento a pagos y servicios',
    tasks: ['alquiler', 'agua', 'luz', 'internet'],
    frequency: 'Mensual',
    weight: 4
  }
];

export const SUCURSALES = ['Heroínas', 'Recoleta', 'Otra'];
export const STAFF = ['Leydi', 'Lucia', 'Rodrigo', 'Daniela', 'Shelly', 'Marco'];
export const SHIFTS = ['Mañana', 'Tarde', 'Domingo', 'Jornada completa'];
export const EVALUATION_TYPES = ['Diaria', 'Semanal', 'Mensual'];
export const AFFECTED_AREAS = [
  'Limpieza e imagen',
  'Atención al cliente',
  'Caja / dinero',
  'Facturación',
  'Inventario',
  'Pedidos / abastecimiento',
  'Documentación',
  'Servicios / pagos',
  'Sin observaciones relevantes'
];
export const RECOMMENDATIONS = [
  'Desempeño excelente',
  'Buen desempeño',
  'Desempeño aceptable con mejoras',
  'Requiere seguimiento',
  'Requiere intervención inmediata'
];

export const getCategory = (percentage: number): string => {
  if (percentage >= 0.9) return 'Excelente';
  if (percentage >= 0.8) return 'Muy bueno';
  if (percentage >= 0.7) return 'Aceptable';
  if (percentage >= 0.6) return 'Bajo - requiere seguimiento';
  return 'Crítico - requiere intervención';
};

export const RESPONSIBILITY_MATRIX: Record<string, Record<string, string>> = {
  'A1': { 'Leydi': 'R (L,M,V)', 'Lucia': 'R (Ma,J,S)', 'Rodrigo': 'A (Mañanas)', 'Daniela': 'A,C (Tardes)', 'Shelly': 'R (D)' },
  'A2': { 'Leydi': 'R (Ma,J,S)', 'Lucia': 'R (L,M,V)', 'Rodrigo': 'A (Mañanas)', 'Daniela': 'A,C (Tardes)' },
  'A3': { 'Leydi': 'R (L,V)', 'Lucia': 'R (Ma,S)', 'Rodrigo': 'R (Mi)', 'Daniela': 'A,C (Tardes)', 'Shelly': 'R (D)' },
  'A4': { 'Leydi': 'R (L,M,V,S)', 'Rodrigo': 'A (Mañanas)' },
  'A5': { 'Leydi': 'R (L,M,V)', 'Lucia': 'R (Ma,J,S)', 'Rodrigo': 'A (Mañanas)', 'Daniela': 'A,C (Tardes)' },
  'A6': { 'Rodrigo': 'R (L-S)', 'Daniela': 'C', 'Leydi': 'A', 'Lucia': 'A' },
  'A7': { 'Rodrigo': 'R (L-S)', 'Daniela': 'C', 'Leydi': 'A', 'Lucia': 'A' },
  'A12': { 'Leydi': 'R (L,M)', 'Daniela': 'C' }
};

