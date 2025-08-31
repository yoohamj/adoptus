/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { Auth } from 'aws-amplify'
import Link from 'next/link'
import SignUpModal from './SignUpModal'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'

function SignIn({
    setUiState, onChange, signIn
}) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState('signIn') // 'signIn' | 'signUp' | 'confirm'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        if (params.get('verify') === '1') {
          setNotice('Account created. Please check your email for a verification code, then sign in.')
        }
      }
    } catch {}
  }, [])

  async function handleSignIn(e) {
    e?.preventDefault?.()
    setError(''); setNotice(''); setLoading(true)
    try {
      await Auth.signIn(email, password)
      try { setUiState && setUiState('signedIn') } catch {}
      router.push('/')
    } catch (err) {
      setError(err?.message || 'Failed to sign in.')
    } finally { setLoading(false) }
  }

  async function handleSignUp(e) {
    e?.preventDefault?.()
    setError(''); setNotice('')
    if (!email || !password) { setError('Email and password are required.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (confirmPassword && password !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await Auth.signUp({ username: email, password, attributes: { email } })
      setNotice('We sent a verification code to your email.')
      setMode('confirm')
    } catch (err) {
      setError(err?.message || 'Failed to create account.')
    } finally { setLoading(false) }
  }

  async function handleConfirm(e) {
    e?.preventDefault?.()
    setError(''); setNotice(''); setLoading(true)
    try {
      await Auth.confirmSignUp(email, code)
      await Auth.signIn(email, password)
      try { setUiState && setUiState('signedIn') } catch {}
      router.push('/')
    } catch (err) {
      setError(err?.message || 'Verification failed. Check the code and try again.')
    } finally { setLoading(false) }
  }

  const onSubmit = mode === 'signIn' ? handleSignIn : mode === 'signUp' ? handleSignUp : handleConfirm

  return (
    <body className="antialiased">
        <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
            <h1 className="text-4xl font-medium">{mode === 'signUp' ? 'Create your account' : mode === 'confirm' ? 'Verify your email' : 'Sign in or Create an Account'}</h1>
            <p className="text-gray-500">{mode === 'confirm' ? 'Enter the code we sent to your email.' : 'Welcome back to AdoptUs.'}</p>

            <div className="my-5">
                <button 
                onClick={() => Auth.federatedSignIn({ provider: "Google" })}
                className="w-full text-center py-3 my-3 border flex space-x-2 items-center justify-center border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 hover:text-gray-900 hover:shadow transition duration-150">
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-6 h-6" alt="" /> <span>Continue with Google</span>
                </button>
            </div>
            <div className="my-5">
                <button 
                onClick={() => Auth.federatedSignIn({ provider: "Facebook" })}
                className="w-full text-center py-3 my-3 border flex space-x-2 items-center justify-center border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 hover:text-gray-900 hover:shadow transition duration-150">
                    <img src="https://www.svgrepo.com/show/13651/facebook.svg" className="w-6 h-6" alt="" /> <span>Continue with Facebook</span>
                </button>
            </div>
            <form action="" className="my-10" onSubmit={onSubmit}>
                <div className="flex flex-col space-y-5">
                    {!!error && (<div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>)}
                    {!!notice && (<div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{notice}</div>)}
                    <label htmlFor="email">
                        <p className="font-medium text-gray-700 pb-2">Email address</p>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e)=>setEmail(e.target.value)}
                          className="w-full py-3 border border-gray-200 rounded-lg px-3 focus:outline-none focus:border-[#FF5A5F] hover:shadow"
                          placeholder="Enter email address"
                          autoComplete="email"
                          required
                        />
                    </label>
                    {mode !== 'confirm' && (
                      <label htmlFor="password">
                          <p className="font-medium text-gray-700 pb-2">Password</p>
                          <div className="relative">
                            <input
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e)=>setPassword(e.target.value)}
                              className="w-full py-3 border border-gray-200 rounded-lg px-3 pr-10 focus:outline-none focus:border-[#FF5A5F] hover:shadow"
                              placeholder="Enter your password"
                              autoComplete={mode==='signUp' ? 'new-password' : 'current-password'}
                              required
                            />
                            <button
                              type="button"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute inset-y-0 right-2 my-auto p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            >
                              {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                              ) : (
                                <EyeIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                      </label>
                    )}
                    {mode === 'signUp' && (
                      <label htmlFor="confirm-password">
                        <p className="font-medium text-gray-700 pb-2">Confirm password</p>
                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e)=>setConfirmPassword(e.target.value)}
                          className="w-full py-3 border border-gray-200 rounded-lg px-3 focus:outline-none focus:border-[#FF5A5F] hover:shadow"
                          placeholder="Re-enter your password"
                          autoComplete="new-password"
                          required
                        />
                      </label>
                    )}
                    {mode === 'confirm' && (
                      <label htmlFor="code">
                        <p className="font-medium text-gray-700 pb-2">Verification code</p>
                        <input
                          id="code"
                          name="code"
                          type="text"
                          value={code}
                          onChange={(e)=>setCode(e.target.value)}
                          className="w-full py-3 border border-gray-200 rounded-lg px-3 focus:outline-none focus:border-[#FF5A5F] hover:shadow"
                          placeholder="Enter the 6-digit code"
                          inputMode="numeric"
                          required
                        />
                      </label>
                    )}
                    <div className="flex flex-row justify-between">
                        <div>
                            <label htmlFor="remember" className="inline-flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" id="remember" className="w-4 h-4 border-gray-300 text-[#FF5A5F] focus:ring-[#FF5A5F]" />
                                <span className="text-gray-700">Remember me</span>
                            </label>
                        </div>
                        <div>
                            <Link href="#" className="font-medium text-[#FF5A5F] hover:text-[#ff7b80]">Forgot password?</Link>
                        </div>
                    </div>
                    <button disabled={loading} className="w-full py-3 font-medium text-white bg-[#FF5A5F] hover:bg-[#ff7b80] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg border border-[#FF5A5F] hover:shadow inline-flex space-x-2 items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>{mode === 'signIn' ? 'Sign in' : mode === 'signUp' ? 'Create account' : 'Verify email'}</span>
                    </button>
                    {mode === 'signIn' && (
                      <p className="text-center">New to AdoptUs?{' '}
                        <Link href="/signup" className="text-[#FF5A5F] hover:text-[#ff7b80] font-medium inline-flex space-x-1 items-center">
                          <span>Create an account</span>
                          <span><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></span>
                        </Link>
                      </p>
                    )}
                    {mode === 'signUp' && (
                      <p className="text-center">Already have an account?{' '}
                        <button type="button" onClick={()=>{ setMode('signIn'); setError(''); setNotice('') }} className="text-[#FF5A5F] hover:text-[#ff7b80] font-medium">
                          Sign in
                        </button>
                      </p>
                    )}
                    {mode === 'confirm' && (
                      <p className="text-center">Didn’t receive a code?{' '}
                        <button type="button" onClick={async()=>{ try { await Auth.resendSignUp(email); setNotice('Code resent. Check your email.') } catch(e){ setError(e?.message||'Failed to resend code.') } }} className="text-[#FF5A5F] hover:text-[#ff7b80] font-medium">
                          Resend
                        </button>
                      </p>
                    )}
                </div>
            </form>
        </div>
    </body>
  )
}

export default SignIn
