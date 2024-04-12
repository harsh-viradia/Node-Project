import React from "react"
import DeleteActions from "shared/actions/deleteActions"
import EditActions from "shared/actions/editActions"
import GenerateInvoiceAction from "shared/actions/generateInvoiceAction"
import PermissionActions from "shared/actions/PermissionAction"
import ViewActions from "shared/actions/viewActions"

import DownloadAction from "./downloadAction"
import PageBuilderActions from "./pageBuilderAction"
import ReSendInvoiceAction from "./reSendInvoiceAction"

const TableActions = (properties = {}) => {
  const { original, actionProps, components, pagination } = properties
  const {
    canEdit = false,
    showPermission,
    module,
    title,
    canPageBuilder = false,
    canView = false,
    softDelete = false,
    canDelete = false,
    canDownload = false,
    canGenerateInvoice = false,
    canReSendInvoice = false,
    fieldToDisplay,
    showDisabled,
    itemName,
    config,
  } = actionProps

  return (
    <div className="flex items-center gap-4">
      {canReSendInvoice && <ReSendInvoiceAction showDisabled={showDisabled} {...properties} title={title} />}
      {canGenerateInvoice && <GenerateInvoiceAction {...properties} title={title} />}
      {canPageBuilder && <PageBuilderActions {...properties} title="Add Widgets" />}
      {canView && <ViewActions {...properties} title={title} />}
      {canEdit && <EditActions {...properties} title={title} />}
      {canDownload && <DownloadAction showDisabled={showDisabled} {...properties} title={title} />}
      {canDelete && (
        <DeleteActions
          data={original}
          module={module}
          getList={components?.list}
          pagination={pagination}
          softDelete={softDelete}
          fieldToDisplay={fieldToDisplay}
          itemName={itemName}
          config={config}
        />
      )}
      {showPermission && <PermissionActions data={original} />}
    </div>
  )
}

export default TableActions
