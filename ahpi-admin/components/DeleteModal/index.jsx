/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Dialog, Transition } from "@headlessui/react"
import CloseIcon from "icons/closeIcon"
import React, { Fragment } from "react"
import Button from "widgets/button"
import OrbitLink from "widgets/orbitLink"

const DeleteModal = ({
  deleteModal,
  setDeleteModal,
  handleConfirmation,
  itemName = "",
  loading,
  setLoading = () => {},
}) => {
  const onClose = () => {
    setDeleteModal(false)
  }

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      handleConfirmation()
    }
  }

  return (
    <Transition.Root show={deleteModal} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[9999] overflow-y-auto" onClose={setDeleteModal}>
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-black/30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform shadow-xl bg-white sm:my-8 sm:align-middle sm:max-w-xl sm:w-full rounded-lg">
              <div className="p-6 pt-14 modal-body text-center">
                <OrbitLink onClick={onClose} onKeyPress={onKeyPress}>
                  <CloseIcon
                    className="absolute text-dark-gray hover:text-primary transition-all right-5 top-5 focus:outline-none"
                    size="24px"
                  />
                </OrbitLink>
                <p className="font-bold text-2xl leading-10">
                  Are you sure you want to delete?{" "}
                  {itemName && <span className="text-red block">&quot;{itemName}&quot;</span>}
                </p>
              </div>
              <div className="p-4 border-t border-light-gray flex items-center justify-end gap-3">
                <Button darkHoverKind="dark-gray" title="No" kind="dark-gray" hoverKind="white" onClick={onClose} />
                <Button
                  title="Yes"
                  kind="red"
                  hoverKind="white"
                  darkHoverKind="dark-red"
                  onClick={() => {
                    setLoading(true)
                    handleConfirmation()
                  }}
                  loading={loading}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default DeleteModal
