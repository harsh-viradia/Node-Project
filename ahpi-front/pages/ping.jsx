import React from "react"

const PingMe = ({ message }) => {
  return <p>{message}</p>
}

export default PingMe
export const getServerSideProps = () => {
  return {
    props: {
      message: "Success!!",
    },
  }
}
