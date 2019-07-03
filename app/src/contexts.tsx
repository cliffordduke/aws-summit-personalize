import React, { createContext, useContext } from "react";
import { __RouterContext } from "react-router";

export interface IUserContext {
  userId: number;
  setUserId: (value: number) => void;
}

export const UserContext: React.Context<IUserContext> = createContext({
  userId: 0,
  setUserId: val => {
    console.log(val);
  }
});

export const useRouter = () => useContext(__RouterContext);
