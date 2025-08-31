import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import Logo from '../images/logo.svg'

export default function AuthPromptModal({ open, onClose, onSignIn, action = 'continue', title, description }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12">
                    <Image src={Logo} alt="Adopt Us" fill className="object-contain" />
                  </div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">{title || `Sign in to ${action}`}</Dialog.Title>
                </div>
                {description !== '' && (
                  <div className="mt-3 text-sm text-gray-600">
                    {description || 'Create an account or sign in to continue.'}
                  </div>
                )}
                <div className="mt-5 flex items-center justify-end gap-3">
                  <button onClick={onClose} className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Not now</button>
                  <button onClick={onSignIn} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Sign in / Sign up</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
