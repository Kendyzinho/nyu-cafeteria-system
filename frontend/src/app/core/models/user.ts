export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Administrador' | 'Cliente';
  isActive: boolean;
  isResident: boolean; // Vital para el equipo de Alojamiento
}

export interface LoginResponse {
  access_token: string;
  user: User;
}