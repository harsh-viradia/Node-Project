/* eslint-disable no-underscore-dangle */
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
import useCollapse from "react-collapsed"

import DownIcon from "../../icons/downicon"
import Checkbox from "../../widgets/filterCheckbox"

const FilterContent = ({ content = {}, onChange, checked, selectId }) => {
  const { t } = useTranslation("common")
  const [isExpanded, setExpanded] = useState(false)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })

  return (
    <div className="p-6 border-b border-light-gray">
      <div
        className="flex items-center justify-between"
        {...getToggleProps({
          onClick: () => setExpanded((previousExpanded) => !previousExpanded),
        })}
      >
        <p className="font-semibold">{content?.name?.en}</p>
        <div className="flex items-center gap-4">
          {/* <OrbitLink href="#" className="text-sm underline text-dark-gray">
            Clear
          </OrbitLink> */}
          {isExpanded ? (
            <div className="rotate-180">
              <DownIcon />
            </div>
          ) : (
            <DownIcon />
          )}
        </div>
      </div>
      <section {...getCollapseProps()}>
        <div className="grid w-full gap-2 mt-3 text-xs text-dark-gray">
          {content?.description?.length ? (
            <div className="flex items-center justify-between w-full">
              <div className="grid w-full gap-3">
                {content.description
                  ?.slice(1)
                  ?.sort((a, b) => a.seq - b.seq)
                  ?.map((y) => {
                    return (
                      <div className="flex items-center justify-between">
                        <Checkbox
                          className="block"
                          title={y?.name ?? y}
                          id={y?._id}
                          onChange={onChange}
                          checked={checked}
                          parentCode={y?.parentCode}
                          selectId={selectId}
                          code={y?.code}
                        />
                        <p className="font-semibold">{y?.figure}</p>
                      </div>
                    )
                  })}
              </div>
              <p>{content?.descriptionTime}</p>
            </div>
          ) : (
            <div className="flex justify-center">{t("NoData")}</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default FilterContent
