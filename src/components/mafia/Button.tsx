import type { FC } from 'react'

interface ButtonProps {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Button: FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <button
      className={[
        'inline-block bg-white text-gray-700 font-medium uppercase rounded shadow-md hover:bg-gray-100 hover:shadow-lg focus:bg-gray-100 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-200 active:shadow-lg transition duration-150 ease-in-out mr-4',
        className ?? ''
      ].join(' ')}
      role='button'
      data-mdb-ripple='true'
      data-mdb-ripple-color='light'
      onClick={onClick}
    >
      {children ?? ''}
    </button>
  )
}
