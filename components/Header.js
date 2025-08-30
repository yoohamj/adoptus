import '../configureAmplify'
import { Auth } from 'aws-amplify'

import Image from "next/image";
import Logo from "../images/logo.svg"
import SIDropDown from './SIDropDown'
import SODropDown from './SODropDown'


import { GlobeAltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'

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
    const router = useRouter();

    const search = () => {
        router.push({
            pathname: '/search',
            query: {
                location: searchInput,
            }
        })
    }

    function onChange(e) {
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }

    console.log({ uiState })

    return (
        <header className="sticky top-0 z-50 grid grid-cols-3 bg-white shadow-md p-5 md:px-10">
            {/* left */}
            <div onClick={() => router.push("/")} className="relative flex items-center h-10 cursor-pointer my-auto">
                <Image
                    src={Logo}
                    alt="AdoptUs"
                    fill
                    className="object-contain object-left"
                />
            </div>

            {/* Middle - Search*/}
            <div className="flex items-center md:border-2 rounded-full py-2 md:shadow-sm">
                <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="flex-grow pl-5 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
                    type="text"
                    placeholder= {"Enter location"}
                    autoComplete="false"
                />
                <MagnifyingGlassIcon onClick={search} className="hidden md:inline-flex h-8 bg-red-400 text-white rounded-full p-2 cursor-pointer md:mx-2" />
            </div>

            {/* Right */}
            <div className="flex items-center space-x-4 justify-end text-gray-500">
                <button
                    onClick={() => {
                        if (uiState === 'signedIn') {
                            router.push('/register')
                        } else {
                            alert('Please sign in to register a pet.')
                            router.push('/profile')
                        }
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                    Register a pet
                </button>
                <GlobeAltIcon className="h-6 cursor-pointer" />
                <div className="flex items-center space-x-2 border-2 p-2 rounded-full hover:shadow-xl active:scale-90 transition duration-150">
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
