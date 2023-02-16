import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import menuData from '../data/menu.json'
import type { DishItem } from '../interfaces/order.interface'

interface StoreProps {
  submitOrder: (name: string, dishes: DishItem[]) => void
}

export const Store: FC<StoreProps> = ({ submitOrder }) => {
  const { t } = useTranslation()
  const [orderName, setOrderName] = useState('')
  const [dishes, setDishes] = useState<DishItem[]>([])
  const [collapsed, setCollapsed] = useState(true)

  const uniqueDishesWithCount = dishes.reduce<Array<DishItem & { count: number }>>((acc, dish) => {
    const found = acc.find((x) => x.name === dish.name)
    if (found) {
      found.count += 1
    } else {
      acc.push({ ...dish, count: 1 })
    }
    return acc
  }, [])

  return (
    <section className='overflow-hidden text-gray-700 '>
      <div className='container px-5 py-2 mx-auto lg:pt-12'>
        <div className='flex flex-col w-full mb-12 text-left lg:text-center'>
          <div className='flex flex-col items-center justify-center w-full mx-auto lg:flex-row align-center gap-4'>
            <input
              type='text'
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              placeholder={t('store.name') ?? 'Введіть імʼя замовника'}
              className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
            />
            <button
              type='button'
              className=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
              onClick={() => submitOrder(orderName, dishes)}
            >
              {t('store.create')}
            </button>
          </div>
          {uniqueDishesWithCount.length > 0 && (
            <div className='mt-6'>
              <div className='flex flex-row justify-between'>
                <h5 className='text-gray-900 text-xl leading-tight font-medium mb-2'>
                  {t('store.check')}{' '}
                  {uniqueDishesWithCount.reduce((acc, x) => {
                    return acc + x.price * x.count
                  }, 0)}
                  aed
                </h5>
                {collapsed && (
                  <button
                    type='button'
                    className=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                    onClick={() => setCollapsed(false)}
                  >
                    {t('store.unfold')}
                  </button>
                )}
                {!collapsed && (
                  <button
                    type='button'
                    className=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                    onClick={() => setCollapsed(true)}
                  >
                    {t('store.fold')}
                  </button>
                )}
              </div>
              {!collapsed && (
                <div className='flex flex-row gap-2 flex-wrap'>
                  {uniqueDishesWithCount.map((x) => {
                    return (
                      <div key={x.name} style={{ minWidth: '240px', width: '240px' }} className='flex'>
                        <div className='w-80 block p-6 rounded-lg shadow-lg bg-white max-w-sm flex flex-col gap-2 align-center relative'>
                          <h5 className='text-gray-700 text-md leading-tight font-medium mb-2'>
                            {x.name} - {x.price}aed
                          </h5>
                          <span className='text-gray-900 text-xl text-base absolute right-0 top-0'>x{x.count}</span>
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
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
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
      </div>
    </section>
  )
}
