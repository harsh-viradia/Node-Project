/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable jsx-a11y/media-has-caption */

// import useTranslation from "next-translate/useTranslation"
import React from "react"
// import OrbitLink from "widgets/orbitLink"

const PrivacyPolicy = () => {
  return (
    <div className="container my-16">
      <div className="">
        <h1 className="text-center my-3 lg:my-5">Privacy Policy</h1>
        <p>
          We are committed to protecting your privacy and the confidentiality of your information. This Privacy Policy
          outlines our practices regarding collecting and using your data. By using our services, you consent to the
          practices described herein..
        </p>
      </div>
      <div className="gap-8 flex flex-col mt-12">
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/detail.svg" alt="" />
            <h3>Purpose of the Details :</h3>
          </div>
          <div>
            <p>
              The primary purpose for which the details are collected and used is specified as &quot;receiving payments
              made to AHPI.&quot; This suggests that these details may include personal, financial, or
              transaction-related information required to facilitate payments or financial transactions involving AHPI.
            </p>
          </div>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/confi.svg" alt="" />
            <h3>Confidentiality: </h3>
          </div>
          <div className="section-text">
            Any and all information collected for the purpose of receiving payments will be treated with the utmost
            privacy and security. This includes protecting the details from unauthorized access, disclosure, or use.
          </div>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/nondisclosure.svg" alt="" />
            <h3>Non-Disclosure:</h3>
          </div>
          <div className="section-text">
            The information will not be shared with third parties, individuals not involved in the payment process, or
            any unauthorized personnel. This commitment to non-disclosure underscores the importance of maintaining the
            privacy and security of the provided details.
          </div>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/limiteduse.svg" alt="" />
            <h3>Limited Use:</h3>
          </div>
          <div className="section-text">
            The collected details will only be used for the specified purpose, which is receiving payments made to AHPI.
            This signifies that AHPI will not employ the information for any other purposes such as marketing, research
            or any unrelated activities.
          </div>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/legal.svg" alt="" />
            <h3>Legal and Ethical Compliance: </h3>
          </div>
          <div className="section-text">
            The statement aligns with legal and ethical standards governing the handling of personal and financial data.
            This is important to ensure that AHPI operates in accordance with applicable data protection and privacy
            laws and regulations.
          </div>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/protect.svg" alt="" />
            <h3>Data Protection:</h3>
          </div>
          <div className="section-text">
            It is implied that appropriate measures will be taken to safeguard the data against breaches, theft, or
            unauthorized access. This may include encryption, secure storage, access controls, and regular security
            audits.
          </div>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/user.svg" alt="" />
            <h3>User Consent:</h3>
          </div>
          <div className="section-text">
            The individuals or entities providing their details for payment purposes do so with informed consent.
            Consent implies that they are aware of how their data will be used and have agreed to these terms.
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
