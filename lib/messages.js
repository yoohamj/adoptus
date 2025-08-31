import { getUserId } from './favorites'
let API = null
try { API = require('aws-amplify').API } catch {}

const LIST_CONVERSATIONS = /* GraphQL */ `
  query ListConversations($filter: ModelConversationFilterInput) {
    listConversations(filter: $filter) {
      items { id members petId petName lastMessageAt }
    }
  }
`;
const CREATE_CONVERSATION = /* GraphQL */ `
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) { id members petId petName lastMessageAt }
  }
`;
const CREATE_MESSAGE = /* GraphQL */ `
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) { id conversationID owner participants body createdAt }
  }
`;
const DELETE_MESSAGE = /* GraphQL */ `
  mutation DeleteMessage($input: DeleteMessageInput!) { deleteMessage(input: $input) { id } }
`;
const DELETE_CONVERSATION = /* GraphQL */ `
  mutation DeleteConversation($input: DeleteConversationInput!) { deleteConversation(input: $input) { id } }
`;
const UPDATE_CONVERSATION = /* GraphQL */ `
  mutation UpdateConversation($input: UpdateConversationInput!) {
    updateConversation(input: $input) { id lastMessageAt }
  }
`;

const KEY_PREFIX = 'messages_v1:'

function read(key) {
  if (typeof window === 'undefined') return { conversations: [] }
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : { conversations: [] }
  } catch {
    return { conversations: [] }
  }
}

function write(key, data) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

export async function getInbox() {
  const uid = await getUserId()
  if (!uid) return { conversations: [] }
  // Try cloud first
  if (API && API.graphql) {
    try {
      const res = await API.graphql({ query: LIST_CONVERSATIONS, variables: { filter: { members: { contains: uid } } } })
      const items = res?.data?.listConversations?.items || []
      return { conversations: items }
    } catch {}
  }
  const key = KEY_PREFIX + uid
  return read(key)
}

export async function saveInbox(inbox) {
  const uid = await getUserId()
  if (!uid) return
  const key = KEY_PREFIX + uid
  write(key, inbox)
}

export async function getOrCreateConversation({ otherLabel, petId, petName, otherSub }) {
  const uid = await getUserId()
  if (!uid) return null
  // Cloud first
  if (API && API.graphql) {
    try {
      const find = await API.graphql({ query: LIST_CONVERSATIONS, variables: { filter: { and: [ { members: { contains: uid } }, { petId: { eq: petId } } ] } } })
      const existing = (find?.data?.listConversations?.items || [])[0]
      if (existing) return existing
      const created = await API.graphql({ query: CREATE_CONVERSATION, variables: { input: { members: otherSub ? [uid, otherSub] : [uid], petId, petName } } })
      return created?.data?.createConversation || null
    } catch {}
  }
  const inbox = await getInbox()
  let convo = inbox.conversations.find(c => c.otherLabel === otherLabel && c.petId === petId)
  if (!convo) {
    convo = { id: uuid(), createdAt: Date.now(), updatedAt: Date.now(), otherLabel, petId: petId || null, petName: petName || '', messages: [] }
    inbox.conversations.unshift(convo)
    await saveInbox(inbox)
  }
  return convo
}

export async function sendMessage(conversationId, body) {
  const uid = await getUserId()
  if (!uid) return null
  if (API && API.graphql) {
    try {
      const nowIso = new Date().toISOString()
      const res = await API.graphql({ query: CREATE_MESSAGE, variables: { input: { conversationID: conversationId, body, owner: uid, participants: [uid], createdAt: nowIso } } })
      // Update conversation lastMessageAt
      try { await API.graphql({ query: UPDATE_CONVERSATION, variables: { input: { id: conversationId, lastMessageAt: nowIso } } }) } catch {}
      return res?.data?.createMessage || null
    } catch {}
  }
  const inbox = await getInbox()
  const convo = inbox.conversations.find(c => c.id === conversationId)
  if (!convo) return null
  const msg = { id: uuid(), senderId: uid, body, ts: Date.now() }
  convo.messages.push(msg)
  convo.updatedAt = msg.ts
  inbox.conversations = [convo, ...inbox.conversations.filter(c => c.id !== conversationId)]
  await saveInbox(inbox)
  return msg
}

export async function deleteMessage(conversationId, messageId) {
  if (API && API.graphql) {
    try {
      await API.graphql({ query: DELETE_MESSAGE, variables: { input: { id: messageId } } })
      return
    } catch {}
  }
  const inbox = await getInbox()
  const convo = inbox.conversations.find(c => c.id === conversationId)
  if (!convo) return
  convo.messages = convo.messages.filter(m => m.id !== messageId)
  await saveInbox(inbox)
}

export async function deleteConversation(conversationId) {
  if (API && API.graphql) {
    try {
      await API.graphql({ query: DELETE_CONVERSATION, variables: { input: { id: conversationId } } })
      return
    } catch {}
  }
  const inbox = await getInbox()
  inbox.conversations = inbox.conversations.filter(c => c.id !== conversationId)
  await saveInbox(inbox)
}
