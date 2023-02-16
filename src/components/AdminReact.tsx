import { FC, useEffect, useState } from 'react'
import '../i18n/config'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop.toString())
  })
  // @ts-ignore
  const sharedId = decodeURIComponent(params.id ?? '')

  const [loggedIn, setLoggedIn] = useState<null | string>(null)
  const [inOrders, setInOrders] = useState(true)
  const [showOrder, setShowOrder] = useState<OrderItem | null>(null)
  const [orders, setOrders] = useState<OrderItem[]>([])

  useEffect(() => {
    if (loggedIn) {
      handleLoadOrders(loggedIn)
    }
  }, [loggedIn])

  const goInOrders = () => {
    setInOrders(true)
  }

  const goInStore = () => {
    setInOrders(false)
  }

  const submitOrder = (name: string, dishes: DishItem[]) => {
    // setOrders([...orders, { name, dishes }])
    // setOrderName(null)
    handleCreateNewOrder(name, dishes)
    goInOrders()
  }

  const handleCreateNewOrder = async (name: string, dishes: DishItem[]) => {
    const res = await fetch(`https://letier3110-dubaiclub-api.deno.dev/check?password=${loggedIn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        dishes
      })
    })
    if (loggedIn) {
      handleLoadOrders(loggedIn)
    }
  }

  const handleLoadOrders = async (loggedIn: string) => {
    const res = await fetch(`https://letier3110-dubaiclub-api.deno.dev/check?password=${loggedIn}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())
    console.log(res)
    setOrders(res.map((x: any) => ({ name: x.name, dishes: x.dishes })))
  }

  const resetOrderSelection = () => {
    setShowOrder(null)
  }

  const onLogin = (password: string) => {
    console.log('logged in')

    setLoggedIn(password)
  }
  if (sharedId && sharedId !== '') {
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
          <Order
            order={showOrder}
            shared
            navigate={resetOrderSelection}
            updateOrder={(newOrder) => {
              const newOrders = orders.map((order) => {
                if (order.name === newOrder.name) {
                  return newOrder
                }
                return order
              })
              handleCreateNewOrder(newOrder.name, newOrder.dishes)
              setOrders(newOrders)
              resetOrderSelection()
            }}
          />
        </section>
      )
    return (
      <section className='h-screen'>
        <div className='flex flex-start items-center flex-col pt-3'>
          <h1>{inOrders ? t('admin.orders') : t('admin.newOrder')}</h1>
          {inOrders && <Orders orders={orders} navigate={goInStore} onClick={(item) => setShowOrder(item)} />}
          {!inOrders && <Store submitOrder={submitOrder} />}
        </div>
      </section>
    )
  }
  return <Login onSubmit={onLogin} />
}
