'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

interface Post {
  id: number
  content: string
  image?: string
}

interface UserContextType {
  profilePicture: string
  setProfilePicture: (url: string) => void
  name: string
  setName: (name: string) => void
  location: string
  setLocation: (location: string) => void
  birthday: string
  setBirthday: (birthday: string) => void
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profilePicture, setProfilePicture] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [birthday, setBirthday] = useState('')
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem('profilePicture')
    const storedName = localStorage.getItem('name')
    const storedLocation = localStorage.getItem('location')
    const storedBirthday = localStorage.getItem('birthday')

    if (storedProfilePicture) setProfilePicture(storedProfilePicture)
    if (storedName) setName(storedName)
    if (storedLocation) setLocation(storedLocation)
    if (storedBirthday) setBirthday(storedBirthday)
  }, [])

  useEffect(() => {
    localStorage.setItem('profilePicture', profilePicture)
    localStorage.setItem('name', name)
    localStorage.setItem('location', location)
    localStorage.setItem('birthday', birthday)
  }, [profilePicture, name, location, birthday])

  return (
    <UserContext.Provider value={{ 
      profilePicture, setProfilePicture,
      name, setName,
      location, setLocation,
      birthday, setBirthday,
      posts, setPosts
    }}>
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