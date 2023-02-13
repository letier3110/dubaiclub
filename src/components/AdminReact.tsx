import { FC, useState } from 'react'
import type { DishItem, OrderItem } from '../interfaces/order.interface'
import { Login } from './Login'
import { Orders } from './Orders'
import { Order } from './Order'
import { Store } from './Store'

const mockData = [
  {
    name: 'Anton',
    dishes: [
      { name: 'Вхідний білет', price: 50 },
      { name: 'Вхідний білет', price: 50 },
      { name: 'Вхідний білет', price: 50 },
      { name: 'Вхідний білет', price: 50 },
      { name: 'Вхідний білет', price: 50 },
      { name: 'Корона пиво', price: 50 },
      { name: 'Корона пиво', price: 50 },
      { name: 'Корона пиво', price: 50 },
      { name: 'Вино червоне', price: 45 },
      { name: 'Вино червоне', price: 45 }
    ]
  },
  {
    name: 'Andriy',
    dishes: [
      { name: 'Вхідний білет', price: 50 },
      { name: 'Корона пиво', price: 50 },
      { name: 'Корона пиво', price: 50 },
      { name: 'Корона пиво', price: 50 },
      { name: 'Вино червоне', price: 45 },
      { name: 'Вино червоне', price: 45 }
    ]
  }
]

export const AdminReact: FC = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop.toString())
  })
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  // @ts-ignore
  const sharedId = params.id ?? null // "some_value"

  const [loggedIn, setLoggedIn] = useState(false)
  const [inOrders, setInOrders] = useState(true)
  const [showOrder, setShowOrder] = useState<OrderItem | null>(null)
  const [orders, setOrders] = useState<OrderItem[]>(mockData)

  const goInOrders = () => {
    setInOrders(true)
  }

  const goInStore = () => {
    setInOrders(false)
  }

  const submitOrder = (name: string, dishes: DishItem[]) => {
    setOrders([...orders, { name, dishes }])
    // setOrderName(null)
    goInOrders()
  }

  const resetOrderSelection = () => {
    setShowOrder(null)
  }

  const onLogin = (event: React.FormEvent<HTMLButtonElement>) => {
    // console.log('logged in')
    setLoggedIn(true)
  }
  if (sharedId) {
    const order = orders.find((order) => order.name === sharedId)
    if (order) {
      return (
        <section className='h-screen'>
          <Order order={order} navigate={resetOrderSelection} shared={false} />
        </section>
      )
    }
    return <h1>Не знайдено замовлення</h1>
  }
  if (loggedIn) {
    if (showOrder)
      return (
        <section className='h-screen'>
          <Order order={showOrder} shared navigate={resetOrderSelection} updateOrder={(newOrder) => {
            const newOrders = orders.map((order) => {
              if (order.name === newOrder.name) {
                return newOrder
              }
              return order
            })
            setOrders(newOrders)
            resetOrderSelection()
          }} />
        </section>
      )
    return (
      <section className='h-screen'>
        <div className='flex flex-start items-center flex-col pt-3'>
          <h1>{inOrders ? `Замовлення` : `Нове замовлення`}</h1>
          {inOrders && <Orders orders={orders} navigate={goInStore} onClick={(item) => setShowOrder(item)} />}
          {!inOrders && <Store submitOrder={submitOrder} />}
        </div>
      </section>
    )
  }
  return <Login onSubmit={onLogin} />
}
