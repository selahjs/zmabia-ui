import { useState } from "react";
import useServerService from "./useServerService";
import { STORAGE_HOME_FACILITY_KEY } from "../buq/utils/constants";

const useGetBuqsByStatus = (searchedBUQsByStatus) => {
  const [isLoadingForecastingPeriods, setIsLoadingForecastingPeriods] =
    useState(false);
  const [buqByStatus, setBugByStatus] = useState();

  const buqService = useServerService("buqService");

  const homeFacility = JSON.parse(
    localStorage.getItem(STORAGE_HOME_FACILITY_KEY)
  );

  const fetchFilteredByStatusBuqs = () => {
    setIsLoadingForecastingPeriods(true);
    buqService
      .getBuqsByStatus(searchedBUQsByStatus, homeFacility.id)
      .then((fetchedBuqsByStatus) => {
        const { content } = fetchedBuqsByStatus;

        setBugByStatus(content);
      })
      .finally(() => setIsLoadingForecastingPeriods(false));
  };

  return {
    fetchFilteredByStatusBuqs,
    isLoadingForecastingPeriods,
    buqByStatus
  };
};

export default useGetBuqsByStatus;
