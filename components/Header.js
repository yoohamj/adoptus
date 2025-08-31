import '../configureAmplify'
import { Auth } from 'aws-amplify'

import Image from "next/image";
import Logo from "../images/logo.svg"
import SIDropDown from './SIDropDown'
import SODropDown from './SODropDown'


import { GlobeAltIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/solid'

import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";

function Header() {
    const [uiState, setUiState] = useState(null)
    
    const [formState, setFormState] = useState({
        email: '', password: '', authcode: ''
    })
    const { email, password, authcode } = formState

    const [user, setUser] = useState(null)

    useEffect(() => {
        checkUser()
        async function checkUser() {
            try {
                const user = await Auth.currentAuthenticatedUser()
                setUser(user)
                setUiState('signedIn')
            } catch(err) {
                setUiState('signedOut')
            }
        }
    }, [])
      function onChange(e) {
        setFormState({ ...formState, [e.target.name]: e.target.value })
      }
      async function signUp() {
        try {
          await Auth.signUp({ username: email, password, attributes: { email }})
          setUiState('confirmSignUp')
        } catch (err) { console.log({ err })}
      }
      async function confirmSignUp() {
        try {
          await await Auth.confirmSignUp(email, authCode)
          await Auth.signIn(email, password)
          setUiState('signedIn')
        } catch (err) { console.log({ err })}
    
      }
      async function signIn() {
        try {
          await Auth.signIn(email, password)
          setUiState('signedIn')
        } catch (err) { console.log({ err })}
      }
      async function forgotPassword() {
        try {
          await Auth.forgotPassword(email)
          setUiState('forgotPasswordSubmit')
        } catch (err) { console.log({ err}) }
      }
      async function forgotPasswordSubmit() {
        await Auth.forgotPasswordSubmit(email, authCode, password)
        setUiState('signIn')
      }

    const [searchInput, setSearchInput] = useState("");
    const [openSuggest, setOpenSuggest] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const CITY_SUGGESTIONS = [
        'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Ottawa, ON',
        'Edmonton, AB', 'Winnipeg, MB', 'Quebec City, QC', 'Hamilton, ON', 'Mississauga, ON',
        'Brampton, ON', 'Kitchener, ON', 'Halifax, NS', 'London, ON', 'Saskatoon, SK'
    ]
    const router = useRouter();

    const search = () => {
        router.push({
            pathname: '/search',
            query: {
                location: searchInput,
            }
        })
    }

    const filteredSuggestions = (() => {
        const q = (searchInput || '').trim().toLowerCase()
        let base = CITY_SUGGESTIONS.filter(c => c.toLowerCase().includes(q)).slice(0, 6)
        // Add geo option at the top
        base = [{ __geo: true, label: 'Use my current location' }, ...base]
        return base
    })()

    const selectSuggestion = (item) => {
        if (item && item.__geo) {
            if (typeof navigator !== 'undefined' && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords || {}
                        router.push({ pathname: '/search', query: { lat: latitude?.toFixed(6), lng: longitude?.toFixed(6), location: 'Nearby' } })
                    },
                    () => {
                        router.push({ pathname: '/search', query: { location: 'Nearby' } })
                    },
                    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
                )
            } else {
                router.push({ pathname: '/search', query: { location: 'Nearby' } })
            }
            setOpenSuggest(false)
            return
        }
        const value = typeof item === 'string' ? item : (item?.label || '')
        setSearchInput(value)
        setOpenSuggest(false)
        router.push({ pathname: '/search', query: { location: value } })
    }

    function onChange(e) {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    return (
        <header className="sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-4 bg-white shadow-md p-5 md:px-10">
            {/* left */}
            <div onClick={() => router.push("/")} className="relative flex items-center h-10 w-28 md:w-32 cursor-pointer my-auto">
                <Image
                    src={Logo}
                    alt="AdoptUs"
                    fill
                    className="object-contain object-left"
                />
            </div>
            {/* Discussions removed as requested */}

            {/* Middle - Search*/}
            <div className="relative justify-self-center w-full max-w-xl md:max-w-2xl">
                <div className="flex items-center border-2 rounded-full py-2 shadow-sm">
                    <input
                        value={searchInput}
                        onChange={(e) => { setSearchInput(e.target.value); setOpenSuggest(true); setActiveIndex(-1); }}
                        onFocus={() => setOpenSuggest(true)}
                        onBlur={() => setTimeout(() => setOpenSuggest(false), 150)}
                        onKeyDown={(e) => {
                            if (!openSuggest) return
                            if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filteredSuggestions.length - 1)) }
                            else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
                            else if (e.key === 'Enter') { e.preventDefault(); const item = filteredSuggestions[Math.max(activeIndex, 0)]; selectSuggestion(item) }
                        }}
                        className="flex-grow pl-5 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
                        type="text"
                        placeholder= {"Enter location"}
                        autoComplete="off"
                    />
                    <MagnifyingGlassIcon onClick={search} className="hidden md:inline-flex h-8 bg-red-400 text-white rounded-full p-2 cursor-pointer md:mx-2" />
                </div>
                {openSuggest && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow">
                        {filteredSuggestions.map((s, idx) => (
                            <button
                                key={typeof s === 'string' ? s : s.label}
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s) }}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${idx===activeIndex ? 'bg-gray-100' : ''}`}
                            >
                                {s.__geo ? <MapPinIcon className="h-4 w-4 text-gray-500" /> : <span className="h-1 w-1 rounded-full bg-gray-400 inline-block" />}
                                <span>{typeof s === 'string' ? s : s.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right */}
            <div className="flex items-center justify-end text-gray-500 space-x-2 md:space-x-4">
                <button
                    onClick={() => router.push('/discussions')}
                    className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                    Community
                </button>
                <div className="flex items-center space-x-2 border p-1 md:border-2 md:p-2 rounded-full hover:shadow-xl active:scale-90 transition duration-150">
                    {
                        uiState === 'signedOut' && (
                            <SODropDown 
                                onChange={onChange}
                                setUiState={setUiState}
                            />
                        )
                    }
                    {
                        uiState === 'signedIn' && (
                            <SIDropDown 
                                setUiState={setUiState}
                                onChange={onChange}
                            />
                        )
                    }
                </div>
            </div>

        </header>
    )
}

export default Header
