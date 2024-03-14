import React, { useState, useEffect, useMemo } from "react";
import useServerService from "../../../react-hooks/useServerService";
import DetailsBlock from "../../../react-components/DetailsBlock";
import ResponsiveButton from '../../../react-components/buttons/responsive-button';
import Table from '../../../react-components/table/table';
import { useHistory } from 'react-router-dom';
import useBuqCommonFuncs from "../../../react-hooks/useBuqCommonFunctions";
import useGetBuqsByStatus from "../../../react-hooks/useGetBuqsByStatus";
import { BUQ_STATUS, CREATE_AUTHORIZE_FORECASTING_STATUSES, RIGHT_NAME } from "../../utils/constants";
import useLocalStorage from "../../../react-hooks/useLocalStorage";

const CreateAuthorizeForecasting = ({ loadingModalService }) => {
    const { homeFacility, buqProgram } = useBuqCommonFuncs();
    const history = useHistory();

    const periodService = useServerService('periodService');
    const alertService = useServerService('alertService');

    const [buqs, setBuqs] = useState([]);

    const {
      fetchFilteredByStatusBuqs,
      isLoadingForecastingPeriods,
      buqByStatus,
    } = useGetBuqsByStatus(CREATE_AUTHORIZE_FORECASTING_STATUSES);

    const { storedItems } = useLocalStorage();

    const hasRight = (rightName, programId, facilityId) => {
      const userRights = storedItems.userRights || [];
      const foundRight = userRights.find((right) => right.name === rightName);

      return (
        foundRight &&
        foundRight.programIds.includes(programId) &&
        foundRight.facilityIds.includes(facilityId)
      );
    };

    const checkRightsAndProceed = (status, id) => {
      const userPrograms = storedItems.userPrograms || [];

      const programBuq = userPrograms.find((program) => program.name === 'BUQ');

      const isAuthorizedForForecasting =
        status === BUQ_STATUS.SUBMITTED &&
        hasRight(
          RIGHT_NAME.AUTHORIZE_FORECASTING,
          programBuq?.id,
          homeFacility.id
        );

      const canCreateForecasting =
        (status === BUQ_STATUS.DRAFT || status === BUQ_STATUS.REJECTED) &&
        hasRight(
          RIGHT_NAME.CREATE_FORECASTING,
          programBuq?.id,
          homeFacility.id
        );

      if (isAuthorizedForForecasting || canCreateForecasting) {
        history.push(`/buq/create/${id}`);
        return;
      }

      alertService.error(
        'buq.insufficientPermissions.title',
        'buq.insufficientPermissions.message'
      );
    };

    const fetchBuqs = async () => {
      try {
        const buqList = await Promise.all(
          buqByStatus.map(async (buq) => {
            const processingPeriod = await periodService.get(
              buq.processingPeriodId
            );

            return {
              id: buq.id,
              period: processingPeriod.name,
              startDate: processingPeriod.startDate,
              quantification: `${buq.targetYear + 1}/${buq.targetYear + 2}`,
              status: buq.status,
            };
          })
        );

        setBuqs(
          buqList.sort((a, b) =>
            a.startDate > b.startDate ? 1 : b.startDate > a.startDate ? -1 : 0
          )
        );
      } catch (error) {
        console.error('[fetchBuqs] | Error fetching BUQs:', error);
      }
    };

    useEffect(() => {
      fetchFilteredByStatusBuqs();
    }, []);

    useEffect(() => {
      if (
        !isLoadingForecastingPeriods &&
        buqByStatus &&
        buqByStatus.length > 0
      ) {
        fetchBuqs();
      }
    }, [isLoadingForecastingPeriods, buqByStatus]);

    useEffect(() => {
      if (!isLoadingForecastingPeriods) {
        loadingModalService.close();
        return;
      }
      loadingModalService.open();
    }, [isLoadingForecastingPeriods]);

    const detailsData = [
        [
            {
                topic: 'Facility Name',
                value: `${homeFacility.code}-${homeFacility.name}`
            },
            {
                topic: 'Program',
                value: buqProgram.name
            }
        ]
    ];

    const columns = useMemo(
      () => [
        {
          Header: 'Period(s)',
          accessor: 'period',
        },
        {
          Header: 'Quantification for the Year',
          accessor: 'quantification',
        },
        {
          Header: 'Status',
          accessor: 'status',
        },
        {
          Header: 'Actions',
          accessor: 'id',
          Cell: ({ value, row }) => {
            return (
              <ResponsiveButton
                className='primary'
                onClick={() =>
                  checkRightsAndProceed(row.original.status, value)
                }
              >
                <span>Forecast</span>
              </ResponsiveButton>
            );
          },
        },
      ],
      []
    );

    return (
        <>
            <h2 className='bottom-line'>
                Create BUQ Forecast Report
            </h2>
            <DetailsBlock data={detailsData} />
            <Table
                columns={columns}
                data={buqs}
                noItemsMessage='No reports available'
            />
        </>
    );
};

export default CreateAuthorizeForecasting;
