import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import menuData from '../data/menu.json'
import type { DishItem, OrderItem } from '../interfaces/order.interface'
import QRCode from 'react-qr-code'

interface OrderProps {
  order: OrderItem
  shared?: boolean
  navigate: () => void
  updateOrder?: (order: OrderItem) => void
}

export const Order: FC<OrderProps> = ({ order, shared = true, navigate, updateOrder = () => {} }) => {
  const { dishes, name } = order
  const { t } = useTranslation()
  const [localDishes, setDishes] = useState<DishItem[]>(dishes)
  const uniqueDishesWithCount = localDishes.reduce<Array<DishItem & { count: number }>>((acc, dish) => {
    const found = acc.find((x) => x.name === dish.name)
    if (found) {
      found.count += 1
    } else {
      acc.push({ ...dish, count: 1 })
    }
    return acc
  }, [])
  return (
    <div className='border-l border-gray-200 flex flex-col w-full mb-12 text-left lg:text-center p-2'>
      {shared && (
        <div>
          <button
            type='button'
            className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
            onClick={navigate}
          >
            {t('admin.goback')}
          </button>
        </div>
      )}
      {shared && (
        <div className='mt-4 mb-4'>
          <button
            type='button'
            className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
            onClick={() => updateOrder({ name, dishes: localDishes })}
          >
            {t('admin.renew')}
          </button>
        </div>
      )}
      <div className='flex flex-col block p-6 rounded-lg shadow-lg bg-white max-w-sm mb-4'>
        <div className='flex flex-start items-center pt-2'>
          <div className='bg-gray-300 w-2 h-2 rounded-full -ml-1 mr-3'></div>
          <p className='text-gray-500 text-lg'>{name}</p>
        </div>
        <div className='mt-0.5 ml-4 mb-6'>
          <div className='flex flex-col gap-2'>
            {uniqueDishesWithCount.map((x) => {
              return (
                <div key={x.name} className='flex'>
                  <div className='flex justify-center'>
                    <div
                      className={
                        shared
                          ? 'block p-6 rounded-lg shadow-lg bg-white max-w-sm flex flex-row gap-2 align-center'
                          : 'block p-6 rounded-lg shadow-lg bg-white max-w-sm'
                      }
                    >
                      <h5 className='text-gray-700 text-md leading-tight font-medium mb-2'>
                        {x.name} - {x.price}aed <span className='text-gray-900 text-xl text-base'>x{x.count}</span>
                      </h5>
                      {shared && (
                        <button
                          type='button'
                          className='inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out'
                          onClick={() => {
                            const found = dishes.find((y) => y.name === x.name)
                            if (found) {
                              const index = dishes.indexOf(found)
                              dishes.splice(index, 1)
                              setDishes([...dishes])
                            }
                          }}
                        >
                          {t('store.deleteOne')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className='flex flex-wrap gap-2 mt-2'>
          <h5 className='text-gray-900 text-md leading-tight font-medium mb-2'>
            {t('admin.total')}:{' '}
            {uniqueDishesWithCount.reduce((acc, x) => {
              return acc + x.price * x.count
            }, 0)}
            aed
          </h5>
        </div>
      </div>
      {shared && <div className='mt-8 mb-8'><QRCode value={`https://dubaiopen.club/admin💙?id=${name}`} /></div>}
      {shared && (
        <div className='flex flex-wrap gap-2'>
          {menuData.map((x) => {
            return (
              <div
                key={x.name}
                style={{
                  width: '240px',
                  minWidth: '240px',
                  height: '340px',
                  backgroundImage: `url(${x.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                className='flex flex-col justify-between p-6 rounded-lg shadow-lg bg-white max-w-sm relative'
              >
                <div
                  className='w-full p-1 md:p-2 rounded-lg'
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <h5 className='text-gray-900 text-xl leading-tight font-medium mb-2 '>
                    {x.name} - {x.price}aed
                    <p className='text-gray-700 text-base mb-4 '>{x.description.substring(0, 100)}</p>
                  </h5>
                </div>
                <button
                  type='button'
                  className=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                  onClick={() => {
                    setDishes([...dishes, { name: x.name, price: Number.parseInt(x.price) }])
                  }}
                >
                  {t('store.add')}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
