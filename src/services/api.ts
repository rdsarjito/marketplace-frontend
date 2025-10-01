import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'
import type { ProductItem } from '@/types/product'

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api/v1'
export const API_ORIGIN = API_BASE_URL.split('/api/')[0]

export function resolveAssetUrl(path?: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return `${API_ORIGIN}${path}`
  return `${API_ORIGIN}/${path}`
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(payload: {
    token: string
    kata_sandi: string
    confirm_password: string
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/user')
  }

  async updateUserProfile(payload: {
    nama?: string
    no_telp?: string
    tanggal_lahir?: string
    jenis_kelamin?: 'L'|'P'
    tentang?: string
    pekerjaan?: string
  }): Promise<ApiResponse<any>> {
    return this.request('/user', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  // Product endpoints
  async getProducts(params?: { page?: number; page_size?: number; q?: string; category_id?: string }): Promise<ApiResponse<ProductItem[]>> {
    const search = new URLSearchParams()
    if (params?.page) search.set('page', String(params.page))
    if (params?.page_size) search.set('page_size', String(params.page_size))
    if (params?.q) search.set('q', params.q)
    if (params?.category_id) search.set('category_id', params.category_id)
    const qs = search.toString()
    const endpoint = qs ? `/product?${qs}` : '/product'
    return this.request<ProductItem[]>(endpoint)
  }

  async getCategories(): Promise<ApiResponse<any>> {
    return this.request('/category')
  }

  async getProductDetail(idOrSlug: string | number): Promise<ApiResponse<ProductItem>> {
    return this.request<ProductItem>(`/product/${idOrSlug}`)
  }

  async getMyShop(): Promise<ApiResponse<any>> {
    return this.request('/toko/my')
  }

  async uploadProductPhoto(productId: number | string, file: File): Promise<ApiResponse<ProductItem>> {
    const form = new FormData()
    form.append('file', file)
    const endpoint = `/product/${productId}/photo`
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {}
    const token = localStorage.getItem('token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(url, { method: 'POST', body: form, headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Upload failed')
    return data
  }

  async createProduct(payload: {
    nama_produk: string
    harga_reseller: string
    harga_konsumen: string
    stok: number
    deskripsi: string
    id_toko: number
    id_category: number
  }): Promise<ApiResponse<ProductItem>> {
    return this.request<ProductItem>('/product', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async updateProduct(id: number | string, payload: {
    nama_produk: string
    harga_reseller: string
    harga_konsumen: string
    stok: number
    deskripsi: string
    id_category: number
  }): Promise<ApiResponse<ProductItem>> {
    return this.request<ProductItem>(`/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  async deleteProduct(id: number | string): Promise<ApiResponse<any>> {
    return this.request(`/product/${id}`, { method: 'DELETE' })
  }

  // Address (protected)
  async createAddress(payload: { judul_alamat: string; nama_penerima: string; no_telp: string; detail_alamat: string }): Promise<ApiResponse<any>> {
    return this.request('/user/alamat', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async getAddresses(): Promise<ApiResponse<any>> {
    return this.request('/user/alamat')
  }

  async getAddressDetail(id: number | string): Promise<ApiResponse<any>> {
    return this.request(`/user/alamat/${id}`)
  }

  async updateAddress(id: number | string, payload: { judul_alamat: string; nama_penerima: string; no_telp: string; detail_alamat: string }): Promise<ApiResponse<any>> {
    return this.request(`/user/alamat/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  async deleteAddress(id: number | string): Promise<ApiResponse<any>> {
    return this.request(`/user/alamat/${id}`, { method: 'DELETE' })
  }

  // Transaction (protected)
  async createTransaction(payload: {
    harga_total: number
    method_bayar: string
    id_alamat: number
    detail_trx: Array<{ id_produk: number; id_toko: number; kuantitas: number; harga_total: number }>
  }): Promise<ApiResponse<any>> {
    return this.request('/trx', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async getOrders(): Promise<ApiResponse<any>> {
    return this.request('/trx')
  }

  async getOrderDetail(id: number | string): Promise<ApiResponse<any>> {
    return this.request(`/trx/${id}`)
  }
}

export const apiService = new ApiService(API_BASE_URL)
