import Header from '../../components/Header'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getInbox } from '../../lib/messages'
import { Auth } from 'aws-amplify'

function fmt(ts: number) {
  try { return new Date(ts).toISOString().replace('T',' ').slice(0,16) } catch { return '' }
}

export default function MessagesIndex() {
  const [signedIn, setSignedIn] = useState(false)
  const [convos, setConvos] = useState<any[]>([])
  const sorted = [...convos].sort((a:any,b:any) => (new Date(b.lastMessageAt||0).getTime()) - (new Date(a.lastMessageAt||0).getTime()))
  useEffect(() => {
    Auth.currentAuthenticatedUser().then(() => setSignedIn(true)).catch(() => setSignedIn(false))
    getInbox().then((i) => setConvos(i.conversations || []))
  }, [])
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold">Messages</h1>
        {!signedIn ? (
          <p className="mt-4 text-gray-600">Please sign in to use messages.</p>
        ) : convos.length === 0 ? (
          <p className="mt-4 text-gray-600">No conversations yet.</p>
        ) : (
          <ul className="mt-4 divide-y rounded-md border bg-white">
            {sorted.map(c => (
              <li key={c.id} className="p-4 hover:bg-gray-50">
                <Link href={`/messages/${c.id}`} className="block">
                  <div className="font-medium">{c.petName || 'Conversation'}</div>
                  <div className="text-sm text-gray-600">with {c.otherLabel}</div>
                  <div className="text-xs text-gray-500">Updated {fmt(c.lastMessageAt || c.updatedAt)}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
