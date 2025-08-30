import '../../configureAmplify'
import { useEffect, useState } from 'react'
import { Auth, API } from 'aws-amplify'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { listUserProfiles } from '../../graphql/queries'

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    const init = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        const groups = user?.signInUserSession?.idToken?.payload?.['cognito:groups'] || []
        if (!groups.includes('admin')) {
          setError('You must be an admin to view this page.')
          setAuthorized(false)
          return
        }
        setAuthorized(true)
        // Fetch first page of profiles as a simple count and sample
        try {
          const result = await API.graphql({ query: listUserProfiles, variables: { limit: 100 }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
          const items = result?.data?.listUserProfiles?.items || []
          setProfiles(items)
        } catch (e) {
          setError('GraphQL API not ready. Push your schema to enable admin dashboard.')
        }
      } catch {
        setError('Please sign in as an admin to continue.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const total = profiles.length
  const byState = profiles.reduce((acc, p) => { const s = p.state || 'Unknown'; acc[s] = (acc[s] || 0) + 1; return acc }, {})

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        {loading ? (
          <p className="mt-6 text-gray-500">Loading…</p>
        ) : !authorized ? (
          <p className="mt-6 text-red-600">{error}</p>
        ) : (
          <div className="mt-6 space-y-6">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border rounded-md p-4">
                <div className="text-gray-500 text-sm">Total Users (sample)</div>
                <div className="text-2xl font-semibold">{total}</div>
              </div>
              <div className="border rounded-md p-4 sm:col-span-2">
                <div className="text-gray-500 text-sm mb-2">Users by State (sample)</div>
                <ul className="text-sm text-gray-700 grid grid-cols-2 gap-y-1">
                  {Object.entries(byState).map(([k, v]) => (
                    <li key={k}>{k}: {v}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="border rounded-md p-4">
              <div className="text-gray-500 text-sm mb-2">Recent Profiles (first 10)</div>
              <ul className="text-sm text-gray-700 divide-y">
                {profiles.slice(0, 10).map((p) => (
                  <li key={p.id} className="py-2 flex justify-between">
                    <span>{p.email || p.id}</span>
                    <span className="text-gray-500">{p.city || '-'}, {p.state || '-'}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

