import React, { createContext } from 'react'

export interface IUserContext {
  userId: number,
  setUserId: (value: number) => void
}

export const UserContext: React.Context<IUserContext> = createContext({ userId: 0, setUserId: (val) => { console.log(val) } })
