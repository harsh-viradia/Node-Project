import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment } from "react"

const DevToolsPopup = ({ children, open = false }) => {
  return (
    <Transition as={Fragment} show={open}>
      <Dialog as="div" className="fixed inset-0 z-[99]" onClose={() => {}}>
        <div className="flex items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform shadow-xl bg-white sm:my-8 sm:align-middle sm:w-[50%] rounded-lg">
              <div className="modal-body text-center overflow-hidden m-8">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DevToolsPopup
