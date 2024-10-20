'use client'

import { useState, useEffect } from 'react'
import { CldImage } from 'next-cloudinary';
import { useUser } from '../context/UserContext'

interface Post {
  id: number
  content: string
  image?: string
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [newImage, setNewImage] = useState('')
  const { profilePicture } = useUser()

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
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            setNewImage(result.info.public_id)
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
    if (newPost.trim() !== '') {
      setPosts([
        { id: Date.now(), content: newPost, image: newImage },
        ...posts,
      ])
      setNewPost('')
      setNewImage('')
    }
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
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            setNewImage(result.info.public_id)
          }
        }
      )
      widget.open()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded"
        />
        {newImage && (
          <CldImage src={newImage} alt="New post" width={200} height={200} crop="auto" className="rounded" />
        )}
        <div>
          <button
            type="button"
            onClick={openUploadWidget}
            className="bg-green-500 text-white p-2 rounded mr-2"
          >
            Upload Image
          </button>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Post
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded flex items-start">
            <div className="flex-shrink-0 w-[75px] h-[75px] mr-4">
            <CldImage
              src={profilePicture || 'avatar'}
              alt="Profile"
              width={75}
              height={75}
              rawTransformations={['ar_1,c_fill,g_face,h_75', 'r_max', 'co_pink,e_outline']}

            />
            </div>
            <div>
              <p>{post.content}</p>
              {post.image && (
                <CldImage src={post.image} alt="Post" width={200} height={200} crop="auto" className="mt-2 rounded" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}