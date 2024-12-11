'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

export default function URLShortener() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShortUrl('')

    try {
      if (!url) {
        throw new Error('Please enter a URL')
      }

      let urlToShorten = url
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        urlToShorten = `https://${url}`
      }

      new URL(urlToShorten)
      
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToShorten }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
      }

      setShortUrl(data.shortUrl)
    } catch (err) {
      console.error('Error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to shorten URL')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center px-4 relative">
      <div className="absolute w-[800px] h-[1000px] flex items-center justify-center overflow-visible z-0 left-1/2 -translate-x-1/2">
        <Image
          src="/pepe.gif"
          alt="Background Animation"
          width={600}
          height={800}
          className="object-scale-down opacity-50"
          priority
        />
      </div>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center -mt-24 relative z-10">
        <div className="text-center space-y-6 mt-8">
          <h1 className="text-white text-6xl font-bold tracking-tight sm:text-7xl">
            urlcap
          </h1>
          <h2 className="text-white text-2xl sm:text-3xl font-normal">
            capture and analyze your links
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            urlcap is an advanced url shortener and analytics tool. track link traffic, gain
            visitor insights, and ensure the safety of your shortened urls.
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-xl mx-auto mt-40 relative z-10">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            type="text"
            placeholder="enter a url to shorten..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 h-10 text-base text-center"
            disabled={loading}
          />
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          {shortUrl && (
            <div className="bg-gray-900/50 p-4 rounded-md">
              <p className="text-green-500 text-sm mb-2">URL shortened successfully!</p>
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 break-all"
              >
                {shortUrl}
              </a>
            </div>
          )}
          
          <p className="text-sm text-gray-500 text-center">
            By creating a link, you agree to our{' '}
            <Link href="/terms" className="text-blue-500 hover:text-blue-400">
              terms
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-500 hover:text-blue-400">
              privacy policy
            </Link>
          </p>
          
          <Button 
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-100 h-10 text-base font-medium"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'create short url'}
          </Button>
        </form>
      </div>
    </div>
  )
}
