export interface User {
  id: number;
  email: string;
  firstName: string;   // Mapeado desde mock_usuario.nombre
  role: 'Administrador' | 'Cliente';  // Mapeado desde mock_usuario.tipo
  isActive: boolean;   // Mapeado desde mock_usuario.activo
  isResident: boolean; // Mapeado desde mock_usuario.es_residente
}

export interface LoginResponse {
  access_token: string;
  user: User;
}