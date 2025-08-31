import Header from '../../components/Header'
import AuthPromptModal from '../../components/AuthPromptModal'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getInbox, sendMessage, deleteMessage, deleteConversation } from '../../lib/messages'
import { Auth } from 'aws-amplify'

function fmt(ts: number) {
  try { return new Date(ts).toISOString().replace('T',' ').slice(0,16) } catch { return '' }
}

export default function ConversationPage() {
  const router = useRouter()
  const { id } = router.query
  const [signedIn, setSignedIn] = useState(false)
  const [convo, setConvo] = useState<any | null>(null)
  const [me, setMe] = useState<string>('')
  const [text, setText] = useState('')
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(async (u) => {
      setSignedIn(true)
      setMe((u?.attributes?.sub) || 'me')
    }).catch(() => setSignedIn(false))
  }, [])

  useEffect(() => {
    if (!id) return
    getInbox().then(i => {
      const c = (i.conversations || []).find((x:any) => x.id === id)
      setConvo(c || null)
    })
    ;(async () => {
      try {
        const { API } = await import('aws-amplify')
        const q = /* GraphQL */ `query MessagesByConversation($conversationID: ID!) {\n          messagesByConversation(conversationID: $conversationID, sortDirection: ASC) { items { id owner body createdAt conversationID } }\n        }`
        const res:any = await API.graphql({ query: q, variables: { conversationID: id } })
        const items = res?.data?.messagesByConversation?.items || []
        setConvo((c: any) => c ? { ...c, messages: items.map((m:any) => ({ id: m.id, senderId: m.owner, body: m.body, ts: Date.parse(m.createdAt) || Date.now() })) } : c)
      } catch {}
    })()
  }, [id])

  useEffect(() => {
    if (!id) return
    let sub:any
    ;(async () => {
      try {
        const { API } = await import('aws-amplify')
        const subQ = /* GraphQL */ `subscription OnCreateMessage { onCreateMessage { id conversationID owner body createdAt } }`
        // @ts-ignore
        sub = API.graphql({ query: subQ }).subscribe({
          next: (evt:any) => {
            const m = evt?.value?.data?.onCreateMessage
            if (m && String(m.conversationID) === String(id)) {
              setConvo((c: any) => c ? { ...c, messages: [ ...(c.messages||[]), { id: m.id, senderId: m.owner, body: m.body, ts: Date.parse(m.createdAt) || Date.now() } ] } : c)
            }
          }
        })
      } catch {}
    })()
    return () => { try { sub && sub.unsubscribe && sub.unsubscribe() } catch {} }
  }, [id])

  async function send() {
    if (!text.trim() || !id) return
    try { await Auth.currentAuthenticatedUser() } catch { setShowAuth(true); return }
    await sendMessage(String(id), text.trim())
    setText('')
    const i = await getInbox()
    setConvo((i.conversations || []).find((x:any) => x.id === id) || null)
  }

  async function onDeleteMessage(mid: string) {
    await deleteMessage(String(id), mid)
    const i = await getInbox()
    setConvo((i.conversations || []).find((x:any) => x.id === id) || null)
  }

  async function onDeleteConversation() {
    await deleteConversation(String(id))
    router.replace('/messages')
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!signedIn ? (
          <p className="text-gray-600">Please sign in to use messages.</p>
        ) : !convo ? (
          <p className="text-gray-600">Conversation not found.</p>
        ) : (
          <div className="flex flex-col h-[70vh] border rounded-md bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <div className="font-semibold">{convo.petName || 'Conversation'}</div>
                <div className="text-sm text-gray-600">with {convo.otherLabel}</div>
              </div>
              <button onClick={onDeleteConversation} className="text-sm text-red-600 hover:text-red-700">Delete</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(convo.messages || []).map((m:any) => (
                <div key={m.id} className={`max-w-[75%] ${m.senderId===me ? 'ml-auto text-right' : ''}`}>
                  <div className={`inline-block rounded-lg px-3 py-2 text-sm ${m.senderId===me ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                    <div>{m.body}</div>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{fmt(m.ts)}</div>
                  {m.senderId===me && (
                    <button onClick={() => onDeleteMessage(m.id)} className="text-[11px] text-red-600 hover:text-red-700">Remove</button>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex items-center gap-2">
              <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send() }} className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Type a message" />
              <button onClick={send} className="px-4 py-2 rounded bg-blue-600 text-white text-sm">Send</button>
            </div>
          </div>
        )}
      </main>
      <AuthPromptModal open={showAuth} onClose={()=>setShowAuth(false)} onSignIn={()=>{ setShowAuth(false); window.location.href='/profile' }} action="message" title={"Please sign in to use messages"} description="" />
    </>
  )
}
