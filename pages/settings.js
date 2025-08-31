import '../configureAmplify'
import { getUserProfile } from '../graphql/queries'
import { createUserProfile, updateUserProfile, createUserActivity } from '../graphql/mutations'
import { useEffect, useRef, useState } from 'react'
import PhonePicker from '../components/PhonePicker'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'privacy'
  const [usernameStatus, setUsernameStatus] = useState({ valid: true, available: true, checking: false, message: '' })
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phoneCode: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    pictureUrl: '',
  })
  const [profileExists, setProfileExists] = useState(false)
  const [newAvatar, setNewAvatar] = useState(null) // File
  const fileInputRef = useRef(null)
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
          username: a.preferred_username || a.nickname || u.username || '',
          firstName: a.given_name || '',
          lastName: a.family_name || '',
          phoneCode: (() => { const m = (a.phone_number || '').match(/^\+(\d{1,3})(.*)$/); return m ? `+${m[1]}` : '+1' })(),
          phoneNumber: (() => { const m = (a.phone_number || '').match(/^\+\d{1,3}(.*)$/); return m ? (m[1] || '') : '' })(),
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
    if (name === 'username') {
      const lower = String(value || '').toLowerCase()
      const cleaned = lower.replace(/[^a-z0-9_]/g, '')
      setForm((f) => ({ ...f, [name]: cleaned }))
      setUsernameStatus((s) => ({ ...s, message: '', valid: true }))
      return
    }
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validateUsernameSyntax = (u) => /^[A-Za-z0-9_]{3,20}$/.test(u)

  const checkUsernameAvailability = async () => {
    const u = (form.username || '').trim()
    if (!u) return
    if (!validateUsernameSyntax(u)) {
      setUsernameStatus({ valid: false, available: false, checking: false, message: '3–20 chars, letters/numbers/underscore only.' })
      return
    }
    setUsernameStatus({ valid: true, available: true, checking: true, message: '' })
    try {
      const { API, Auth } = await import('aws-amplify')
      const me = await Auth.currentAuthenticatedUser().catch(() => null)
      const myId = me?.attributes?.sub
      const q = /* GraphQL */ `query UserProfilesByUsername($username: String!) { userProfilesByUsername(username: $username) { items { id username } } }`
      const res = await API.graphql({ query: q, variables: { username: u }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
      const items = res?.data?.userProfilesByUsername?.items || []
      const taken = items.some(it => it.id !== myId)
      setUsernameStatus({ valid: true, available: !taken, checking: false, message: taken ? 'This username is taken.' : 'Username is available.' })
    } catch (err) {
      // If index not pushed yet, optimistically allow
      setUsernameStatus({ valid: true, available: true, checking: false, message: '' })
    }
  }

  // Debounced availability check when typing
  useEffect(() => {
    const u = (form.username || '').trim()
    if (!u) return
    if (!validateUsernameSyntax(u)) return
    const t = setTimeout(() => { checkUsernameAvailability() }, 400)
    return () => clearTimeout(t)
  }, [form.username])

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
    // Username validation
    if (form.username) {
      if (!validateUsernameSyntax(form.username)) {
        setError('Username must be 3–20 characters and use only letters, numbers, or underscore.')
        return
      }
      if (!usernameStatus.available && !usernameStatus.checking) {
        setError('This username is already taken. Choose another.')
        return
      }
    }
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

      const addressCombined = [form.address, form.city, form.state, form.zip, form.country].filter(Boolean).join(', ')
      const combinedPhone = (() => {
        const cc = (form.phoneCode || '').trim() || '+1'
        const num = String(form.phoneNumber || '').replace(/\D/g, '')
        return num ? `${cc}${num}` : undefined
      })()
      const attrs = {
        preferred_username: form.username || undefined,
        given_name: form.firstName || undefined,
        family_name: form.lastName || undefined,
        phone_number: combinedPhone,
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
            username: form.username || undefined,
            email: user?.attributes?.email || undefined,
            name: [form.firstName, form.lastName].filter(Boolean).join(' ') || undefined,
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
        <p className="text-gray-600 mt-1">Manage your account preferences.</p>

        {loading ? (
          <p className="mt-6 text-gray-500">Loading…</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="md:sticky md:top-20 h-max">
              <nav className="space-y-1">
                <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-3 py-2 rounded-md ${activeTab==='profile' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}>Profile</button>

              </nav>
            </aside>

            {/* Content */}
            <div className="space-y-6">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}

            {activeTab === 'profile' && (
            <>
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
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="mt-1 inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Upload Photo
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="flex gap-2">
                  <input name="username" value={form.username} onChange={onChange} onBlur={checkUsernameAvailability} placeholder="e.g., catlover123" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  <button type="button" onClick={checkUsernameAvailability} className="mt-1 px-3 py-2 rounded-md border text-sm">Check</button>
                </div>
                {usernameStatus.message && (
                  <p className={`text-xs mt-1 ${usernameStatus.available ? 'text-green-600' : 'text-red-600'}`}>{usernameStatus.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">3–20 characters: letters, numbers, underscores.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input name="firstName" value={form.firstName} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <PhonePicker
                  code={form.phoneCode}
                  number={form.phoneNumber}
                  onChange={({ code, number }) => setForm(f => ({ ...f, phoneCode: code, phoneNumber: number }))}
                  className="mt-1"
                />
              </div>
            </section>

            <section>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input name="address" value={form.address} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              <div className="mt-3 space-y-3">
                {/* Row 2: City  State/Province  ZIP/Postal */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input name="city" value={form.city} onChange={onChange} placeholder="City" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  {form.country === "CA" ? (
                    <select name="state" value={form.state} onChange={onChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Province</option>
                      <option>AB</option><option>BC</option><option>MB</option><option>NB</option><option>NL</option><option>NS</option><option>NT</option><option>NU</option><option>ON</option><option>PE</option><option>QC</option><option>SK</option><option>YT</option>
                    </select>
                  ) : form.country === "US" ? (
                    <select name="state" value={form.state} onChange={onChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">State</option>
                      <option>AL</option><option>AK</option><option>AZ</option><option>AR</option><option>CA</option><option>CO</option><option>CT</option><option>DE</option><option>FL</option><option>GA</option><option>HI</option><option>IA</option><option>ID</option><option>IL</option><option>IN</option><option>KS</option><option>KY</option><option>LA</option><option>MA</option><option>MD</option><option>ME</option><option>MI</option><option>MN</option><option>MO</option><option>MS</option><option>MT</option><option>NC</option><option>ND</option><option>NE</option><option>NH</option><option>NJ</option><option>NM</option><option>NV</option><option>NY</option><option>OH</option><option>OK</option><option>OR</option><option>PA</option><option>RI</option><option>SC</option><option>SD</option><option>TN</option><option>TX</option><option>UT</option><option>VA</option><option>VT</option><option>WA</option><option>WI</option><option>WV</option><option>WY</option>
                    </select>
                  ) : (
                    <input name="state" value={form.state} onChange={onChange} placeholder="State/Province" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  )}
                  <input name="zip" value={form.zip} onChange={onChange} placeholder={form.country === "CA" ? "Postal Code" : form.country === "US" ? "ZIP Code" : "Postal/ZIP"} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                {/* Row 3: Country */}
                <div>
                  <select name="country" value={form.country} onChange={onChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={save}
                disabled={saving}
                className={`px-5 py-2 rounded-md border ${saving ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait' : 'bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-300'}`}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
            </>
            )}

            
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
