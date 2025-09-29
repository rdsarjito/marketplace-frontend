export interface LoginRequest {
  email: string;
  kata_sandi: string;
}

export interface RegisterRequest {
  nama: string;
  kata_sandi: string;
  no_telp: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  tentang: string;
  pekerjaan: string;
  email: string;
  id_provinsi: string;
  id_kota: string;
}

export interface User {
  id: number;
  nama: string;
  no_telp: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  tentang: string;
  pekerjaan: string;
  email: string;
  id_provinsi: string;
  id_kota: string;
  is_admin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
