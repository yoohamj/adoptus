import Image from "next/image";
import Logo from "../images/logo.svg"

import { GlobeAltIcon, Bars3Icon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Menu, Transition } from '@headlessui/react'

import { useRouter } from "next/dist/client/router";
import { useState, Fragment } from "react";

import { Amplify, Auth, Hub } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsConfig from '../aws-exports' 

Amplify.configure({ ...awsConfig, ssr: true });

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

function Header() {
    async function checkuser() {
        const user = await Auth.currentAuthenticatedUser()
        console.log('user: ', user)
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
                <p className="hidden md:inline cursor-pointer">Become a host</p>
                <GlobeAltIcon className="h-6 cursor-pointer" />
                <div className="flex items-center space-x-2 border-2 p-2 rounded-full hover:shadow-xl active:scale-90 transition duration-150">
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="inline-block ">
                            <Bars3Icon className="h-6 inline-block" />
                            <UserCircleIcon className="h-6 inline-block" />
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                    {({ active }) => (
                                        <a
                                        href="/profile"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm font-bold'
                                        )}
                                        >
                                        Sign Up
                                        </a>
                                    )}
                                    </Menu.Item>
                                    <Menu.Item>
                                    {({ active }) => (
                                        <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                        >
                                        Log In
                                        </a>
                                    )}
                                    </Menu.Item>
                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                    {({ active }) => (
                                        <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                        >
                                        Setting
                                        </a>
                                    )}
                                    </Menu.Item>
                                    <Menu.Item>
                                    {({ active }) => (
                                        <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                        >
                                        Help
                                        </a>
                                    )}
                                    </Menu.Item>
                                </div>
                                </Menu.Items>
                            </Transition>
                         </Menu>
                </div>
            </div>

        </header>
    )
}

export default Header