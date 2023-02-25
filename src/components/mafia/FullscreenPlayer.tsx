import type { FC } from 'react'
import '../../i18n/config'
import { useTranslation } from 'react-i18next'
import type { FullscreenPlayer as IFullscreenPlayer } from './Mafia.interface'
import { performCheckRoleDetective } from './util'

interface FullscreenPlayerProps {
  fullscreenPlayer: IFullscreenPlayer
  // checkBy: string // Roles.DETECTIVE | Roles.DON
  performCheckRole?: (role: string) => string
  handleClose: () => void
}

export const FullscreenPlayer: FC<FullscreenPlayerProps> = ({
  fullscreenPlayer,
  performCheckRole = performCheckRoleDetective,
  handleClose
}) => {
  const { role } = fullscreenPlayer
  const { t } = useTranslation()

  // const roleClassName = role === Roles.TOWNSMAN ? 'bg-red-500' : 'bg-black'
  const roleClassName = performCheckRole(role)
  const popupClassName = [roleClassName, 'h-full flex flex-col text-base bg-white shadow-xl overflow-y-scroll'].join(
    ' '
  )

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      <div className='absolute inset-0 overflow-hidden'>
        <section className='absolute inset-y-0 right-0 max-w-full flex'>
          <div className='w-screen'>
            <div className={popupClassName}>
              <div className='flex-1 py-6 overflow-y-auto px-4 sm:px-6 flex items-center justify-center'>
                <div className='flex justify-center items-center'>
                  <div className='absolute right-0 top-0 ml-3 h-7 flex items-center'>
                    <div />
                    <button
                      className='bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      onClick={handleClose}
                    >
                      <span className='sr-only'>Close panel</span>
                      <svg
                        className='h-6 w-6'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        aria-hidden='true'
                      >
                        <path
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          stroke-width='2'
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    </button>
                  </div>
                <h2 style={{
                  fontSize: '17rem',
                }} className='text-lg text-white font-medium text-gray-900'>{fullscreenPlayer.index}</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
