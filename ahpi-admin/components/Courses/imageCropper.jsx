/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { Dialog, Transition } from "@headlessui/react"
import CloseIcon from "icons/closeIcon"
import React, { Fragment, useEffect, useState } from "react"
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop"
import Button from "widgets/button"
import OrbitLink from "widgets/orbitLink"

import canvasPreview from "./canvasPreview"

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

const ImageCropper = ({ width, ratio = 1, file, show, onClose }) => {
  const [visible, setVisible] = useState(false)
  const [croppedUrl, setCroppedUrl] = useState("")
  const [crop, setCrop] = useState({
    unit: "px",
    width: 300,
    height: 300,
    aspect: 1,
  })
  const imgReference = React.useRef(null)
  const previewCanvasReference = React.useRef(null)

  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState(1)

  const onImageLoad = (e) => {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  const makeClientCrop = async (cropData) => {
    setCroppedUrl(cropData)
    canvasPreview(imgReference.current, previewCanvasReference.current, cropData, scale, rotate)
  }

  useEffect(() => {
    setVisible(show)
  }, [show])

  useEffect(() => {
    setCrop({
      ...crop,
      aspect: ratio,
      width,
      height: width / ratio,
    })
  }, [ratio, width])

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setVisible}>
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
            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-black bg-opacity-75 backdrop-blur-sm" />
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
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="">
                <div className="relative flex items-center justify-between p-4 pb-4 border-b modal-header border-primary-border">
                  <span className="text-sm font-semibold">Confirmation</span>
                  <OrbitLink onClick={onClose}>
                    <CloseIcon className="absolute right-5 top-5 focus:outline-none" />
                  </OrbitLink>
                </div>
                <div className="p-4 modal-body">
                  <div className="mt-3 text-sm text-center">
                    {Boolean(file) && (
                      <ReactCrop src={file} crop={crop} aspect={1} onComplete={makeClientCrop} onChange={setCrop}>
                        <img
                          ref={imgReference}
                          alt="Crop me"
                          src={file}
                          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                          onLoad={onImageLoad}
                        />
                      </ReactCrop>
                    )}
                  </div>
                  {Boolean(croppedUrl) && (
                    <canvas
                      ref={previewCanvasReference}
                      style={{
                        border: "1px solid black",
                        objectFit: "contain",
                        width: croppedUrl.width,
                        height: croppedUrl.height,
                      }}
                    />
                  )}
                  <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-light-gray">
                    <Button title="No" kind="dark-gray" hoverKind="white" onClick={onClose} />
                    <Button title="Yes" onClick={onClose} />
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ImageCropper
