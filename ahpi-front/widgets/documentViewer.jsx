import { Dialog, Transition } from "@headlessui/react"
import CloseIcon from "icons/closeIcon"
import React, { Fragment } from "react"
import OrbitLink from "widgets/orbitLink"

const DocumentViewer = ({ show, url = "", name = "", close = () => {} }) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[99]" onClose={close}>
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
            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-black bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          {/* <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform shadow-xl bg-white sm:my-8 sm:align-middle sm:w-[60%] rounded-lg">
              <div className="p-6 pt-14 modal-body text-center" style={{ height: `calc(100vh - 65px)` }}>
                <OrbitLink onClick={close}>
                  <CloseIcon
                    className="absolute text-dark-gray hover:text-primary transition-all right-5 top-5 focus:outline-none"
                    size="20px"
                  />
                </OrbitLink>
                {url.split(".").pop() === "doc" || url.split(".").pop() === "docx" ? (
                  <iframe
                    className="w-full modal-view"
                    title={name}
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}#toolbar=0`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                  />
                ) : (
                  <iframe controlsList="nodownload" title={name} src={`${url}#toolbar=0`} width="100%" height="100%" />
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default DocumentViewer
