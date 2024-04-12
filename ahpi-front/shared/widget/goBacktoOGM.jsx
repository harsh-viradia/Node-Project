/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Dialog, Transition } from "@headlessui/react"
import CloseIcon from "icons/closeIcon"
import getConfig from "next/config"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import Button from "widgets/button"
import OrbitLink from "widgets/orbitLink"

const { publicRuntimeConfig } = getConfig()
const goBackToOGM = () => window.open(`${publicRuntimeConfig.NEXT_PUBLIC_OGM_URL}/${router.locale}`, "_self")

const GoBackPopover = ({ progressData, isOpen, close, isFromOgm }) => {
  const [timer, setTimer] = useState()
  const { t } = useTranslation("common")
  const message = isFromOgm ? "redirectOGM" : "redirectOsc"
  useEffect(() => {
    const myInterval = setInterval(() => {
      if (timer > 1) {
        setTimer(timer - 1)
      } else if (timer === 1) {
        clearInterval(myInterval)
        if (isFromOgm) goBackToOGM()
        else window.open(`${progressData?.redirectUrl}/${router.locale}`, "_self")
      } else clearInterval(myInterval)
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  })
  useEffect(() => {
    if (!isOpen) setTimer()
  }, [isOpen])
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[9999] overflow-y-auto" onClose={close}>
        <div className="flex sm:items-end justify-center min-h-screen px-4 pt-4 sm:pb-20 text-center sm:block sm:p-0 items-center">
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
                <OrbitLink onClick={close}>
                  <CloseIcon
                    className="absolute text-dark-gray hover:text-primary transition-all right-5 top-5 focus:outline-none"
                    size="24px"
                  />
                </OrbitLink>
                <p className="font-bold text-2xl leading-10">{t(isFromOgm ? "goBackToOGM" : "goBackToOsc")}</p>
              </div>
              <div className="p-4 border-t border-light-gray flex items-center justify-center gap-3">
                <Button darkHoverKind="dark-gray" title={t("no")} kind="dark-gray" hoverKind="white" onClick={close} />
                <Button
                  title={timer ? t(message, { timer }) : t("yesProceed")}
                  loading={!!timer}
                  kind="primary"
                  hoverKind="white"
                  darkHoverKind="dark-primary"
                  onClick={() => setTimer(5)}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default GoBackPopover
