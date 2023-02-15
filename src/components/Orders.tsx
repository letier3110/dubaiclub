import type { FC } from 'react'
import type { DishItem, OrderItem } from '../interfaces/order.interface'

interface OrdersProps {
  orders: OrderItem[]
  navigate: () => void
  onClick?: (item: OrderItem) => void
}

export const Orders: FC<OrdersProps> = ({ orders, navigate, onClick = () => {} }) => {
  if (orders.length === 0) {
    return (
      <div className='flex flex-start items-center flex-col pt-3'>
        <h1>Замовлень немає</h1>
        <button
          type='button'
          className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
          onClick={navigate}
        >
          Додати
        </button>
      </div>
    )
  }
  return (
    <div className='border-l border-gray-200 flex flex-row flex-wrap w-full mb-12 text-left lg:text-center p-2 gap-2'>
      {orders.map((x) => {
        const uniqueDishesWithCount = x.dishes.reduce<Array<DishItem & { count: number }>>((acc, dish) => {
          const found = acc.find((x) => x.name === dish.name)
          if (found) {
            found.count += 1
          } else {
            acc.push({ ...dish, count: 1 })
          }
          return acc
        }, [])
        return (
          <div
            key={x.name}
            className='flex flex-col block p-6 rounded-lg shadow-lg bg-white max-w-sm mt-4'
            onClick={() => onClick(x)}
          >
            <div className='flex flex-start items-center pt-2'>
              <div className='bg-gray-300 w-2 h-2 rounded-full -ml-1 mr-3'></div>
              <p className='text-gray-500 text-lg'>{x.name}</p>
            </div>
            <div className='mt-0.5 ml-4 mb-6'>
              <div className='flex flex-col gap-2'>
                {uniqueDishesWithCount.map((x) => {
                  return (
                    <div key={x.name} className='flex'>
                      <div className='flex justify-center'>
                        <div className='block p-6 rounded-lg shadow-lg bg-white max-w-sm'>
                          <h5 className='text-gray-700 text-md leading-tight font-medium mb-2'>
                            {x.name} - {x.price}aed <span className='text-gray-900 text-xl text-base'>x{x.count}</span>
                          </h5>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              <h5 className='text-gray-900 text-md leading-tight font-medium mb-2'>
                Всього:{' '}
                {uniqueDishesWithCount.reduce((acc, x) => {
                  return acc + x.price * x.count
                }, 0)}
                aed
              </h5>
            </div>
          </div>
        )
      })}
      <div className='flex flex-col justify-center block p-6 rounded-lg shadow-lg bg-white max-w-sm mt-4'>
        <div className='flex flex-start items-center pt-2'>
          <button
            type='button'
            className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
            onClick={navigate}
          >
            Додати ще
          </button>
        </div>
      </div>
    </div>
  )
}
