import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Confirmation() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = sessionStorage.getItem('lastPetRegistration')
        if (raw) setData(JSON.parse(raw))
      }
    } catch {}
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!data?.photoKeys?.length) return
      try {
        const { Storage } = await import('aws-amplify')
        const urls = await Promise.all(
          data.photoKeys.map((key) => Storage.get(key, { level: 'public' }))
        )
        setImageUrls(urls)
      } catch {
        setImageUrls([])
      }
    }
    load()
  }, [data])

  const petName = router.query.petName || data?.formData?.petName || 'Your Pet'

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">Thanks, {petName} is submitted!</h1>
        <p className="text-gray-600 mt-2">We received your registration. You can review the details below.</p>

        {imageUrls?.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {imageUrls.map((src, i) => (
              <img key={i} src={src} alt={`photo-${i}`} className="w-full h-32 object-cover rounded" />
            ))}
          </div>
        )}

        {data?.formData && (
          <div className="mt-6 border rounded-md p-4">
            <h2 className="text-lg font-medium text-gray-800">Summary</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div><span className="font-semibold">Type:</span> {data.formData.petType || '-'}</div>
              <div><span className="font-semibold">Breed:</span> {data.formData.breed || '-'}</div>
              <div><span className="font-semibold">Age:</span> {data.formData.age || '-'}</div>
              <div><span className="font-semibold">Gender:</span> {data.formData.gender || '-'}</div>
              <div><span className="font-semibold">Size:</span> {data.formData.size || '-'}</div>
              <div><span className="font-semibold">Color:</span> {data.formData.color || '-'}</div>
              <div className="sm:col-span-2"><span className="font-semibold">Description:</span> {data.formData.description || '-'}</div>
              <div className="sm:col-span-2"><span className="font-semibold">Owner:</span> {data.formData.ownerFirstName || ''} {data.formData.ownerLastName || ''}</div>
              <div><span className="font-semibold">Email:</span> {data.formData.ownerEmail || '-'}</div>
              <div><span className="font-semibold">Phone:</span> {data.formData.ownerPhone || '-'}</div>
              <div className="sm:col-span-2"><span className="font-semibold">Address:</span> {data.formData.address || '-'} {data.formData.city || ''} {data.formData.state || ''} {data.formData.zip || ''}</div>
              <div><span className="font-semibold">Special Needs:</span> {data.formData.specialNeeds || '-'}</div>
              <div><span className="font-semibold">Preferences:</span> {data.formData.preferences || '-'}</div>
              <div><span className="font-semibold">Adoption Fee:</span> {data.formData.adoptionFee || '-'}</div>
              <div><span className="font-semibold">Available:</span> {data.formData.availableDate || '-'}</div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button onClick={() => router.push('/')} className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Go Home</button>
          <button onClick={() => router.push('/register')} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Register Another</button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
