import { Roles } from './Mafia.interface'

export const performCheckRoleDetective = (role: string) => {
  const correctCheckClassName = 'bg-black'
  const wrongCheckClassName = 'bg-red-500'
  switch (role) {
    case Roles.MAFIA:
      return correctCheckClassName
    case Roles.DON:
      return correctCheckClassName
    default:
      return wrongCheckClassName
  }
}

export const performCheckRoleDon = (role: string) => {
  const correctCheckClassName = 'bg-red-500'
  const wrongCheckClassName = 'bg-black'
  switch (role) {
    case Roles.DETECTIVE:
      return correctCheckClassName
    default:
      return wrongCheckClassName
  }
}
