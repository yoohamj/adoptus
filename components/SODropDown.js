import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { GlobeAltIcon, Bars3Icon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useState, useEffect, Fragment } from "react";
import Link from 'next/link'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

function SODropDown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-block ">
            <Bars3Icon className="h-6 hidden sm:inline-block" />
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
                    <Link 
                        href="/profile" 
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm font-bold'
                        )}>
                        Sign In
                    </Link>
                    )}
                </Menu.Item>
            </div>
            <div className="py-1">
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            href="/help"
                            className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                            )}
                        >
                        Help
                        </Link>
                    )}
                </Menu.Item>
            </div>
        </Menu.Items>
        </Transition>
    </Menu>
  )
}

export default SODropDown
