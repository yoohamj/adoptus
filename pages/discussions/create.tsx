import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Auth } from 'aws-amplify'
import Header from '../../components/Header'
import { API, Storage } from 'aws-amplify'
import { createDiscussion } from '../../graphql/discussions'

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
  images?: string[]
  community?: string
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
  const [community, setCommunity] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const COMMUNITIES = useMemo(() => [
    'Global',
    'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton',
  ], [])

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(u => {
      setAuthor(u?.attributes?.preferred_username || u?.username || 'User')
      setAuthorId(u?.attributes?.sub || '')
    }).catch(() => {})
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Title is required'); return }
    if (!community) { setError('Please select a community'); return }
    setSubmitting(true)
    const now = Date.now()
    try {
      // Try to upload images to S3 (public)
      let imageKeys: string[] = []
      if (imageFiles.length) {
        const uploads = imageFiles.slice(0,6).map(async (file, idx) => {
          const ext = file.name.split('.').pop() || 'jpg'
          const key = `discussions/${authorId || 'anon'}/${now}-${idx}.${ext}`
          await Storage.put(key, file, { level: 'public', contentType: file.type || 'image/jpeg' })
          return key
        })
        imageKeys = await Promise.all(uploads)
      }
      // Create via GraphQL API
      const input: any = {
        community,
        title: title.trim(),
        body: body.trim(),
        author,
        authorId,
        imageKeys,
        score: 0,
        upvoters: [],
        downvoters: [],
        commentsJSON: JSON.stringify([]),
        lastActivityAt: new Date(now).toISOString(),
      }
      const res: any = await API.graphql({ query: createDiscussion, variables: { input }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
      const id = res?.data?.createDiscussion?.id
      if (id) {
        router.replace(`/discussions/${id}`)
        return
      }
      throw new Error('CreateDiscussion returned no id')
    } catch (err) {
      // Fallback to localStorage
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
        images: imagePreviews,
        community,
      } as any
      const existing = loadThreads()
      const next = [thread, ...existing]
      saveThreads(next)
      router.replace(`/discussions/${thread.id}`)
    } finally {
      setSubmitting(false)
    }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
            <select value={community} onChange={e=>setCommunity(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" required>
              <option value="" disabled>Select a community</option>
              {COMMUNITIES.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images (optional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []).slice(0, 6)
                setImageFiles(files)
                const previews = files.map(f => URL.createObjectURL(f))
                setImagePreviews(previews)
              }}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {imagePreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imagePreviews.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt={`upload-${i}`} className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center justify-center bg-[#FF5A5F] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#ff7b80] disabled:opacity-60">{submitting ? 'Creating…' : 'Create'}</button>
            <Link href="/discussions" className="text-sm text-gray-700 hover:text-gray-900">Cancel</Link>
          </div>
        </form>
      </main>
    </>
  )
}
