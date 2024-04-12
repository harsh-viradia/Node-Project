import { Dialog, Transition } from "@headlessui/react"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"
import Button from "widgets/button"

const QuizResetPopover = ({ isOpen, close, passingScore, learnerMarks }) => {
  const { t } = useTranslation("common")
  return (
    <Transition as={Fragment} show={isOpen}>
      <Dialog as="div" className="fixed inset-0 z-[999]" onClose={close}>
        <Transition.Child
          unmount
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              unmount
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                as={Fragment}
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <div className="grid grid-cols-1 gap-1.5">
                  <div className="font-bold text-lg mb-2"> You have failed the test, Please start again! </div>
                  <p>Passing Score: {passingScore}</p>
                  <p>Your marks: {learnerMarks}</p>
                  <div className="flex gap-2">
                    <Button
                      className="w-full text-black"
                      kind="blue"
                      hoverKind="white"
                      title={t("close")}
                      onClick={close}
                      //   loading={loading === QUIZ_LOADER.SUBMIT}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default QuizResetPopover
