/* eslint-disable jsx-a11y/label-has-associated-control */
import { hasAccessTo } from "@knovator/can"
import { Master as KMaster, Provider } from "@knovator/masters-admin"
import getConfig from "next/config"
import React, { useRef } from "react"
import DrawerWrapper from "shared/drawer"
import LayoutWrapper from "shared/layout/wrapper"
import handleLogout from "utils/common"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import { getToken } from "utils/localStorage"
import Toast from "utils/toast"
import { handleCode } from "utils/util"
import OrbitLoader from "widgets/loader"

const { publicRuntimeConfig } = getConfig()

// eslint-disable-next-line no-unused-vars
const ToggleSwitch = ({ row }) => {
  return (
    // eslint-disable-next-line no-underscore-dangle, jsx-a11y/label-has-associated-control
    <label className="switch" key={row.id || row._id}>
      <input className="toggle" type="checkbox" defaultChecked={row.isActive} onClick={() => !row.isActive} />
      <span className="slider round" />
    </label>
  )
}

const Master = ({ permission = {}, user = {} }) => {
  const formReference = useRef()
  const isAllow = (key) => hasAccessTo(permission, MODULES.MASTER, key)

  return (
    <Provider
      baseUrl={publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}
      token={getToken}
      onSuccess={(_CALLBACK_CODE, _code, message) => Toast(message, "success")}
      onError={(_CALLBACK_CODE, _code, message) => Toast(message, "error")}
      onLogout={handleLogout}
    >
      <KMaster
        loader={<OrbitLoader relative />}
        explicitForm
        permissions={{
          list: true,
          add: isAllow(MODULE_ACTIONS.CREATE),
          destroy: isAllow(MODULE_ACTIONS.SOFTDELETE),
          partialUpdate: isAllow(MODULE_ACTIONS.ACTIVE),
          update: isAllow(MODULE_ACTIONS.UPDATE),
        }}
      >
        <LayoutWrapper
          title="Masters"
          permission={permission}
          user={user}
          headerDetail={
            <div className="flex items-center gap-3">
              <KMaster.Search />
              <KMaster.AddButton />
            </div>
          }
        >
          <div className="overflow-hidden bg-white border rounded-lg border-thin-gray">
            {/* <div className="relative"> */}
            <KMaster.Table />
            <KMaster.Pagination />
            {/* </div> */}
          </div>
          <KMaster.FormWrapper>
            {(data) => (
              <DrawerWrapper
                open={data.open}
                title={data.formState === "ADD" ? "Add Master" : "Edit Master"}
                setOpen={data.onClose}
                modalFooter={<KMaster.FormActions formRef={formReference} />}
              >
                <KMaster.Form
                  schema={[
                    {
                      label: "Name*",
                      accessor: "name",
                      type: "text",
                      validations: {
                        required: "Name is required!",
                      },
                      placeholder: "Enter Name",
                    },
                    // {
                    //   label: "Display",
                    //   accessor: "names",
                    //   type: "text",
                    //   placeholder: "Enter Display",
                    // },
                    {
                      label: "Code*",
                      accessor: "code",
                      type: "text",
                      editable: false,
                      validations: {
                        required: "Code is required!",
                      },
                      placeholder: "Enter Code",
                      onInput: handleCode,
                    },
                  ]}
                  ref={formReference}
                />
              </DrawerWrapper>
            )}
          </KMaster.FormWrapper>
        </LayoutWrapper>
      </KMaster>
    </Provider>
  )
}

export default Master
