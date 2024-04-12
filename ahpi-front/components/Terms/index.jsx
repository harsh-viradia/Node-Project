import React from "react"

const Terms = () => {
  return (
    <div className="container my-16">
      <div className="">
        <h2 className="text-center my-3 lg:my-5">Terms and Conditions</h2>
        <p className="mt-2">
          Please carefully read and understand the following Terms and Conditions (&lsquo;Terms&rsquo;) before using our
          services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree with
          any part of these Terms, you should refrain from using our services.
        </p>
      </div>
      <div className="gap-8 flex flex-col mt-12">
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/frame.svg" alt="" />
            <h3> Incorrect Account Number or Personal Details:</h3>
          </div>
          <div>
            <p>
              AHPI is not responsible for payments that do not reach the correct AHPI account due to inaccuracies in the
              provided account number or personal details. This means that if you make a payment and provide incorrect
              information, AHPI cannot be held liable for any resulting issues or losses.
            </p>
          </div>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/responsibility.svg" alt="" />
            <h3>Payment Refusal or Decline:</h3>
          </div>
          <p>
            If the payment is declined or refused by your credit or debit card supplier, AHPI is not obligated to inform
            you of this situation. It is your responsibility to verify with your bank or card supplier that the payment
            has been successfully processed. This condition emphasises the importance of ensuring that your payment
            method is valid and funded.
          </p>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/disclaimer.svg" alt="" />

            <h3>Limitation of Liability:</h3>
          </div>
          <p>
            AHPI states that it will not be held liable for any damages arising from the use or inability to use its
            website or any linked websites. This includes damages resulting from errors, omissions, or any issues
            related to the materials or information provided on these sites. This condition applies irrespective of the
            legal basis (warranty, contract, tort, etc.) and whether or not you were informed about the possibility of
            such damages.
          </p>
        </div>
        <div className="gap-3 flex flex-col ">
          <div className="flex gap-2">
            <img src="/images/noresponsibility.svg" alt="" />
            <h3>Responsibility for Downtime:</h3>
          </div>
          <p>
            AHPI explicitly states that they will not be responsible for any downtime that may occur. This means that if
            their website or services experience periods of unavailability or technical issues, they are not obligated
            to provide compensation or take responsibility for any inconveniences or losses incurred by users during
            these periods.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Terms
