import { Dialog, Transition } from "@headlessui/react"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"
import { QUIZ_LOADER, QUIZ_SUBMIT_STATUS } from "utils/constant"
import Button from "widgets/button"

const MyConfirmPopover = ({
  loading,
  isOpen,
  close,
  onClickConfirm,
  questions,
  attemptedQuestions,
  status,
  showCancel,
}) => {
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
                  {showCancel ? (
                    <div className="font-bold text-lg mb-2"> {t("areYouSure")}</div>
                  ) : (
                    <div className="font-bold text-red text-lg mb-2 text-center"> {t("TimeOver")} !! </div>
                  )}
                  {showCancel ? (
                    status !== QUIZ_SUBMIT_STATUS.COMPLETED && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>{t("totalQuestion")}</div>
                        <div className="text-right">{questions?.length || 0}</div>
                        <div>{t("toatalQuestionAttempt")}</div>
                        <div className="text-right">{attemptedQuestions?.length || 0}</div>
                      </div>
                    )
                  ) : (
                    <div className="font-bold text-lg mb-2 text-center"> {t("quizSubmitted")} </div>
                  )}
                  <div className="flex gap-2">
                    {showCancel && (
                      <Button
                        className="w-full"
                        title={`${t("no")}`}
                        kind="dark-gray"
                        hoverKind="white"
                        darkHoverKind="dark-gray"
                        onClick={close}
                      />
                    )}
                    <Button
                      className="w-full"
                      kind="blue"
                      hoverKind="white"
                      title={showCancel ? t("yes") : t("close")}
                      onClick={() => {
                        if (showCancel) {
                          onClickConfirm()
                        } else close()
                      }}
                      loading={loading === QUIZ_LOADER.SUBMIT}
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

export default MyConfirmPopover
