import items from '../data/items.json'
import staticAssets from '../data/static.json'
import type { CatalogItem } from '../types/item'
import type { StaticAssets } from '../types/static'

export const catalogItems = items as CatalogItem[]
export const siteConfig = staticAssets as StaticAssets

export function getItemById(id: string) {
  return catalogItems.find((item) => item.id === id)
}

export function getCategories() {
  return [...new Set(catalogItems.map((item) => item.category))].sort()
}

export function getHeroItems() {
  return catalogItems.filter((item) => item.hero)
}

export function formatPrice(price: string | null) {
  if (!price) return null
  const numeric = Number(price.replace(/[^\d.]/g, ''))
  if (Number.isNaN(numeric)) return price
  return new Intl.NumberFormat('mn-MN', {
    maximumFractionDigits: 0,
  }).format(numeric) + ' ₮'
}
