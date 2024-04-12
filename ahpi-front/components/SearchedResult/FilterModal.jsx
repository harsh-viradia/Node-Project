import useTranslation from "next-translate/useTranslation"
import React from "react"

import DrawerWrapper from "../../shared/drawer"
import Button from "../../widgets/button"
import OrbitLink from "../../widgets/orbitLink"
import FilterContent from "./FilterContent"

const FilterModal = ({ open, setOpen, courseContent = {}, onChange, checked, selectId, handleCheck }) => {
  const { t } = useTranslation("common")
  return (
    <DrawerWrapper
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{t("filTer")}</h3>
          <OrbitLink href="#" className="text-sm underline text-primary" onClick={handleCheck}>
            {t("clearFilter")}
          </OrbitLink>
        </div>
      }
      modalFooter={<Button title="Apply Filter" className="w-full" primaryShadowBTN onClick={() => setOpen(false)} />}
    >
      {courseContent.map((x) => (
        <FilterContent content={x} onChange={onChange} checked={checked} selectId={selectId} />
      ))}
    </DrawerWrapper>
  )
}

export default FilterModal
