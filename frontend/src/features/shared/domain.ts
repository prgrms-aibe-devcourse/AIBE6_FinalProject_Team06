export type Flow = 'in' | 'out'
export type Transaction = {
  id: number
  date: string
  flow: Flow
  company: string
  product: string
  member: string
  quantity: number
  price: number
  image?: string
}
export type Filter = {
  keyword: string
  flow: string
  field: string
  startDate: string
  endDate: string
}
export type CatalogItem = { id: number; name: string; createdAt: string }
export type Product = {
  id: number
  productNumber: string
  name: string
  stock: number
  price: number
  image?: string
  createdAt: string
}
export type Company = {
  id: number
  companyNumber: string
  name: string
  createdAt: string
}
export type CatalogInput = {
  name: string
  productNumber?: string
  productType?: string
  stock?: number
  price?: number
  image?: string
  companyNumber?: string
  companyType?: string
}

export const money = (value: number) => new Intl.NumberFormat('ko-KR').format(value) + '원'
export const number = (value: number) => new Intl.NumberFormat('ko-KR').format(value)
export const total = (items: Transaction[], flow?: Flow) =>
  items
    .filter((item) => !flow || item.flow === flow)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
export const quantity = (items: Transaction[], flow: Flow) =>
  items.filter((item) => item.flow === flow).reduce((sum, item) => sum + item.quantity, 0)
