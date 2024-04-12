/* eslint-disable no-underscore-dangle */
import SimpleCrypto from "simple-crypto-js"

const _secretKey = "orbitassessmentadmin"

export const Crypto = new SimpleCrypto(_secretKey)

const LocalStorage = {
  get: (key) => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key)
    }

    return false
  },

  getID: (key) => {
    if (typeof localStorage !== "undefined") {
      const item = localStorage.getItem(key)
      return item || "No item found"
    }
    return false
  },

  getJSON: (key) => {
    if (typeof localStorage !== "undefined") {
      const data = LocalStorage.get(key)

      return data && data !== "undefined" ? JSON.parse(data) : ""
    }

    return false
  },

  set: (...rest) => {
    if (typeof localStorage !== "undefined") {
      return localStorage.setItem(...rest)
    }

    return false
  },

  setJSON: (key, value) => {
    if (typeof localStorage !== "undefined") {
      const data = JSON.stringify(value)

      return LocalStorage.set(key, data)
    }

    return false
  },

  setToken: (token) => {
    return LocalStorage.set("token", token)
  },

  setUser: (user) => {
    LocalStorage.set("user", JSON.stringify(user))
  },

  remove: (key) => {
    if (typeof localStorage !== "undefined") {
      return localStorage.removeItem(key)
    }

    return false
  },

  clean: (key) => {
    if (typeof localStorage !== "undefined") {
      return localStorage.clear(key)
    }

    return false
  },
}

export const encryptData = (data) => Crypto.encrypt(JSON.stringify(data))

export const decryptData = (data) => data && Crypto.decrypt(data)

const getToken = () => LocalStorage.get("token")

export { getToken, LocalStorage }
