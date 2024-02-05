import { useEffect, useState } from "react";
import useServerService from "./useServerService";
import useGetBuqsByStatus from "./useGetBuqsByStatus";
import { PREPARE_BUQ_STATUSES, STORAGE_HOME_FACILITY_KEY } from "../buq/utils/constants";

const usePrepareBuq = () => {
  const [isLoadingReportsList, setIsLoadingReportsList] = useState(false);
  const [reportsParams, setReportsParams] = useState([]);

  const homeFacility = JSON.parse(
    localStorage.getItem(STORAGE_HOME_FACILITY_KEY)
  );

  const periodService = useServerService("periodService");

  const {
    fetchFilteredByStatusBuqs,
    isLoadingForecastingPeriods,
    buqByStatus,
  } = useGetBuqsByStatus(PREPARE_BUQ_STATUSES);

  const fetchReportsList = async () => {
    setIsLoadingReportsList(true);

    try {
      const reportsList = await Promise.all(
        buqByStatus.map(async (buq) => {
          const processingPeriod = await periodService.get(
            buq.processingPeriodId
          );

          return {
            facilityName: homeFacility.name,
            forecastedPeriod: buq.targetYear,
            quantificationPeriod: processingPeriod,
            forecastingStatus: buq.status,
            id: buq.id,
          };
        })
      );

      setReportsParams(
        reportsList.sort((a, b) => a.forecastedPeriod - b.forecastedPeriod)
      );
    } catch (error) {
      console.error("[fetchReportsList] | Error fetching reports list:", error);
    } finally {
      setIsLoadingReportsList(false);
    }
  };

  useEffect(() => {
    fetchFilteredByStatusBuqs();
  }, []);

  useEffect(() => {
    if (!isLoadingForecastingPeriods && buqByStatus && buqByStatus.length > 0) {
      fetchReportsList();
    }
  }, [isLoadingForecastingPeriods, buqByStatus]);

  return {
    isLoadingReportsList,
    fetchReportsList,
    fetchFilteredByStatusBuqs,
    setReportsParams,
    reportsParams,
  };
};

export default usePrepareBuq;
