import { useEffect, useState } from "react";
import useServerService from "./useServerService";
import { STORAGE_HOME_FACILITY_KEY } from "../buq/utils/constants";

const useBuqCommonFuncs = () => {
  const [forecastingPeriodsParams, setForecastingPeriodsParams] = useState([]);
  const [isLoadingForecastingPeriods, setIsLoadingForecastingPeriods] =
    useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [buqProgram, setBuqProgram] = useState({});

  const programService = useServerService("programService");
  const periodService = useServerService("periodService");

  const homeFacility = JSON.parse(
    localStorage.getItem(STORAGE_HOME_FACILITY_KEY)
  );

  const fetchPrograms = () => {
    setIsLoadingPrograms(true);
    programService
      .getAll()
      .then((fetchedPrograms) => {
        setBuqProgram(
          fetchedPrograms.find((program) => program.name === "BUQ")
        );
      })
      .finally(() => setIsLoadingPrograms(false));
  };

  const fetchForecastingPeriods = () => {
    setIsLoadingForecastingPeriods(true);
    periodService
      .query()
      .then((fetchedForecastingPeriods) => {
        const { content } = fetchedForecastingPeriods;

        const buqPeriods = content.filter((forecastingPeriod) => {
          if (forecastingPeriod.processingSchedule.code === "BUQ") {
            return true;
          }
        });

        setForecastingPeriodsParams(
          buqPeriods.map((forecastingPeriod) => ({
            value: forecastingPeriod.id,
            name: forecastingPeriod.name,
          }))
        );
      })
      .finally(() => setIsLoadingForecastingPeriods(false));
  };

  useEffect(() => {
    fetchPrograms();
    fetchForecastingPeriods();
  }, []);

  return {
    isLoadingForecastingPeriods,
    forecastingPeriodsParams,
    isLoadingPrograms,
    homeFacility,
    buqProgram,
  };
};

export default useBuqCommonFuncs;
