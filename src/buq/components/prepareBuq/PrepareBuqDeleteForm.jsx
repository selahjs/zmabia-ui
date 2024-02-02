import React from "react";
import { toast } from "react-toastify";
import AdminBuqDeleteForm from "../../../admin-buq/components/AdminBuqForm/AdminBuqDeleteForm";
import useServerService from "../../../react-hooks/useServerService";

const PrepareBuqDeleteForm = ({
  onSubmit,
  onCancel,
  report,
  loadingModalService,
}) => {
  const buqService = useServerService("buqService");

  const handleDeleteSubmit = () => {
    loadingModalService.open();
    buqService
      .removeBuqReport(report.id)
      .then(() => {
        onSubmit();
        toast.success("Report has been deleted successfully");
      })
      .finally(() => loadingModalService.close());
  };

  return (
    <AdminBuqDeleteForm
      submitDelete={handleDeleteSubmit}
      onCancel={onCancel}
      confirmMessage="Are you sure you want to delete Report?"
    />
  );
};

export default PrepareBuqDeleteForm;
