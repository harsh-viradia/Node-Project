/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prettier/prettier */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react"

import ArrowUp from "../icons/arrowUp"

const ScrollUp = () => {
   const [isVisible, setIsVisible] = useState(false)
   // eslint-disable-next-line unicorn/consistent-function-scoping
   const goToBtn = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
   }

   const listenToScroll = () => {
      const heightToHidden = 250;
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

      if(winScroll > heightToHidden){
         setIsVisible(true)
      } else {
         setIsVisible(false)
      }
   }

   useEffect(() => {
      window.addEventListener("scroll", listenToScroll)
      return () => window.removeEventListener("scroll", listenToScroll);
   }, [])
   
   return (
      <div className="scroll-up">
         {isVisible && <div className="top-btn" onClick={goToBtn}>
            <ArrowUp />
         </div>}
      </div>
   );
};


export default ScrollUp;