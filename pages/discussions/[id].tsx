import Link from 'next/link'
import Header from '../../components/Header'
import AuthPromptModal from '../../components/AuthPromptModal'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState, Fragment } from 'react'
import { Auth } from 'aws-amplify'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

type Comment = {
  id: string
  author: string
  authorId?: string
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

function fmt(ts: number) {
  try {
    return new Date(ts).toISOString().replace('T', ' ').slice(0, 16)
  } catch {
    return ''
  }
}

export default function ThreadPage() {
  const router = useRouter()
  const { id } = router.query
  const [threads, setThreads] = useState<Thread[]>([])
  const [author, setAuthor] = useState('Guest')
  const [userId, setUserId] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [comment, setComment] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentBody, setEditingCommentBody] = useState('')
  const [editingPost, setEditingPost] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  useEffect(() => {
    setThreads(loadThreads())
    Auth.currentAuthenticatedUser().then(u => {
      setAuthor(u?.attributes?.preferred_username || u?.username || 'User')
      setUserId(u?.attributes?.sub || '')
      setUserEmail(u?.attributes?.email || '')
    }).catch(() => {})
  }, [])

  const isMineLabel = (label: string) => {
    const opts = [author, userEmail].filter(Boolean).map(s => String(s))
    return opts.includes(label)
  }
  const isMineComment = (c: Comment) => {
    if (c.authorId && userId && c.authorId === userId) return true
    return isMineLabel(c.author)
  }
  const isMineThread = (t?: Thread) => {
    if (!t) return false
    if (t.authorId && userId && t.authorId === userId) return true
    return isMineLabel(t.author)
  }

  const thread = useMemo(() => threads.find(t => t.id === id), [threads, id])
  useEffect(() => {
    if (thread && editingPost) {
      setEditTitle(thread.title)
      setEditBody(thread.body || '')
    }
  }, [editingPost, thread])

  function vote(dir: 1 | -1) {
    if (!thread) return
    setThreads(prev => {
      const voter = author || 'Guest'
      const next = prev.map(t => {
        if (t.id !== thread.id) return t
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

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!thread || !comment.trim()) return
    try {
      await Auth.currentAuthenticatedUser()
    } catch {
      setShowPrompt(true)
      return
    }
    const now = Date.now()
    const c: Comment = { id: cryptoRandomId(), author, authorId: userId, body: comment.trim(), createdAt: now, score: 0 }
    setThreads(prev => {
      const next = prev.map(t => t.id === thread.id ? { ...t, comments: [c, ...t.comments], lastActivityAt: now, updatedAt: now } : t)
      saveThreads(next)
      return next
    })
    setComment('')
  }

  function removeComment(commentId: string) {
    setThreads(prev => {
      const next = prev.map(t => {
        if (!thread || t.id !== thread.id) return t
        const filtered = t.comments.filter(c => !(c.id === commentId && isMineComment(c)))
        return { ...t, comments: filtered }
      })
      saveThreads(next)
      return next
    })
  }

  function startEditComment(c: Comment) {
    if (c.author !== author) return
    setEditingCommentId(c.id)
    setEditingCommentBody(c.body)
  }
  function cancelEditComment() {
    setEditingCommentId(null)
    setEditingCommentBody('')
  }
  function saveEditComment() {
    if (!thread || !editingCommentId) return
    const body = editingCommentBody.trim()
    if (!body) return
    setThreads(prev => {
      const next = prev.map(t => {
        if (t.id !== thread.id) return t
        const updated = t.comments.map(c => c.id === editingCommentId && c.author === author ? { ...c, body } : c)
        return { ...t, comments: updated, updatedAt: Date.now() }
      })
      saveThreads(next)
      return next
    })
    setEditingCommentId(null)
    setEditingCommentBody('')
  }

  function startEditPost() {
    if (!thread || !isMineThread(thread)) return
    setEditingPost(true)
    setEditTitle(thread.title)
    setEditBody(thread.body || '')
  }
  function cancelEditPost() {
    setEditingPost(false)
  }
  function saveEditPost() {
    if (!thread) return
    const t = editTitle.trim()
    if (!t) return
    setThreads(prev => {
      const now = Date.now()
      const next = prev.map(x => x.id === thread.id ? { ...x, title: t, body: editBody, updatedAt: now, lastActivityAt: now } : x)
      saveThreads(next)
      return next
    })
    setEditingPost(false)
  }
  function deletePost() {
    if (!thread || !isMineThread(thread)) return
    setThreads(prev => {
      const next = prev.filter(t => t.id !== thread.id)
      saveThreads(next)
      return next
    })
    router.replace('/discussions')
  }

  if (!thread) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-gray-600">Loading…</p>
      </main>
    )
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <Link href="/discussions" className="text-blue-600 hover:underline">← Back to Discussions</Link>
      </div>
      <article className="border rounded-md p-4 bg-white relative">
        <div className="flex gap-3">
          <div className="flex flex-col items-center text-gray-500">
            <button aria-label="Upvote" onClick={() => vote(1)} className="hover:text-blue-600">▲</button>
            <div className="font-medium">{thread.score}</div>
            <button aria-label="Downvote" onClick={() => vote(-1)} className="hover:text-red-600">▼</button>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              {editingPost ? (
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="font-semibold text-2xl border rounded px-2 py-1 w-full" />
              ) : (
                <h1 className="font-semibold text-2xl">{thread.title}</h1>
              )}
              {isMineThread(thread) && (
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="p-1 rounded hover:bg-gray-100">
                    <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" />
                  </Menu.Button>
                  <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-20 mt-2 w-44 origin-top-right rounded-md bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1 text-sm">
                        <Menu.Item>
                          {({ active }) => (
                            <button className={`flex w-full items-center gap-2 px-3 py-2 ${active ? 'bg-gray-100' : ''}`} onClick={startEditPost}>
                              <PencilSquareIcon className="h-4 w-4 text-gray-600" /> Edit post
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button className={`flex w-full items-center gap-2 px-3 py-2 text-red-600 ${active ? 'bg-gray-100' : ''}`} onClick={deletePost}>
                              <TrashIcon className="h-4 w-4" /> Delete post
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">by {thread.author} • {fmt(thread.createdAt)}</div>
            {editingPost ? (
              <div className="mt-3 space-y-2">
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={5} className="w-full border rounded px-2 py-2 text-sm" />
                <div className="flex items-center gap-2">
                  <button onClick={saveEditPost} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Save</button>
                  <button onClick={cancelEditPost} className="px-3 py-1.5 rounded border text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              thread.body && <p className="mt-3 whitespace-pre-line">{thread.body}</p>
            )}
          </div>
        </div>
      </article>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        <form onSubmit={addComment} className="grid grid-cols-1 gap-2">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment"
            className="w-full border rounded-md px-3 py-2 text-sm"
            rows={3}
          />
          <div>
            <button type="submit" className="inline-flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700">Comment</button>
          </div>
        </form>

        <ul className="mt-4 space-y-3">
          {thread.comments.map(c => (
            <li key={c.id} className="border rounded-md p-3 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm"><span className="font-medium">{c.author}</span> <span className="text-gray-500">• {fmt(c.createdAt)}</span></div>
                {isMineComment(c) && (
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="p-1 rounded hover:bg-gray-100"><EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" /></Menu.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                      <Menu.Items className="absolute right-0 z-20 mt-2 w-44 origin-top-right rounded-md bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1 text-sm">
                          <Menu.Item>
                            {({ active }) => (
                              <button className={`flex w-full items-center gap-2 px-3 py-2 ${active ? 'bg-gray-100' : ''}`} onClick={() => startEditComment(c)}>
                                <PencilSquareIcon className="h-4 w-4 text-gray-600" /> Edit comment
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button className={`flex w-full items-center gap-2 px-3 py-2 text-red-600 ${active ? 'bg-gray-100' : ''}`} onClick={() => removeComment(c.id)}>
                                <TrashIcon className="h-4 w-4" /> Delete comment
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
              {editingCommentId === c.id ? (
                <div className="mt-2 space-y-2">
                  <textarea value={editingCommentBody} onChange={e => setEditingCommentBody(e.target.value)} rows={3} className="w-full border rounded px-2 py-2 text-sm" />
                  <div className="flex items-center gap-2">
                    <button onClick={saveEditComment} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Save</button>
                    <button onClick={cancelEditComment} className="px-3 py-1.5 rounded border text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-line">{c.body}</p>
              )}
            </li>
          ))}
          {thread.comments.length === 0 && (
            <li className="text-gray-500 text-sm">No comments yet. Be the first to comment.</li>
          )}
        </ul>
      </section>
    </main>
    <AuthPromptModal
      open={showPrompt}
      onClose={() => setShowPrompt(false)}
      onSignIn={() => { setShowPrompt(false); window.location.href = '/profile' }}
      action="Comment"
      title={"Please sign in to post a comment"}
      description={""}
    />
    </>
  )
}
