import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createUserActivity } from '../graphql/mutations'

const StepIndicator = ({ step }) => {
  const steps = [
    { id: 1, label: 'Pet Info' },
    { id: 2, label: 'Owner Info' },
    { id: 3, label: 'Other' },
  ]
  return (
    <ol className="flex items-center w-full mb-6 text-sm text-gray-600">
      {steps.map((s, idx) => (
        <li key={s.id} className="flex-1 flex items-center">
          <div className={`flex items-center gap-2 ${step >= s.id ? 'text-blue-600' : ''}`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full border ${step >= s.id ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-500'}`}>{s.id}</span>
            <span className="hidden sm:block">{s.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 mx-2 h-px bg-gray-200" />
          )}
        </li>
      ))}
    </ol>
  )
}

export default function PetRegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1 - Pet
    petType: '',
    petName: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    color: '',
    vaccinated: false,
    spayedNeutered: false,
    microchipped: false,
    description: '',
    // Step 2 - Owner
    ownerFirstName: '',
    ownerLastName: '',
    ownerEmail: '',
    ownerPhone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    // Step 3 - Other
    specialNeeds: '',
    preferences: '',
    adoptionFee: '',
    availableDate: '',
    agreeToTerms: false,
  })
  const [photos, setPhotos] = useState([]) // File[]
  const [photoPreviews, setPhotoPreviews] = useState([]) // object URLs
  const [photoError, setPhotoError] = useState('')

  const MAX_PHOTO_MB = 5 // per photo
  const MAX_TOTAL_MB = 25 // all photos combined
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const canProceed = useMemo(() => {
    if (step === 1) {
      return formData.petType && formData.petName && photos.length > 0
    }
    if (step === 2) {
      return formData.ownerFirstName && formData.ownerEmail
    }
    if (step === 3) {
      return formData.agreeToTerms
    }
    return false
  }, [step, formData])

  const next = () => {
    if (!canProceed) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    setStep((s) => Math.min(3, s + 1))
  }
  const prev = () => setStep((s) => Math.max(1, s - 1))

  const onPhotosChange = (e) => {
    const selected = Array.from(e.target.files || [])
    let errorMsg = ''

    // Filter out files over per-file limit
    const withinPerFile = []
    const tooLarge = []
    for (const f of selected) {
      if (f.size <= MAX_PHOTO_MB * 1024 * 1024) withinPerFile.push(f)
      else tooLarge.push(f.name)
    }

    // Enforce total limit by accumulating until cap
    const accepted = []
    let total = 0
    for (const f of withinPerFile) {
      if (total + f.size <= MAX_TOTAL_MB * 1024 * 1024) {
        accepted.push(f)
        total += f.size
      } else {
        // ignore files beyond total cap
      }
    }

    if (tooLarge.length) {
      errorMsg = `Some files exceed ${MAX_PHOTO_MB} MB: ${tooLarge.join(', ')}`
    }
    const originallyAcceptedCount = withinPerFile.length
    if (!errorMsg && accepted.length < originallyAcceptedCount) {
      errorMsg = `Total photo size exceeds ${MAX_TOTAL_MB} MB. Some files were not added.`
    }

    setPhotoError(errorMsg)
    setPhotos(accepted)
    const urls = accepted.map((f) => URL.createObjectURL(f))
    setPhotoPreviews(urls)
  }

  const submit = async (e) => {
    e.preventDefault()
    // You can replace this with an API call later
    try {
      if (!canProceed) {
        setShowErrors(true)
        return
      }
      setSubmitting(true)
      if (photos.length === 0) {
        setPhotoError('At least one photo is required.')
        setSubmitting(false)
        setStep(1)
        return
      }
      // Validate sizes again before upload (defensive)
      const perFileTooBig = photos.filter((f) => f.size > MAX_PHOTO_MB * 1024 * 1024)
      const totalSize = photos.reduce((a, f) => a + f.size, 0)
      if (perFileTooBig.length || totalSize > MAX_TOTAL_MB * 1024 * 1024) {
        setPhotoError(`Please ensure files are under ${MAX_PHOTO_MB} MB each and ${MAX_TOTAL_MB} MB total.`)
        setSubmitting(false)
        return
      }

      // Try uploading photos to Amplify Storage if configured
      let photoKeys = []
      try {
        const { Storage } = await import('aws-amplify')
        const uploadResults = await Promise.all(
          photos.map((file) => {
            const key = `pets/${Date.now()}-${file.name}`
            return Storage.put(key, file, { level: 'public', contentType: file.type })
          })
        )
        photoKeys = uploadResults.map((r) => r.key || r)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Storage not configured or upload failed; proceeding without S3.', err)
      }

      const resp = await fetch('/api/register-pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, photoKeys }),
      })
      let created = null
      try {
        const json = await resp.json()
        created = json?.created || null
      } catch {}

      // eslint-disable-next-line no-console
      console.log('Pet registration submitted:', { formData, photoKeys })
      // Record activity (best-effort): AppSync + Pinpoint
      try {
        const { API, Analytics, Auth } = await import('aws-amplify')
        const user = await Auth.currentAuthenticatedUser().catch(() => null)
        const sub = user?.attributes?.sub
        if (sub) {
          const input = {
            owner: sub,
            event: 'RegisterPet',
            metadata: JSON.stringify({ petType: formData.petType, petName: formData.petName, createdId: created?.id || null }),
            timestamp: new Date().toISOString(),
          }
          await API.graphql({ query: createUserActivity, variables: { input }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
        }
        try { Analytics && Analytics.record && Analytics.record({ name: 'RegisterPet', attributes: { petType: String(formData.petType || '') } }) } catch {}
      } catch {}
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('lastPetRegistration', JSON.stringify({ formData, photoKeys }))
        }
      } catch {}
      router.push(`/register/confirmation?status=ok&petName=${encodeURIComponent(formData.petName || '')}`)
    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Register Your Pet</h1>
      <p className="text-gray-500 mb-4">Complete the 3-step form to list your pet.</p>

      <StepIndicator step={step} />

      {step === 1 && (
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Type</label>
            <select name="petType" value={formData.petType} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Select a type</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Small Animal</option>
              <option>Reptile</option>
              <option>Other</option>
            </select>
            {showErrors && !formData.petType && (
              <p className="mt-1 text-sm text-red-600">Pet type is required.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pet Name</label>
              <input name="petName" value={formData.petName} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Kaymak" />
              {showErrors && !formData.petName && (
                <p className="mt-1 text-sm text-red-600">Pet name is required.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Breed</label>
              <input name="breed" value={formData.breed} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Corgi" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input name="age" value={formData.age} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., 2 years" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select name="size" value={formData.size} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input name="color" value={formData.color} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-6 mt-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="vaccinated" checked={formData.vaccinated} onChange={onChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Vaccinated
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="spayedNeutered" checked={formData.spayedNeutered} onChange={onChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Spayed/Neutered
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="microchipped" checked={formData.microchipped} onChange={onChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Microchipped
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={onChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Tell us about your pet..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photos <span className="text-red-600">*</span></label>
            <input type="file" accept="image/*" multiple onChange={onPhotosChange} className="mt-1 block w-full text-sm text-gray-700" />
            <p className="mt-1 text-xs text-gray-500">Max {MAX_PHOTO_MB} MB per photo, {MAX_TOTAL_MB} MB total.</p>
            {(photoError || (showErrors && photos.length === 0)) && (
              <p className="mt-1 text-sm text-red-600">{photoError || 'At least one photo is required.'}</p>
            )}
            {photoPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {photoPreviews.map((src, i) => (
                  <img key={i} src={src} alt={`preview-${i}`} className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input name="ownerFirstName" value={formData.ownerFirstName} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              {showErrors && !formData.ownerFirstName && (
                <p className="mt-1 text-sm text-red-600">First name is required.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input name="ownerLastName" value={formData.ownerLastName} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="you@example.com" />
              {showErrors && !formData.ownerEmail && (
                <p className="mt-1 text-sm text-red-600">Email is required.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="ownerPhone" value={formData.ownerPhone} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="(555) 123-4567" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input name="address" value={formData.address} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input name="city" value={formData.city} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input name="state" value={formData.state} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP</label>
              <input name="zip" value={formData.zip} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Special Needs</label>
              <input name="specialNeeds" value={formData.specialNeeds} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., medication schedule" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferences</label>
              <input name="preferences" value={formData.preferences} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., good with kids" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Adoption Fee</label>
              <input name="adoptionFee" value={formData.adoptionFee} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="$" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Available Date</label>
              <input type="date" name="availableDate" value={formData.availableDate} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={onChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            I confirm the information is accurate.
          </label>
          {showErrors && !formData.agreeToTerms && (
            <p className="text-sm text-red-600">You must agree before submitting.</p>
          )}
        </section>
      )}

      <div className="sticky bottom-0 bg-white mt-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <button type="button" onClick={prev} disabled={step === 1} className={`px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}>
            Back
          </button>
          {step < 3 ? (
            <button type="button" onClick={next} className={`px-5 py-2 rounded-md text-white ${canProceed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              Next
            </button>
          ) : (
            <button type="submit" disabled={submitting} className={`px-5 py-2 rounded-md text-white ${submitting ? 'bg-green-300 cursor-wait' : 'bg-green-600 hover:bg-green-700'}`}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
