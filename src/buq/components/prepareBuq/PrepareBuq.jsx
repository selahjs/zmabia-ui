import React, { useMemo, useState, useEffect } from "react";
import Table from "../../../react-components/table/table";
import ResponsiveButton from "../../../react-components/buttons/responsive-button";
import PrepareBuqDeleteForm from "./PrepareBuqDeleteForm";
import Modal from "../../../admin-buq/components/Modal/Modal";
import { toast } from "react-toastify";
import useBuqCommonFuncs from "../../../react-hooks/useBuqCommonFunctions";
import usePrepareBuq from "../../../react-hooks/usePrepareBuq";
import useServerService from "../../../react-hooks/useServerService";
import InputWithSuggestionsAndValidation from "../../../react-components/inputs/input-with-suggestions-and-validation";
import useLocalStorage from "../../../react-hooks/useLocalStorage";

const PrepareBuq = ({ loadingModalService }) => {
  const [forecastingPeriodId, setForecastingPeriodId] = useState();
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState({});
  const [noneSelectedForecastingPeriod, setNoneSelectedForecastingPeriod] =
    useState(false);

  const {
    forecastingPeriodsParams,
    homeFacility,
    buqProgram,
    isLoadingForecastingPeriods,
    isLoadingPrograms,
  } = useBuqCommonFuncs();

  const {
    fetchFilteredByStatusBuqs,
    reportsParams,
    setReportsParams,
    isLoadingReportsList,
  } = usePrepareBuq();

  const { storedItems } = useLocalStorage();

  const buqService = useServerService("buqService");

  const handlePrepareReport = () => {
    if (forecastingPeriodId) {
      loadingModalService.open();
      buqService
        .prepareBuqReport(homeFacility.id, buqProgram.id, forecastingPeriodId)
        .then(() => {
          try {
            fetchFilteredByStatusBuqs();
            toast.success('Report has been prepared successfully');
          } catch (error) {
            toast.error(
              `An error occurred while preparing the report. Error details: ${error}`
            );
          }
        })
        .finally(() => {
          loadingModalService.close();
        });
      return;
    }
    setNoneSelectedForecastingPeriod(true);
  };

  const toggleDeleteModal = (report) => {
    setDisplayDeleteModal(!displayDeleteModal);
    setReportToDelete(report);
  };

  const onSubmitDelete = () => {
    toggleDeleteModal();
    setReportsParams(
      reportsParams.filter((report) => report.id !== reportToDelete.id)
    );
  };

  const handleDownload = (buq) => {
    loadingModalService.open();
    const token = storedItems.token;
    buqService
      .downloadBuqReport(buq.id)
      .then(() => {
        window.open(
          `${buqService.urlFactory(
            `/api/bottomUpQuantifications/${buq.id}/download?format=csv&access_token=${token}`
          )}`,
          "_blank"
        );
        toast.success("Data has been downloaded successfully");
      })
      .finally(() => {
        loadingModalService.close();
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Facility Name",
        accessor: "facilityName",
      },
      {
        Header: "Forecasted Period",
        accessor: "forecastedPeriod",
      },
      {
        Header: "Quantification Period",
        accessor: "quantificationPeriod.name",
      },
      {
        Header: "Forecasting Status",
        accessor: "forecastingStatus",
      },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ row }) => (
          <div className="prepare-buq-table-actions">
            <ResponsiveButton onClick={() => handleDownload(row.original)}>
              Download
            </ResponsiveButton>
            <ResponsiveButton
              className="danger"
              onClick={() => toggleDeleteModal(row.original)}
            >
              Delete
            </ResponsiveButton>
          </div>
        ),
      },
    ],
    [reportsParams]
  );

  useEffect(() => {
    if (
      !isLoadingReportsList &&
      !isLoadingPrograms &&
      !isLoadingForecastingPeriods
    ) {
      loadingModalService.close();
      return;
    }
    loadingModalService.open();
  }, [isLoadingReportsList, isLoadingPrograms, isLoadingForecastingPeriods]);

  return (
    <>
      <h2 className="prepare-buq-page-title">Report List</h2>
      <div className="prepare-buq-page-container">
        <div className="prepare-buq-page-left">
          <p>
            Program: <span>BUQ</span>
          </p>
          <div className="prepare-buq-select-section">
            <p className="is-required">Forecasting period</p>
            <InputWithSuggestionsAndValidation
              data={forecastingPeriodsParams}
              displayValue="name"
              placeholder="Select period"
              onClick={(value) => {
                setForecastingPeriodId(value);
                setNoneSelectedForecastingPeriod(false);
              }}
              isInvalid={noneSelectedForecastingPeriod}
              displayInformation={true}
            ></InputWithSuggestionsAndValidation>
          </div>
          <div className="prepare-buq-button">
            <button
              className="primary"
              type="button"
              onClick={() => handlePrepareReport()}
            >
              Prepare
            </button>
          </div>
        </div>
        <Table
          columns={columns}
          data={reportsParams}
          noItemsMessage="No reports available"
        />
      </div>
      <Modal
        isOpen={displayDeleteModal}
        children={[
          <PrepareBuqDeleteForm
            onSubmit={onSubmitDelete}
            onCancel={() => toggleDeleteModal({})}
            report={reportToDelete}
            loadingModalService={loadingModalService}
          />,
        ]}
      />
    </>
  );
};

export default PrepareBuq;
