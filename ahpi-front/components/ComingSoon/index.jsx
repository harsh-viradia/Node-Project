import React from "react"
import Button from "widgets/button"
import Input from "widgets/input"

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto text-center p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ">
          <div className="text-left">
            <img src="/images/logo.png" height={42} width={63} alt="" loading="lazy" />
            <div className="relative flex flex-col gap-4 mt-6">
              <div className="block text-4xl sm:text-6xl font-extrabold text-slate-700 uppercase">
                Coming <span className=" text-primary">Soon!</span>
              </div>
              <p className="text-md sm:text-base font-medium text-slate-600">
                We&apos;re working hard to finish the development of this site. Sign up below to receive updates and to
                be notified when we launch!
              </p>
              <div className="grid grid-cols-10 items-start gap-4 mt-4 ">
                <div className="col-span-6 sm:col-span-7">
                  <Input placeholder="Enter your email address" />
                </div>
                <div className="col-span-4 sm:col-span-3">
                  <Button title="Notify Me" className="w-full h-11" />
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <img
              src="/images/comingsoon-side-bg.png"
              alt="ofa icon"
              className="mx-auto w-full h-auto max-w-[395px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
