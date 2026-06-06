export type CatalogItem = {
  id: string
  name: string
  price: string | null
  category: string
  description: string
  images: string[]
  hero: boolean
  auction: boolean
}
