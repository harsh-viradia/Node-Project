/* eslint-disable prettier/prettier */
// eslint-disable-next-line simple-import-sort/imports
import React, { Fragment } from "react"

import { Dialog, Transition } from "@headlessui/react"
import CloseIcon from "icons/closeIcon"

const DrawerWrapper = ({ open, setOpen, title, children, modalFooter, width = "max-w-3xl", titleButton }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[9998] overflow-hidden" onClose={() => setOpen(false)}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-black/30 pointer-events-none" />
          </Transition.Child>
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className={`relative w-screen ${width}`}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      className="flex items-center justify-center w-8 h-8 transition bg-white rounded-full focus:outline-none hover:rotate-90"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close panel</span>
                      <CloseIcon />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
                  <div className="flex items-center justify-between h-16 px-5 bg-secondary">
                    <Dialog.Title className="text-xl font-medium">{title}</Dialog.Title>
                   <div> {titleButton}</div>
                  </div>
                  <div className="relative flex-1 px-6 py-6 overflow-auto">
                    {/* Replace with your content */}
                    {children}
                    {/* /End replace */}
                  </div>
                  {modalFooter && (
                    <div className="flex items-center justify-end gap-3 px-4 py-4 modal-footer bg-secondary">
                      {modalFooter}
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default DrawerWrapper
