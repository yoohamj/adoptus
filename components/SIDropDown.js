import '../configureAmplify'
import { Auth, Hub } from 'aws-amplify'

import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useState, useEffect, Fragment } from "react";
import Link from 'next/link'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

function SIDropDown({ setUiState }) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  async function loadUser() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      const fromAttributes = user?.attributes?.picture
      const fromToken = user?.signInUserSession?.idToken?.payload?.picture
      setPhotoUrl(fromAttributes || fromToken || null)
      const groups = user?.signInUserSession?.idToken?.payload?.['cognito:groups'] || []
      setIsAdmin(Array.isArray(groups) && groups.includes('admin'))
      // Ensure a default unique username on first federated sign-in
      try { await ensureDefaultUsername(user) } catch {}
    } catch (e) {
      setPhotoUrl(null)
      setIsAdmin(false)
    }
  }

  async function ensureDefaultUsername(user) {
    const attrs = user?.attributes || {}
    if (attrs.preferred_username) return
    const sub = attrs.sub
    let base = `user${(sub || '').slice(-6) || Math.random().toString(36).slice(2,8)}`.toLowerCase()
    base = base.replace(/[^a-z0-9_]/g, '')
    let candidate = base
    const { API } = await import('aws-amplify')
    const byUsername = /* GraphQL */ `query UserProfilesByUsername($username: String!) { userProfilesByUsername(username: $username) { items { id username } } }`
    const exists = async (u) => {
      try {
        const res = await API.graphql({ query: byUsername, variables: { username: u }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
        const items = res?.data?.userProfilesByUsername?.items || []
        return items.length > 0
      } catch { return false }
    }
    for (let i=0;i<5;i++) {
      if (!(await exists(candidate))) break
      candidate = `${base}${Math.random().toString(36).slice(2,3)}`
    }
    try { await Auth.updateUserAttributes(user, { preferred_username: candidate }) } catch {}
    // Upsert UserProfile.username
    try {
      const subId = attrs.sub
      if (subId) {
        const update = /* GraphQL */ `mutation UpdateUserProfile($input: UpdateUserProfileInput!) { updateUserProfile(input:$input){ id } }`
        const create = /* GraphQL */ `mutation CreateUserProfile($input: CreateUserProfileInput!) { createUserProfile(input:$input){ id } }`
        try { await API.graphql({ query: update, variables: { input: { id: subId, owner: subId, username: candidate } }, authMode: 'AMAZON_COGNITO_USER_POOLS' }) }
        catch { await API.graphql({ query: create, variables: { input: { id: subId, owner: subId, username: candidate } }, authMode: 'AMAZON_COGNITO_USER_POOLS' }) }
      }
    } catch {}
  }

  useEffect(() => {
    loadUser()
    const unsub = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signIn' || payload.event === 'tokenRefresh') {
        loadUser()
      }
      if (payload.event === 'signOut') {
        setPhotoUrl(null)
      }
    })
    return () => { unsub() }
  }, [])

  return (
    <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-block ">
            <Bars3Icon className="h-6 inline-block" />
            {photoUrl ? (
              <span className="inline-block h-6 w-6 align-middle">
                {/* Use native img to avoid Next Image domain restrictions for user-uploaded URLs */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Profile" className="rounded-full w-6 h-6 object-cover" />
              </span>
            ) : (
              <UserCircleIcon className="h-6 inline-block" />
            )}
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
                        href="/messages" 
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm font-bold'
                        )}>
                        Messages
                    </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            href="/favorites"
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm font-bold'
                                )}
                         >
                            Favorites
                        </Link>
                        )}
                </Menu.Item>
            </div>
            <div className="py-1">
                <Menu.Item>
                {({ active }) => (
                    <Link 
                        href="/messages" 
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm '
                        )}>
                        Manage Listings
                    </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            href="/register"
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm '
                                )}
                         >
                            Register Your Pet
                        </Link>
                        )}
                </Menu.Item>
            </div>
            <div className="py-1">
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            href="/settings"
                            className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                        )}
                        >
                            Settings
                        </Link>
                        )}
                </Menu.Item>
                {isAdmin && (
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/admin/dashboard"
                        className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block px-4 py-2 text-sm'
                                    )}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                    {({ active }) => (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await Auth.signOut()
                            } finally {
                              setUiState('signedOut')
                            }
                          }}
                          className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block w-full text-left px-4 py-2 text-sm'
                          )}
                        >
                          Sign Out
                        </button>
                    )}
                </Menu.Item>
                </div>
            </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default SIDropDown
