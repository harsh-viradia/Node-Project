import React from "react"

const AboutUs = () => {
  return (
    <>
      <div className=" lg:flex lg:py-16 lg:px-16 w-full lg:gap-20 container p-7 ">
        <div className="lg:w-1/2 ">
          <h1 className="text-3xl font-bold">ABOUT ASSOCIATION OF HEALTHCARE PROVIDERS (INDIA)</h1>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <p className="md:text-lg">
            The organization known as AHPI, or the &quot;not for profit&quot; organization, operates with the primary
            goal of advocating for its members and their ability to provide appropriate healthcare services to the
            broader community.
          </p>
        </div>
      </div>
      <div className="lg:mt-12 mt-7 lg:px-16 container p-7 ">
        <img src="/images/banner.png" alt="Banner" />
      </div>
      <div className=" bg-[#f5f5f5] mt-10">
        <div className="container md:flex">
          <div className="w-full md:w-[40%] lg:py-12 xl:px-12 gap-20 mt-8 lg:mt-0 items-center justify-center container">
            <div className="w-full text-left">
              <h1 className="text-xl  lg:text-2xl font-bold pb-3">OUR VISION</h1>
              <p className="leading-7 tracking-wide">
                The Association of Healthcare Providers (India)&apos;s vision is to have a healthy India, encompassing
                society, community and common man at the grass root.
              </p>
            </div>
          </div>

          <div className="w-full flex md:w-[60%]  lg:py-12 xl:px-12 gap-20 mt-8 lg:mt-0 items-center justify-center container pb-8">
            <div className="w-full text-left">
              <h1 className="font-bold text-xl lg:text-2xl pb-3 ">OUR MISSION</h1>
              <p className="leading-7">
                AHPI shall work with all stake holders in establishing a national system where, common man can avail
                assured universal access to basic health services. The Federation will facilitate its members and
                partnering bodies, in carrying out healthcare improvements to serve the community effectively and
                efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:px-16 mt-10 container p-7 ">
        <div className="lg:px-16">
          <h1 className="text-3xl font-bold">About AHPI</h1>
          <div className=" pt-9">
            <ul className="pl-8 space-y-3">
              <li className="list-disc">
                <strong>AHPI</strong>: It&apos;s important to note that AHPI operates as a &quot;not for profit&quot;
                organization, which means its primary objective is not to generate profits for its members but rather to
                fulfill a particular mission or purpose.
              </li>
              <li className="list-disc">
                <strong>Advocacy</strong> : AHPI engages in advocacy, which means it actively works to influence
                government policies, regulations, and decisions related to healthcare. This advocacy is directed toward
                various entities, including government bodies, regulatory agencies, and other stakeholders involved in
                healthcare.
              </li>
              <li className="list-disc">
                <strong>Members</strong> : AHPI&apos;s membership likely consists of healthcare organizations or
                entities that provide healthcare services. These members may include hospitals, clinics, healthcare
                providers, and related institutions. AHPI&apos;s primary focus is to support and represent the interests
                of these member organizations.
              </li>
              <li className="list-disc">
                <strong>Issues</strong> : AHPI addresses a range of healthcare-related issues. These issues may pertain
                to healthcare policy, regulation, funding, quality standards, and any other matters that can impact the
                ability of its member organizations to deliver healthcare services effectively.
              </li>
              <li className="list-disc">
                <strong>Community at Large</strong>: AHPI&apos;s ultimate aim is to ensure that its advocacy efforts
                result in improved healthcare services for the broader community. This means they are not just concerned
                with the interests of their member organizations but with the well-being and access to healthcare for
                the general public.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs
