import React from "react";
import { toast } from "react-toastify";
import useServerService from "../../../react-hooks/useServerService";
import useBuqCommonForm from "./useBuqCommonForm";

const useBuqSourceOfFundAddForm = (loadingModalService) => {
  const serverService = useServerService("adminBuq");

  const initialValues = {
    name: "",
    description: "",
    errors: [],
  };

  const {
    values,
    setInitialValues,
    setName,
    setDescription,
    setErrors,
    nameValidation,
    isSaveButtonDisabled,
  } = useBuqCommonForm(initialValues);

  const submitAddSourceOfFund = (onSubmit) => {
    const sourcesOfFunds = {
      name: values.name,
      description: values.description,
    };

    loadingModalService.open();
    serverService
      .addSourcesOfFunds(sourcesOfFunds)
      .then((addedSourceOfFund) => {
        onSubmit(addedSourceOfFund);
        setInitialValues();
        toast.success("Source of Found has been created successfully");
      })
      .finally(() => loadingModalService.close());
  };

  return {
    values,
    setInitialValues,
    setName,
    setDescription,
    setErrors,
    nameValidation,
    submitAddSourceOfFund,
    isSaveButtonDisabled,
  };
};

export default useBuqSourceOfFundAddForm;
