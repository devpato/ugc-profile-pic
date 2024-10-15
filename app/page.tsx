'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function MyProfile() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [birthday, setBirthday] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    let widget: any;
    if (typeof window !== 'undefined' && window.cloudinary) {
      widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'cld-demo-ugc',
          uploadPreset: 'ugc-profile-photo',
          sources: ['local'],
          multiple: false,
          maxFiles: 1,
          cropping: true,
          croppingAspectRatio: 1,
          showSkipCropButton: false,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            setProfilePicture(result.info.secure_url)
          }
        }
      )
    }

    return () => {
      if (widget) {
        widget.destroy();
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  const openUploadWidget = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'cld-demo-ugc',
          uploadPreset: 'ugc-profile-photo',
          sources: ['local'],
          multiple: false,
          maxFiles: 1,
          cropping: true,
          croppingAspectRatio: 1,
          showSkipCropButton: false,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            setProfilePicture(result.info.secure_url)
          }
        }
      )
      widget.open()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Save
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <p><strong>Name:</strong> {name || 'Not set'}</p>
          <p><strong>Location:</strong> {location || 'Not set'}</p>
          <p><strong>Birthday:</strong> {birthday || 'Not set'}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-500 text-white p-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Profile Picture</h2>
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt="Profile"
            width={300}
            height={450}
            className="rounded"
          />
        ) : (
          <div className="w-[300px] h-[450px] bg-gray-200 flex items-center justify-center rounded">
            No picture set
          </div>
        )}
        <button
          onClick={openUploadWidget}
          className="mt-2 bg-blue-500 text-white p-2 rounded"
        >
          Edit Profile Picture
        </button>
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      </div>
    </div>
  )
}