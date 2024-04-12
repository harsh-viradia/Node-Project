/* eslint-disable jsx-a11y/label-has-associated-control */
import { hasAccessTo } from "@knovator/can"
import { Master as KMaster, Provider, SubMaster as KSubMaster } from "@knovator/masters-admin"
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
const ToggleSwitch = ({ row, onUpdate }) => {
  return (
    // eslint-disable-next-line no-underscore-dangle
    <label className="switch" key={row.id || row._id}>
      <input className="toggle" type="checkbox" defaultChecked={row.isActive} onClick={() => onUpdate(!row.isActive)} />
      <span className="slider round" />
    </label>
  )
}

const SubMaster = ({ permission = {}, user = {} }) => {
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
        permissions={{
          list: true,
        }}
      >
        <KSubMaster
          loader={<OrbitLoader relative />}
          explicitForm
          permissions={{
            list: true,
            add: isAllow(MODULE_ACTIONS.CREATE),
            destroy: isAllow(MODULE_ACTIONS.SOFTDELETE),
            partialUpdate: isAllow(MODULE_ACTIONS.ACTIVE),
            update: isAllow(MODULE_ACTIONS.UPDATE),
            sequencing: isAllow(MODULE_ACTIONS.SEQUENCE),
          }}
        >
          <LayoutWrapper
            title="Sub Master"
            permission={permission}
            user={user}
            headerDetail={
              <div className="flex items-center gap-3">
                <KSubMaster.Search />
                <KSubMaster.AddButton />
              </div>
            }
          >
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3">
                <div className="p-3 overflow-y-auto rounded-lg bg-white border border-thin-gray submaster">
                  <KMaster.Search />
                  <div className="grid gap-3 relative mt-3">
                    <KMaster.Lister
                      selectFirst
                      render={({ row, onClick, masterCode }) => (
                        <div
                          role="button"
                          tabIndex="0"
                          onKeyDown={onClick}
                          onClick={onClick}
                          className={`flex items-center gap-3 p-2 rounded-lg  shadow ${
                            masterCode === row.code ? "bg-dark-gray" : "bg-secondary"
                          }`}
                        >
                          <div className="flex items-center justify-center w-10 h-10 uppercase rounded-lg bg-white shadow">
                            {row.name.charAt(0)}
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                masterCode === row.code ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {row.name}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${
                                masterCode === row.code ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {row.code}
                            </p>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-9">
                <div className="overflow-hidden bg-white border rounded-lg border-thin-gray">
                  <div className="relative">
                    <KSubMaster.Table />
                    <KSubMaster.Pagination />
                  </div>
                </div>
              </div>
            </div>
            <KSubMaster.FormWrapper>
              {(data) => (
                <DrawerWrapper
                  open={data.open}
                  title={data.formState === "ADD" ? "Add Sub Master" : "Edit Sub Master"}
                  setOpen={data.onClose}
                  modalFooter={<KSubMaster.FormActions formRef={formReference} />}
                >
                  <KSubMaster.Form
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
            </KSubMaster.FormWrapper>
          </LayoutWrapper>
        </KSubMaster>
      </KMaster>
    </Provider>
  )
}

export default SubMaster
