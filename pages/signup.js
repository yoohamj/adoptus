import '../configureAmplify'
import Header from '../components/Header'
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function SignUpPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const req = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  const allReqs = req.length && req.upper && req.lower && req.number && req.special
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const canSubmit = !!(firstName && lastName && email && allReqs && passwordsMatch && acceptTerms && acceptPrivacy && !loading)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setNotice('')
    if (!acceptTerms || !acceptPrivacy) { setError('Please accept the Terms of Use and Privacy Policy.'); return }
    if (!firstName.trim() || !lastName.trim()) { setError('First and last name are required.'); return }
    if (!email.trim()) { setError('Email is required.'); return }
    if (!allReqs) { setError('Password does not meet requirements.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await Auth.signUp({ username: email, password, attributes: { email, name: `${firstName} ${lastName}`.trim(), given_name: firstName, family_name: lastName } })
      // Redirect to sign-in so user can verify and log in
      try { router.push('/profile?verify=1') } catch {}
      setNotice('Account created. We sent a verification code to your email. Please verify and then sign in.')
    } catch (err) {
      setError(err?.message || 'Failed to create account.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <Header />
      <main className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-semibold">Create your account</h1>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {!!error && (<div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2" role="alert">{error}</div>)}
          {!!notice && (<div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2" aria-live="polite">{notice}</div>)}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label htmlFor="firstName" className="block">
              <span className="font-medium text-gray-700">First name</span>
              <input id="firstName" name="firstName" type="text" className="mt-1 w-full py-3 border border-gray-200 rounded-lg px-3 focus:outline-none focus:border-[#FF5A5F] hover:shadow" placeholder="Emily" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
            </label>
            <label htmlFor="lastName" className="block">
              <span className="font-medium text-gray-700">Last name</span>
              <input id="lastName" name="lastName" type="text" className="mt-1 w-full py-3 border border-gray-200 rounded-lg px-3 focus:outline-none focus:border-[#FF5A5F] hover:shadow" placeholder="Johnson" value={lastName} onChange={(e)=>setLastName(e.target.value)} required />
            </label>
          </div>

          <label htmlFor="email" className="block">
            <span className="font-medium text-gray-700">Email address</span>
            <input id="email" name="email" type="email" className="mt-1 w-full py-3 border border-gray-200 rounded-lg px-3 focus:outline-none focus:border-[#FF5A5F] hover:shadow" placeholder="emily.johnson@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" required />
          </label>

          <label htmlFor="password" className="block">
            <span className="font-medium text-gray-700">New password</span>
            <div className="relative mt-1">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} className="w-full py-3 border border-gray-200 rounded-lg px-3 pr-10 focus:outline-none focus:border-[#FF5A5F] hover:shadow" placeholder="Enter a strong password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="new-password" required />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={()=>setShowPassword(v=>!v)} className="absolute inset-y-0 right-2 my-auto p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                {showPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
              </button>
            </div>
            <div className="mt-3 text-sm">
              <p className="font-medium text-gray-700">Password requirements</p>
              <ul className="mt-1 space-y-1">
                <li className={req.length ? 'text-green-700' : 'text-gray-500'}>
                  {req.length ? <CheckCircleIcon className="inline h-4 w-4 mr-1"/> : <XCircleIcon className="inline h-4 w-4 mr-1"/>}
                  At least 8 characters
                </li>
                <li className={req.upper ? 'text-green-700' : 'text-gray-500'}>
                  {req.upper ? <CheckCircleIcon className="inline h-4 w-4 mr-1"/> : <XCircleIcon className="inline h-4 w-4 mr-1"/>}
                  At least one uppercase letter (A-Z)
                </li>
                <li className={req.lower ? 'text-green-700' : 'text-gray-500'}>
                  {req.lower ? <CheckCircleIcon className="inline h-4 w-4 mr-1"/> : <XCircleIcon className="inline h-4 w-4 mr-1"/>}
                  At least one lowercase letter (a-z)
                </li>
                <li className={req.number ? 'text-green-700' : 'text-gray-500'}>
                  {req.number ? <CheckCircleIcon className="inline h-4 w-4 mr-1"/> : <XCircleIcon className="inline h-4 w-4 mr-1"/>}
                  At least one number (0-9)
                </li>
                <li className={req.special ? 'text-green-700' : 'text-gray-500'}>
                  {req.special ? <CheckCircleIcon className="inline h-4 w-4 mr-1"/> : <XCircleIcon className="inline h-4 w-4 mr-1"/>}
                  At least one special character (!@#$%)
                </li>
              </ul>
            </div>
          </label>

          <label htmlFor="confirmPassword" className="block">
            <span className="font-medium text-gray-700">Confirm password</span>
            <input id="confirmPassword" name="confirmPassword" type="password" className={`mt-1 w-full py-3 border rounded-lg px-3 focus:outline-none hover:shadow ${passwordsMatch || confirmPassword.length === 0 ? 'border-gray-200 focus:border-[#FF5A5F]' : 'border-red-300 focus:border-red-500'}`} placeholder="Re-enter your password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} autoComplete="new-password" required />
            {confirmPassword.length > 0 && (
              <p className={`mt-1 text-sm ${passwordsMatch ? 'text-green-700' : 'text-red-600'}`}>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</p>
            )}
          </label>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={acceptTerms} onChange={(e)=>setAcceptTerms(e.target.checked)} className="w-4 h-4 border-gray-300 text-[#FF5A5F] focus:ring-[#FF5A5F]" />
              <span className="text-sm text-gray-700">I agree to the <Link href="/terms" className="text-[#FF5A5F] hover:text-[#ff7b80] underline">AdoptUs Terms of Use</Link>.</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={acceptPrivacy} onChange={(e)=>setAcceptPrivacy(e.target.checked)} className="w-4 h-4 border-gray-300 text-[#FF5A5F] focus:ring-[#FF5A5F]" />
              <span className="text-sm text-gray-700">I have read the <Link href="/privacy" className="text-[#FF5A5F] hover:text-[#ff7b80] underline">Privacy Policy</Link>.</span>
            </label>
          </div>

          <button type="submit" disabled={!canSubmit} className="w-full py-3 font-medium text-white bg-[#FF5A5F] hover:bg-[#ff7b80] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg border border-[#FF5A5F] hover:shadow">
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-600">Already have an account? <Link href="/profile" className="text-[#FF5A5F] hover:text-[#ff7b80] font-medium">Sign in</Link></p>
        </form>
      </main>
    </div>
  )
}
