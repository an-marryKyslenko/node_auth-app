import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../types/User";
import { AuthState } from "../types/Auth";

type UsersContextType = {
  users: User[]
  getUsers: () => void
  getActiveUser: (email: string) => Promise<boolean>
}
const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({children}: {children: ReactNode}) => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const row = localStorage.getItem('auth')
      const token = row ? JSON.parse(row).token : null;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const result = await response.json();

      setUsers(result)

    } catch (error) {
      console.log(error)
    }
  }

  const getActiveUser = async (email: string): Promise<boolean>=> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`);

      if(!res.ok) {
        throw new Error('User not found');
      }

      return true;

    } catch (error) {
      return false;
    }
  }
  return <UsersContext.Provider value={{
    users,
    getUsers,
    getActiveUser
  }}>
    {children}
  </UsersContext.Provider>
}


export const useUsers = () => {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error('useContext must be used within an AuthProvider');
  }

  return context;
}
