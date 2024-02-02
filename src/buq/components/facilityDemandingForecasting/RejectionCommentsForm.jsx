import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import TableNoPagination from '../../../react-components/table/table-no-pagination';
import useServerService from '../../../react-hooks/useServerService';

const RejectionCommentsForm = ({
  loadingModalService,
  onCancel,
  setRejectionDetails,
  rejectionDetails,
  canReject,
  onSubmitRejectionComments,
  isRejected,
  buqId,
}) => {
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const rejectionReasonService = useServerService('rejectionReasonService');
  const buqService = useServerService('buqService');

  const columns = useMemo(
    () => [
      {
        Header: 'Choose Reason',
        accessor: 'id',
        Cell: ({ row }) => {
          const id = row.original.id;
          const isSelected = rejectionDetails.rejectionReasons.includes(id);
          return (
            <div className='checkbox-container'>
              <input
                disabled={isRejected}
                className='checkbox'
                type='checkbox'
                checked={isSelected}
                onChange={() => {
                  if (isSelected) {
                    setRejectionDetails((prevState) => ({
                      ...prevState,
                      rejectionReasons: prevState.rejectionReasons.filter(
                        (reasonId) => reasonId !== id
                      ),
                    }));
                  } else {
                    setRejectionDetails((prevState) => ({
                      ...prevState,
                      rejectionReasons: [...prevState.rejectionReasons, id],
                    }));
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        Header: 'Reason of Rejection',
        accessor: 'name',
      },
    ],
    [rejectionDetails]
  );

  const fetchRejectionReasons = async () => {
    setIsLoading(true);
    try {
      const { content } = await rejectionReasonService.getAll();
      const filteredRejectionReasons = content.filter(
        (reason) => reason.rejectionReasonCategory.name === 'BUQ'
      );

      if (isRejected) {
        const { generalComments, rejectionReasons } =
          await buqService.getMostRecentRejection(buqId);

        const fetchedRejectionReasons = filteredRejectionReasons.filter(
          (buqReason) =>
            rejectionReasons.some(
              (fetchedReason) => fetchedReason === buqReason.id
            )
        );

        setRejectionDetails(() => ({
          generalComments,
          rejectionReasons: fetchedRejectionReasons.map(
            (rejectionReason) => rejectionReason.id
          ),
        }));
        setRejectionReasons(fetchedRejectionReasons);
        return;
      }

      setRejectionReasons(filteredRejectionReasons);
    } catch (error) {
      toast.error('Failed to fetch rejection reasons.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectionReasons();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      loadingModalService.close();
      return;
    }
    loadingModalService.open();
  }, [isLoading]);

  return (
    <div className='page-container'>
      <div className='page-header-responsive header-sof-modal'>
        <h2> Rejection Comments </h2>
      </div>
      <div className='table-container'>
        <TableNoPagination
          customReactTableContainerStyle='source-of-fund-table-container'
          customReactTableContentStyle='custom-react-table-content'
          customReactTableStyle='custom-react-table'
          noItemsMessage='Rejection reasons not found. Try to refresh the page.'
          columns={columns}
          data={rejectionReasons ? rejectionReasons : []}
        />
      </div>
      <div className='general-comments-container'>
        <p className='comments-input-title'> General comments </p>
        <textarea
          disabled={isRejected}
          className='text-field description-field'
          value={rejectionDetails.generalComments}
          onInput={(e) =>
            setRejectionDetails((prevState) => ({
              ...prevState,
              generalComments: e.target.value,
            }))
          }
          maxLength='4000'
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <div className='bottom-bar'>
        <div>
          <button type='button' className='secondary' onClick={onCancel}>
            Cancel
          </button>
        </div>
        {!isRejected && (
          <div>
            <button
              className='danger'
              type='button'
              onClick={() => onSubmitRejectionComments()}
              disabled={canReject}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectionCommentsForm;
