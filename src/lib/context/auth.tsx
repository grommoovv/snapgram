import { useNavigate } from 'react-router-dom'
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

import { IUser } from '@/types'
import { getCurrentUser } from '@/api/appwrite'

const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isUserAuthenticated: false,
  setUser: () => {},
  setUserAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

type IContextType = {
  user: IUser
  isLoading: boolean
  setUser: React.Dispatch<React.SetStateAction<IUser>>
  isUserAuthenticated: boolean
  setUserAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const useUserContext = () => useContext(AuthContext)

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isUserAuthenticated, setUserAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkAuthUser = async () => {
    setIsLoading(true)
    try {
      const currentAccount = await getCurrentUser()
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        })
        setUserAuthenticated(true)

        return true
      }

      return false
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const cookieFallback = localStorage.getItem('cookieFallback')
    if (cookieFallback === '[]' || cookieFallback === null || cookieFallback === undefined) {
      navigate('/sign-in')
    }

    checkAuthUser()
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isUserAuthenticated,
    setUserAuthenticated,
    checkAuthUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContextProvider, useUserContext, INITIAL_USER }
