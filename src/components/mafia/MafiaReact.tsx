import { FC, useCallback, useState } from 'react'
import '../../i18n/config'
import { useTranslation } from 'react-i18next'
import { FullscreenPlayer, initialState, MainGameState, Player, Roles } from './Mafia.interface'
import { FullscreenPlayer as FullscreenPlayerComponent } from './FullscreenPlayer'
import { performCheckRoleDetective, performCheckRoleDon } from './util'
import { Button } from './Button'

const getStateFromLocalStorage = (stateKey: string) => {
  const storage = localStorage.getItem(stateKey)
  if (storage) return JSON.parse(storage)
  return undefined
}

export const MafiaReact: FC = () => {
  const { t } = useTranslation()
  const [state, setState] = useState<MainGameState>(getStateFromLocalStorage('state') || initialState)
  const [isNight, setIsNight] = useState<boolean>(false)
  const [emojiMode, setEmojiMode] = useState<boolean>(false)
  const [isFaultsMode, setIsFaultsMode] = useState<boolean>(false)
  const [fullscreenPlayer, setFullscreenPlayer] = useState<FullscreenPlayer | null>(null)
  const [viewingRole, setViewingRole] = useState<string>('')

  const addPlayer = () => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: [
          ...prevState.players,
          {
            role: Roles.TOWNSMAN,
            alive: true,
            muted: false,
            faults: 0,
            votes: 0
          }
        ]
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const killPlayer = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return {
              ...x,
              alive: false
            }
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const restorePlayer = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return {
              ...x,
              alive: true
            }
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const mutePlayer = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return {
              ...x,
              muted: true
            }
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const unmutePlayer = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return {
              ...x,
              muted: false
            }
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const handleChangeDayPhase = () => {
    setIsNight(!isNight)
  }

  const handleChangeFaultsMode = () => {
    setIsFaultsMode(!isFaultsMode)
  }

  const handleFullscreenPlayer = (player: Player, index: number, role?: string) => {
    setFullscreenPlayer({ ...player, index })
    setViewingRole(role === Roles.DON ? Roles.DON : Roles.DETECTIVE)
  }

  const handleFullscreenPlayerClose = () => {
    setFullscreenPlayer(null)
  }

  const handleNewGame = () => {
    setState(initialState)
    setIsNight(false)
    setFullscreenPlayer(null)
    localStorage.removeItem('state')
  }

  const getPlayerKilledClassName = useCallback((player: Player) => {
    // if player not alive, then return className with strike-through
    return player.alive ? '' : 'line-through'
  }, [])

  const handleRotateRole = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return getNewRoleForPlayer(x)
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const handleAddFault = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return {
              ...x,
              faults: x.faults + 1
            }
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const handleRemoveOneFault = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return {
              ...x,
              faults: x.faults > 0 ? x.faults - 1 : 0
            }
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const handleAddVote = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return {
              ...x,
              votes: x.votes + 1
            }
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  const handleRemoveOneVote = (player: Player) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        players: prevState.players.map((x) => {
          if (x === player) {
            return {
              ...x,
              votes: x.votes > 0 ? x.votes - 1 : 0
            }
          }
          return x
        })
      }
      localStorage.setItem('state', JSON.stringify(newState))
      return newState
    })
  }

  return (
    <>
      <section className='h-screen'>
        <div className='container'>
          <h1 className='text-3xl font-bold text-center text-black mb-4'>Список гравців</h1>
          {state.players.map((player, index) => {
            const playerKilledClassName = [getPlayerKilledClassName(player), 'mr-1'].join(' ')
            const faultsMoreThanThreeClassName = player.faults > 3 ? 'bg-red-800' : 'bg-blue-800'
            const containerClassName = [
              faultsMoreThanThreeClassName,
              'fade show py-4 px-6 text-white md:flex justify-between items-center text-center md:text-left'
            ].join(' ')
            return (
              <div key={index} className={containerClassName}>
                <div className='mb-4 md:mb-0 flex items-center flex-wrap justify-center md:justify-start'>
                  <strong className={playerKilledClassName}>{index + 1}.</strong>
                  <span className={playerKilledClassName}>{isNight ? `${player.role},` : ''}</span>
                  <span className={playerKilledClassName}>
                    {player.alive ? 'Живий' : 'Мертвий'}
                    {isNight ? '' : ','}
                  </span>
                  <span className={playerKilledClassName}>{player.muted ? 'Мовчить,' : ''}</span>
                  {isFaultsMode && isNight === false && (
                    <span className={playerKilledClassName}>Фолів: {player.faults}</span>
                  )}
                  {isFaultsMode === false && isNight === false && (
                    <span className={playerKilledClassName}>Голосів: {player.votes}</span>
                  )}
                </div>
                <div className='flex lg:flex-row items-center justify-center flex-wrap gap-2'>
                  {state.players.some((x) => x.alive === true && x.role === Roles.DETECTIVE) && isNight && (
                    <Button
                      className='text-3xl p-0'
                      onClick={() => handleFullscreenPlayer(player, index + 1, Roles.DETECTIVE)}
                    >
                      👮
                    </Button>
                  )}
                  {state.players.some((x) => x.alive === true && x.role === Roles.DON) && isNight && (
                    <Button
                      className='text-3xl p-0'
                      onClick={() => handleFullscreenPlayer(player, index + 1, Roles.DON)}
                    >
                      🐺
                    </Button>
                  )}
                  {isNight && (
                    <Button className='px-3 py-2.5' onClick={() => handleRotateRole(player)}>
                      ➡️ {getNewRoleForPlayer(player).role}
                    </Button>
                  )}
                  <Button
                    className='text-3xl p-0'
                    onClick={() => {
                      player.alive ? killPlayer(player) : restorePlayer(player)
                    }}
                  >
                    {player.alive ? '💀' : '😇'}
                  </Button>
                  {state.players.some((x) => x.alive === true && x.role === Roles.LADY) && isNight && (
                    <Button
                      className='text-3xl p-0'
                      onClick={() => {
                        player.muted ? unmutePlayer(player) : mutePlayer(player)
                      }}
                    >
                      {player.muted ? '🧏' : '🎤'}
                    </Button>
                  )}
                  {isFaultsMode && isNight === false && player.faults > 0 && (
                    <Button className='px-3 py-2.5' onClick={() => handleRemoveOneFault(player)}>
                      -1 Фол
                    </Button>
                  )}
                  {isFaultsMode && isNight === false && (
                    <Button className='px-3 py-2.5' onClick={() => handleAddFault(player)}>
                      +1 Фол
                    </Button>
                  )}
                  {isFaultsMode === false && isNight === false && player.votes > 0 && (
                    <Button className='px-3 py-2.5' onClick={() => handleRemoveOneVote(player)}>
                      -1 Голос
                    </Button>
                  )}
                  {isFaultsMode === false && isNight === false && (
                    <Button className='px-3 py-2.5' onClick={() => handleAddVote(player)}>
                      +1 Голос
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
          <div className='bg-blue-500 fade show py-4 px-6 text-white md:flex justify-between items-center text-center md:text-left'>
            <div className='mb-4 md:mb-0 flex items-center flex-wrap justify-center md:justify-start'>
              <strong className='mr-1'>Управління грою</strong>
            </div>
            <div className='flex items-center justify-center'>
              <Button className='px-3 py-2.5' onClick={addPlayer}>
                +1 гравець
              </Button>
              <Button className='text-3xl p-0' onClick={handleChangeDayPhase}>
                {isNight ? '🌚' : '🌞'}
              </Button>
              {isNight === false && (
                <Button className='px-3 py-2.5' onClick={handleChangeFaultsMode}>
                  {isFaultsMode ? 'Сховати' : 'Показати'} фоли
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-col mt-2'>
          <h2 className='text-2xl font-bold text-center text-black mb-4'>Легенда</h2>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>👮</span>
              <span>Показати роль Детективу / Шеріфу / Комісару</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>🐺</span>
              <span>Показати роль Дону</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>➡️</span>
              <span>Змінити роль гравця</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>💀</span>
              <span>Вбити гравця</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>😇</span>
              <span>Відновити гравця</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>🧏</span>
              <span>Розглушити гравця</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>🎤</span>
              <span>Заглушити гравця</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>🌚</span>
              <span>Змінити фазу на день з ночі</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>🌞</span>
              <span>Змінити фазу на ніч з дня</span>
            </div>
          </div>
        </div>
        {state.players.length > 0 && (
          <div className='container'>
            <div className='bg-red-500 fade show py-4 px-6 text-white md:flex justify-between items-center text-center md:text-left'>
              <div className='mb-4 md:mb-0 flex items-center flex-wrap justify-center md:justify-start'>
                <Button className='px-3 py-2.5' onClick={handleNewGame}>
                  Закінчити гру
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
      {fullscreenPlayer && (
        <FullscreenPlayerComponent
          fullscreenPlayer={fullscreenPlayer}
          performCheckRole={(role: string) => {
            return viewingRole === Roles.DON ? performCheckRoleDon(role) : performCheckRoleDetective(role)
          }}
          handleClose={handleFullscreenPlayerClose}
        />
      )}
    </>
  )
}

const getNewRoleForPlayer = (player: Player): Player => {
  switch (player.role) {
    case Roles.MAFIA:
      return {
        ...player,
        role: Roles.LADY
      }
    case Roles.LADY:
      return {
        ...player,
        role: Roles.DON
      }
    case Roles.DON:
      return {
        ...player,
        role: Roles.DOCTOR
      }
    case Roles.DOCTOR:
      return {
        ...player,
        role: Roles.DETECTIVE
      }
    case Roles.DETECTIVE:
      return {
        ...player,
        role: Roles.TOWNSMAN
      }
    case Roles.TOWNSMAN:
      return {
        ...player,
        role: Roles.MAFIA
      }
    default:
      return player
  }
}
