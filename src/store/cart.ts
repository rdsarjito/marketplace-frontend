import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ProductItem } from '@/types/product'

export interface CartItem {
  id: number
  nama: string
  harga: number
  qty: number
  image?: string
  id_toko?: number
}

function parsePrice(raw: string | number): number {
  if (typeof raw === 'number') return raw
  const n = Number(raw)
  return Number.isNaN(n) ? 0 : n
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart_items') || '[]'))

  const count = computed(() => items.value.reduce((a, b) => a + b.qty, 0))
  const subtotal = computed(() => items.value.reduce((a, b) => a + b.harga * b.qty, 0))

  function addProduct(product: ProductItem, qty = 1) {
    const id = product.id
    const exist = items.value.find(i => i.id === id)
    const harga = parsePrice(product.harga_konsumen || product.harga_reseller || 0)
    const image = product.photos_product?.[0]?.url
    const id_toko = product.id_toko ?? product.toko?.id
    if (exist) {
      exist.qty += qty
    } else {
      items.value.push({ id, nama: product.nama_produk, harga, qty, image, id_toko: id_toko as number | undefined })
    }
  }

  function updateQty(id: number, qty: number) {
    const it = items.value.find(i => i.id === id)
    if (!it) return
    it.qty = Math.max(1, qty)
  }

  function remove(id: number) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  watch(items, () => {
    localStorage.setItem('cart_items', JSON.stringify(items.value))
  }, { deep: true })

  return { items, count, subtotal, addProduct, updateQty, remove, clear }
})


