export type UserRole = 'estudiante' | 'tecnico' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type EquipmentStatus = 'Disponible' | 'Prestado' | 'Mantenimiento' | 'Dañado';

export interface Equipment {
  id: string;
  type: string;
  brand: string;
  model: string;
  location: string;
  status: EquipmentStatus;
}

export type LoanStatus = 'Activo' | 'Devuelto' | 'Pendiente' | 'Vencido';

export interface Loan {
  id: string;
  equipmentId: string;
  equipmentType: string;
  userId: string;
  userName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: LoanStatus;
  code: string;
}

export interface TimeSlot {
  day: string;
  hour: string;
  selected: boolean;
}

export interface DeviceDisponibility {
  type: string;
  available: number;
  total: number;
  icon?: React.ElementType;
}
