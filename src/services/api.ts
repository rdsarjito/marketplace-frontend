import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'
import type { ProductItem } from '@/types/product'

const API_BASE_URL = 'http://127.0.0.1:8080/api/v1'

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

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/user')
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

  // Address (protected)
  async createAddress(payload: { judul_alamat: string; nama_penerima: string; no_telp: string; detail_alamat: string }): Promise<ApiResponse<any>> {
    return this.request('/user/alamat', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
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
