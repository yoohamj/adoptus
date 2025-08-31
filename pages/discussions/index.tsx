import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import { useEffect, useMemo, useState } from 'react'
import { Auth } from 'aws-amplify'
import { PlusIcon } from '@heroicons/react/24/solid'

type Comment = {
  id: string
  author: string
  body: string
  createdAt: number
  score: number
  children?: Comment[]
}

type Thread = {
  id: string
  title: string
  body: string
  author: string
  createdAt: number
  updatedAt: number
  lastActivityAt: number
  score: number
  upvoters: string[]
  downvoters: string[]
  comments: Comment[]
}

type SortKey = 'best' | 'hot' | 'new'

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

function seedIfEmpty(): Thread[] {
  const current = loadThreads()
  if (current.length) return current
  const now = Date.now()
  const demo: Thread[] = [
    {
      id: cryptoRandomId(),
      title: 'Welcome to Discussions — share tips and stories!',
      body: 'Use this space like Reddit: ask questions, share pet stories, and help others adopt successfully.',
      author: 'AdoptUs Team',
      createdAt: now - 1000 * 60 * 60 * 24,
      updatedAt: now - 1000 * 60 * 60 * 12,
      lastActivityAt: now - 1000 * 60 * 60 * 1,
      score: 15,
      upvoters: [],
      downvoters: [],
      comments: [
        { id: cryptoRandomId(), author: 'Luna', body: 'Love this! Adopted my cat last month.', createdAt: now - 1000 * 60 * 60 * 2, score: 4 },
      ],
    },
    {
      id: cryptoRandomId(),
      title: 'Best ways to socialize a shy rescue?',
      body: 'Any tips for helping a shy dog warm up to visitors?',
      author: 'Sam',
      createdAt: now - 1000 * 60 * 60 * 6,
      updatedAt: now - 1000 * 60 * 60 * 3,
      lastActivityAt: now - 1000 * 60 * 20,
      score: 7,
      upvoters: [],
      downvoters: [],
      comments: [],
    },
  ]
  saveThreads(demo)
  return demo
}

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as any).randomUUID()
  return Math.random().toString(36).slice(2)
}

function fmt(ts: number) {
  try { return new Date(ts).toISOString().replace('T',' ').slice(0,16) } catch { return '' }
}

// Ranking helpers
function wilsonScore(up: number, down: number) {
  const n = up + down
  if (n === 0) return 0
  const z = 1.281551565545 // 80% confidence
  const phat = up / n
  const numerator = phat + (z * z) / (2 * n) - z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n)
  const denominator = 1 + (z * z) / n
  return numerator / denominator
}

function hotRank(score: number, createdAt: number) {
  // Simplified Reddit hot algorithm
  const order = Math.log10(Math.max(Math.abs(score), 1))
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0
  const seconds = (createdAt / 1000) - 1134028003 // reddit epoch
  return +(sign * order + seconds / 45000).toFixed(7)
}

// removed rising rank for simplicity

export default function DiscussionsPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [sort, setSort] = useState<SortKey>('hot')
  const [author, setAuthor] = useState<string>('Guest')

  useEffect(() => {
    // seed and load
    const seeded = seedIfEmpty()
    setThreads(seeded)
    Auth.currentAuthenticatedUser().then(u => {
      setAuthor(u?.attributes?.preferred_username || u?.username || 'User')
    }).catch(() => {})
  }, [])

  const sorted = useMemo(() => {
    const copy = [...threads]
    switch (sort) {
      case 'best':
        return copy.sort((a, b) => wilsonScore(a.score, 0) > wilsonScore(b.score, 0) ? -1 : 1)
      case 'hot':
        return copy.sort((a, b) => hotRank(a.score, a.createdAt) > hotRank(b.score, b.createdAt) ? -1 : 1)
      case 'new':
        return copy.sort((a, b) => b.createdAt - a.createdAt)
      default:
        return copy
    }
  }, [threads, sort])

  // thread creation moved to dedicated page

  function vote(id: string, dir: 1 | -1) {
    setThreads(prev => {
      const next = prev.map(t => {
        if (t.id !== id) return t
        // simple toggle voting by anonymous author key
        const voter = author || 'Guest'
        const hasUp = t.upvoters.includes(voter)
        const hasDown = t.downvoters.includes(voter)
        let up = t.upvoters
        let down = t.downvoters
        if (dir === 1) {
          up = hasUp ? up.filter(v => v !== voter) : [...new Set([...up, voter])]
          down = down.filter(v => v !== voter)
        } else {
          down = hasDown ? down.filter(v => v !== voter) : [...new Set([...down, voter])]
          up = up.filter(v => v !== voter)
        }
        const score = up.length - down.length
        return { ...t, upvoters: up, downvoters: down, score }
      })
      saveThreads(next)
      return next
    })
  }

  return (
    <div className="">
      <Head>
        <title>Discussions • Adopt Us</title>
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">Discussions</h1>
          <Link href="/discussions/create" className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700">
            <PlusIcon className="h-5 w-5" />
            <span>Create</span>
          </Link>
        </div>

        <div className="mt-6 border-b">
          <nav className="flex gap-4 text-sm">
            {(['best','hot','new'] as SortKey[]).map(key => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`py-2 capitalize ${sort===key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {key}
              </button>
            ))}
          </nav>
        </div>

        <ul className="mt-4 space-y-3">
          {sorted.map(t => (
            <li key={t.id} className="border rounded-md p-4 bg-white">
              <div className="flex gap-3">
                <div className="flex flex-col items-center text-gray-500">
                  <button aria-label="Upvote" onClick={() => vote(t.id, 1)} className="hover:text-blue-600">▲</button>
                  <div className="font-medium">{t.score}</div>
                  <button aria-label="Downvote" onClick={() => vote(t.id, -1)} className="hover:text-red-600">▼</button>
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/discussions/${t.id}`} className="block">
                    <h2 className="font-semibold text-lg truncate">{t.title}</h2>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2">{t.body}</p>
                  <div className="text-xs text-gray-500 mt-2">by {t.author} • {fmt(t.createdAt)}</div>
                </div>
              </div>
            </li>
          ))}
          {sorted.length === 0 && (
            <li className="text-center text-gray-500 py-10">No discussions yet. Be the first to post!</li>
          )}
        </ul>
      </main>
    </div>
  )
}
