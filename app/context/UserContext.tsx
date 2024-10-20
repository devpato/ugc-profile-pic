'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

interface UserContextType {
  profilePicture: string
  setProfilePicture: (url: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profilePicture, setProfilePicture] = useState('')

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem('profilePicture')
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('profilePicture', profilePicture)
  }, [profilePicture])

  return (
    <UserContext.Provider value={{ profilePicture, setProfilePicture }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}