/* eslint-disable prettier/prettier */
import useTranslation from "next-translate/useTranslation"
import React from "react"
// import Button from "widgets/button"

const SearchErrorInfo = ({ title }) => {
  const { t } = useTranslation("common")

  return (
    <div className="relative mb-10">
      <h2>
        {t("couldnot_found_search_result")} &quot;<span className="text-primary">{title}</span>&quot;
      </h2>
      <div className="flex flex-col gap-4 mt-6">
        <h4>{t("try_adjust")}</h4>
        <ul className="grid grid-cols-1 gap-1.5 md:ml-5">
          <li>
            <p>{t("make_sure_correct")}</p>
          </li>
          <li>
            <p>{t("try_different")}</p>
          </li>
          <li>
            <p>{t("try_more_general")}</p>
          </li>
        </ul>
        {/* <div>
          <Button title={t("refresh")} />
        </div> */}
      </div>
    </div>
  )
}

export default SearchErrorInfo
