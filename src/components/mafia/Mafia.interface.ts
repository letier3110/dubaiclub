
export const Roles = {
  MAFIA: 'Мафія',
  LADY: 'Мадам',
  DON: 'Дон Мафії',
  DOCTOR: 'Лікар',
  DETECTIVE: 'Комісар',
  TOWNSMAN: 'Мирний житель'
} as const

export interface Player {
  role: string
  alive: boolean
  muted: boolean
  faults: number
  votes: number
}

export interface MainGameState {
  players: Player[]
}

export interface FullscreenPlayer extends Player {
  index: number
}

export const initialState: MainGameState = {
  players: []
}