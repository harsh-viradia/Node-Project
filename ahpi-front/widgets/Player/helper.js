/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
import Axios from "axios"

// eslint-disable-next-line consistent-return
export async function uploadparts(file, urls, FILE_CHUNK_SIZE = 5_242_880) {
  try {
    const axios = Axios.create()
    delete axios.defaults.headers.put["Content-Type"]
    const keys = Object.keys(urls)
    const promises = []
    for (const indexString of keys) {
      const index = Number.parseInt(indexString, 10)
      const start = index * FILE_CHUNK_SIZE
      const end = (index + 1) * FILE_CHUNK_SIZE
      const blob = index < keys.length ? file.slice(start, end) : file.slice(start)
      promises.push(axios.put(urls[index], blob))
    }
    const resparts = await Promise.all(promises)
    return resparts.map((part, index) => ({
      ETag: part.headers.etag,
      PartNumber: index + 1,
    }))
  } catch (error) {
    console.log(error)
  }
}

export const shortCodes = [
  {
    keyCode: 39, // Right arrow
    ctrl: false, // Ctrl/Cmd
    handle: (player) => {
      player.forward(5)
    },
  },
  {
    keyCode: 37, // left arrow
    ctrl: false, // Ctrl/Cmd
    handle: (player) => {
      player.replay(5)
    },
  },
]

export const convertSeconds = (timeInSeconds) => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const pad = (num, size) => `000${num}`.slice(size * -1)
  const time = Number.parseFloat(timeInSeconds).toFixed(3)
  const hours = Math.floor(time / 60 / 60)
  const minutes = Math.floor(time / 60) % 60
  const seconds = Math.floor(time - minutes * 60)
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`
}
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i

export const checkDash = (source) => DASH_EXTENSIONS.test(source)
export const checkHls = (source) => HLS_EXTENSIONS.test(source)
