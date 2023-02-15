export interface DishItem {
  name: string
  price: number
}

export interface OrderItem {
  name: string
  dishes: DishItem[]
}
