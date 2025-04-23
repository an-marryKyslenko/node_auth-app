import React, { createContext, useContext, useState, ReactNode } from 'react'
import { NewUser, User } from '../types/User'
import { ActivationStatus, AuthState } from '../types/Auth'

interface AuthContextType {
  auth: AuthState
  registration: (data: NewUser) => void
  activate: (email: string, token: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  activationStatus: ActivationStatus
  message: string
  isLoading: boolean
  user: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getInitialAuthState = (): AuthState => {
  const raw = localStorage.getItem('auth');
  return raw ? JSON.parse(raw) : { token: null, isAuthenticated: false };
};

export const AuthProvider = ({ children }: {children: ReactNode}) => {
  const [auth, setAuth] = useState<AuthState>(getInitialAuthState);
  const [activationStatus, setActivationStatus] = useState<ActivationStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const registration = async ({email,password,name}: NewUser) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password, name})
      })

      if(!response.ok) {
        const error = await response.json();

        throw new Error(error.message || 'Unknown error!')
      }

      const  result = await response.json();

      localStorage.setItem('activationToken', result.activationToken);
      setMessage('Success!')

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Unknown error!');
      }
    } finally{
      setTimeout(() => {
        setMessage('')
      }, 3000)
    }
  }

  const activate = async (email:string, token: string): Promise<boolean> => {
    setActivationStatus('loading')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/activate/${email}/${encodeURIComponent(token)}`);
      if (!response.ok) throw new Error('Activation failed');

      const result = await response.json();

      setUser(result)
      setActivationStatus('success');
      localStorage.removeItem('activationToken')

      return true
    } catch (err) {
      setActivationStatus('error')
      console.log(err)
      return false
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password})
      })

      if(!response.ok) {
        const error: {message: string} = await response.json();
        throw new Error(error.message || '')
      }

      const result = await response.json();
      localStorage.setItem('auth', JSON.stringify({
        token: result.accessToken,
        isAuthenticated: true
      }))

      setUser(result.user)
      setAuth(getInitialAuthState);
      setIsLoading(false);
      setMessage('Success!')

      return true
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Unknown error!');
      }
      return false
    }finally{
      setTimeout(() => {
        setMessage('')
      }, 3000)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth({token:null, isAuthenticated: false})
  }
  return (
    <AuthContext.Provider value={{
      auth,
      registration,
      logout,
      activate,
      login,
      activationStatus,
      message,
      isLoading,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const context = useContext(AuthContext);

  if(!context) {
    throw new Error('useContext must be used within an AuthProvider')
  }

  return context;
}
