import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Auth } from 'aws-amplify'
import Header from '../../components/Header'

type Comment = {
  id: string
  author: string
  body: string
  createdAt: number
  score: number
}

type Thread = {
  id: string
  title: string
  body: string
  author: string
  authorId?: string
  createdAt: number
  updatedAt: number
  lastActivityAt: number
  score: number
  upvoters: string[]
  downvoters: string[]
  comments: Comment[]
}

const STORAGE_KEY = 'discussions_v1'

function loadThreads(): Thread[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveThreads(threads: Thread[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
}

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as any).randomUUID()
  return Math.random().toString(36).slice(2)
}

export default function CreateDiscussionPage() {
  const router = useRouter()
  const [author, setAuthor] = useState('Guest')
  const [authorId, setAuthorId] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(u => {
      setAuthor(u?.attributes?.preferred_username || u?.username || 'User')
      setAuthorId(u?.attributes?.sub || '')
    }).catch(() => {})
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    const now = Date.now()
    const thread: Thread = {
      id: cryptoRandomId(),
      title: title.trim(),
      body: body.trim(),
      author,
      authorId,
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
      score: 0,
      upvoters: [],
      downvoters: [],
      comments: [],
    }
    const existing = loadThreads()
    const next = [thread, ...existing]
    saveThreads(next)
    // go to the thread page
    router.replace(`/discussions/${thread.id}`)
  }

  return (
    <>
      <Head>
        <title>Create Discussion • Adopt Us</title>
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <Link href="/discussions" className="text-blue-600 hover:underline">← Back to Discussions</Link>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Create a new discussion</h1>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="What's on your mind?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body (optional)</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={6}
              placeholder="Add more details"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" className="inline-flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700">Create</button>
            <Link href="/discussions" className="text-sm text-gray-700 hover:text-gray-900">Cancel</Link>
          </div>
        </form>
      </main>
    </>
  )
}
