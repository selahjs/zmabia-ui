import React, { useEffect, useMemo, useState } from 'react';
import DetailsBlock from '../../../react-components/DetailsBlock';
import useFacilityDemandForecasting from '../../../react-hooks/useFacilityDemandForecasting';
import Table from '../../../react-components/table/table';
import { Link } from 'react-router-dom';
import ResponsiveButton from '../../../react-components/buttons/responsive-button';
import {
  formatDateToMonthDayYear,
  objectNotEmpty,
} from '../../../react-components/utils/helpers';
import { findRegion } from '../../utils/helpers';
import { BUQ_STATUS } from '../../utils/constants';
import useServerService from '../../../react-hooks/useServerService';
import useLocalStorage from '../../../react-hooks/useLocalStorage';
import useGetBuqsForApproval from '../../../react-hooks/useGetBuqForApproval';

const ApproveBuq = ({
  loadingModalService,
  orderableService,
  facilityService,
}) => {
  const [dataBuqs, setDataBuqs] = useState([]);
  const [approvedBuqsParams, setApprovedBuqsParams] = useState([]);
  const [approveStats, setApproveStats] = useState({});

  const buqService = useServerService('buqService');
  const { storedItems: { userPrograms } } = useLocalStorage();

  const { buq, fetchDetailedBuq } =
    useFacilityDemandForecasting(
      loadingModalService,
      facilityService,
      orderableService
    );
  const programBuq = userPrograms?.find((program) => program.name === 'BUQ');
  const { fetchBuqsForApproval, buqsForApproval } = useGetBuqsForApproval(programBuq?.id);

  const fetchApproveStats = (programId) =>
    programId &&
    buqService
      .approveFacilityStats(programId)
      .then((stats) => setApproveStats(stats));

  useEffect(() => {
    // NOTE: This is first function so open loading modal
    loadingModalService.open();
    fetchBuqsForApproval();
  }, []);

  useEffect(() => {
    fetchApproveStats(programBuq?.id);
  }, []);

  useEffect(() => {
    if (!buqsForApproval) {
      loadingModalService.close();
      return;
    }
    if (buqsForApproval.length) {
      buqsForApproval.map(({ id }) => fetchDetailedBuq(id));
    }
  }, [buqsForApproval]);

  useEffect(() => {
    if (objectNotEmpty(buq)) {
      setDataBuqs([...dataBuqs, buq]);
    }
  }, [buq]);

  useEffect(() => {
    if (dataBuqs.length) {
      const data = dataBuqs.map(
        ({ id, facility, processingPeriod, statusChanges }) => {
          const submittedDate = statusChanges.reduce((newestDate, buq) => {
            if (buq.status === BUQ_STATUS.AUTHORIZED) {
              const occurredDate = formatDateToMonthDayYear(buq.occurredDate);
              return !newestDate || occurredDate > newestDate
                ? occurredDate
                : newestDate;
            }
            return newestDate;
          }, null);

          return {
            id: id,
            facilityCode: facility.code,
            facilityName: facility.name,
            facilityType: facility.type.name,
            districtName: facility.geographicZone.name,
            region: findRegion(facility.geographicZone).name,
            forecastingPeriod: processingPeriod.name,
            submittedDate: submittedDate,
          };
        }
      );

      if (dataBuqs.length === buqsForApproval.length) {
        setApprovedBuqsParams(data);
      }
    }
    // NOTE: This is the last function so close loading modal
    loadingModalService.close();
  }, [dataBuqs]);

  const detailsData = useMemo(
    () => [
      [
        {
          topic: 'Total Facilities',
          value: approveStats.totalFacilities || 0,
        },
        {
          topic: 'Total Submitted',
          value: approveStats.totalSubmitted || 0,
        },
        {
          topic: 'Percentage Submitted',
          value: `${approveStats.percentageSubmitted || 0}%`,
        },
      ],
    ],
    [approveStats]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Facility Code',
        accessor: 'facilityCode',
      },
      {
        Header: 'Facility Name',
        accessor: 'facilityName',
      },
      {
        Header: 'Facility Type',
        accessor: 'facilityType',
      },
      {
        Header: 'District Name',
        accessor: 'districtName',
      },
      {
        Header: 'Region',
        accessor: 'region',
      },
      {
        Header: 'Forecasting Period',
        accessor: 'forecastingPeriod',
      },
      {
        Header: 'Submitted Date',
        accessor: 'submittedDate',
      },
      {
        Header: 'Actions',
        accessor: "id",
        Cell: ({ value }) => (
          <Link to={`/buq/approve/${value}`}>
            <ResponsiveButton className="primary">
              <span>View</span>
            </ResponsiveButton>
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <>
      <h2 className='bottom-line'>Approve Facility Forecasting</h2>
      <DetailsBlock data={detailsData} className='full-width' />
      <Table
        columns={columns}
        data={approvedBuqsParams}
        noItemsMessage='No reports available'
      />
    </>
  );
};

export default ApproveBuq;
