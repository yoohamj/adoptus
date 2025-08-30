import '../configureAmplify'
import { getUserProfile } from '../graphql/queries'
import { createUserProfile, updateUserProfile, createUserActivity } from '../graphql/mutations'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    pictureUrl: '',
  })
  const [profileExists, setProfileExists] = useState(false)
  const [newAvatar, setNewAvatar] = useState(null) // File
  const [avatarPreview, setAvatarPreview] = useState('')
  const MAX_AVATAR_MB = 5

  useEffect(() => {
    const init = async () => {
      try {
        const { Auth, API } = await import('aws-amplify')
        const u = await Auth.currentAuthenticatedUser()
        setUser(u)
        const a = u.attributes || {}
        setForm({
          firstName: a.given_name || '',
          lastName: a.family_name || '',
          birthdate: a.birthdate || '',
          phone: a.phone_number || '',
          address: a.address || '',
          city: '',
          state: '',
          zip: '',
          country: '',
          pictureUrl: a.picture || '',
        })

        // Try to load existing UserProfile from AppSync using sub as id
        try {
          // Gracefully skip if API not yet ready
          const { API } = await import('aws-amplify')
          const sub = u?.attributes?.sub
          if (sub) {
            const slowFallback = new Promise((resolve) => setTimeout(() => resolve(null), 4000))
            const result = await Promise.race([
              API.graphql({ query: getUserProfile, variables: { id: sub }, authMode: 'AMAZON_COGNITO_USER_POOLS' }),
              slowFallback,
            ])
            const p = result?.data?.getUserProfile
            if (p) {
              setProfileExists(true)
              setForm((f) => ({
                ...f,
                // Prefer AppSync profile fields when present
                firstName: p.name?.split(' ')?.[0] || f.firstName,
                lastName: p.name?.split(' ')?.slice(1).join(' ') || f.lastName,
                birthdate: p.birthdate || f.birthdate,
                city: p.city || f.city,
                state: p.state || f.state,
                country: p.country || f.country,
                pictureUrl: p.pictureKey || f.pictureUrl,
              }))
            } else {
              setProfileExists(false)
            }
          }
        } catch (e) {
          // Swallow if schema not yet pushed
        }
      } catch {
        setError('Please sign in to access settings.')
        if (typeof window !== 'undefined') {
          alert('Please sign in to access settings.')
          window.location.href = '/profile'
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setError(`Avatar must be under ${MAX_AVATAR_MB} MB`)
      return
    }
    setError('')
    setNewAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const save = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      let pictureUrl = form.pictureUrl
      if (newAvatar) {
        try {
          const { Storage } = await import('aws-amplify')
          const ext = newAvatar.name.split('.').pop()
          const key = `avatars/${user.username}-${Date.now()}.${ext}`
          await Storage.put(key, newAvatar, { level: 'public', contentType: newAvatar.type })
          // Try to resolve a URL to store in Cognito picture
          try {
            pictureUrl = await Storage.get(key, { level: 'public' })
          } catch {
            pictureUrl = key
          }
        } catch (err) {
          setError('Failed to upload avatar. Please try again.')
          setSaving(false)
          return
        }
      }

      const addressCombined = [form.address, form.city, form.state, form.zip].filter(Boolean).join(', ')
      const attrs = {
        given_name: form.firstName || undefined,
        family_name: form.lastName || undefined,
        birthdate: form.birthdate || undefined,
        phone_number: form.phone || undefined,
        address: addressCombined || undefined,
        picture: pictureUrl || undefined,
      }
      // Remove undefined keys
      Object.keys(attrs).forEach((k) => attrs[k] === undefined && delete attrs[k])

      const { Auth, API } = await import('aws-amplify')
      await Auth.updateUserAttributes(user, attrs)

      // Upsert UserProfile via AppSync
      try {
        const sub = user?.attributes?.sub
        if (sub) {
          const profileInput = {
            id: sub,
            owner: sub,
            email: user?.attributes?.email || undefined,
            name: [form.firstName, form.lastName].filter(Boolean).join(' ') || undefined,
            birthdate: form.birthdate || undefined,
            city: form.city || undefined,
            state: form.state || undefined,
            country: form.country || undefined,
            pictureKey: pictureUrl || undefined,
          }
          Object.keys(profileInput).forEach((k) => profileInput[k] === undefined && delete profileInput[k])

          if (profileExists) {
            await API.graphql({ query: updateUserProfile, variables: { input: profileInput }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
          } else {
            await API.graphql({ query: createUserProfile, variables: { input: profileInput }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
            setProfileExists(true)
          }
        }
      } catch (gqlErr) {
        // If schema not pushed yet, proceed without failing UI
      }

      // Record activity (best-effort)
      try {
        const sub = user?.attributes?.sub
        if (sub) {
          const input = {
            owner: sub,
            event: 'UpdateSettings',
            metadata: JSON.stringify({ hasAvatar: Boolean(newAvatar || form.pictureUrl), city: form.city || undefined, state: form.state || undefined, country: form.country || undefined }),
            timestamp: new Date().toISOString(),
          }
          const { API } = await import('aws-amplify')
          await API.graphql({ query: createUserActivity, variables: { input }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
        }
        try {
          const { Analytics } = await import('aws-amplify')
          Analytics?.record?.({ name: 'UpdateSettings' })
        } catch {}
      } catch {}
      setSuccess('Profile updated successfully.')
      setNewAvatar(null)
    } catch (e) {
      setError('Failed to update profile. Check values and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Update your profile information and photo.</p>

        {loading ? (
          <p className="mt-6 text-gray-500">Loading…</p>
        ) : (
          <div className="mt-6 space-y-6">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}

            <section className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : form.pictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.pictureUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <input type="file" accept="image/*" onChange={onAvatarChange} className="mt-1 block text-sm" />
                <p className="text-xs text-gray-500 mt-1">Max {MAX_AVATAR_MB} MB.</p>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input name="firstName" value={form.firstName} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" name="birthdate" value={form.birthdate} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input name="phone" value={form.phone} onChange={onChange} placeholder="+11234567890" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </section>

            <section>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input name="address" value={form.address} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="city" value={form.city} onChange={onChange} placeholder="City" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                <input name="state" value={form.state} onChange={onChange} placeholder="State" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                <input name="zip" value={form.zip} onChange={onChange} placeholder="ZIP" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </section>

            <div className="flex justify-end">
              <button onClick={save} disabled={saving} className={`px-5 py-2 rounded-md text-white ${saving ? 'bg-blue-300 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
