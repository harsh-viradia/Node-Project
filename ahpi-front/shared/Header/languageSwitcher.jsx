import { setCookie } from "cookies-next"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

const LanguageSwitcher = () => {
  const { push, locale, locales, asPath } = useRouter()
  useEffect(() => {
    setCookie("locale", locale)
  }, [locale])

  return (
    <div>
      <select
        onChange={(event) => {
          push(asPath, asPath, { locale: event.target.value })
        }}
        className="bg-transparent"
        value={locale}
      >
        {locales.map((l) => {
          return (
            <option className="text-black" value={l} key={l}>
              {l?.toUpperCase()}{" "}
            </option>
          )
        })}
      </select>
    </div>
  )
}
export default LanguageSwitcher
