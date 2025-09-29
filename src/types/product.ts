export interface PhotoProduct {
  id: number
  id_produk: number
  url: string
  created_at?: string
  updated_at?: string
}

export interface ShopSummary {
  id: number
  nama_toko: string
}

export interface CategorySummary {
  id: number
  nama_kategori: string
  slug?: string
}

export interface ProductItem {
  id: number
  nama_produk: string
  slug: string
  harga_reseller: string
  harga_konsumen: string
  stok: number
  deskripsi: string
  created_at?: string
  updated_at?: string
  id_toko?: number
  id_category?: number
  toko?: ShopSummary
  category?: CategorySummary
  photos_product?: PhotoProduct[]
}

export interface PaginatedResponse<T> {
  data: T[]
  page?: number
  page_size?: number
  total?: number
}

