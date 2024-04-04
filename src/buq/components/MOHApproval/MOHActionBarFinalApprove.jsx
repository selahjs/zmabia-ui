import React from 'react';
import Modal from '../../../admin-buq/components/Modal/Modal';
import ActionBar from '../../../react-components/ActionBar';
import ConfirmModalBody from '../../../react-components/ConfirmModalBody';
import ModalErrorMessage from '../../../react-components/ModalErrorMessage';

const MOHActionBarFinalApprove = ({
    handleFinalApproveAction,
    displayFinalApproveModal,
    handleSetDisplayFinalApproveModal,
    displayFinalApproveErrorModal,
    handleSetDisplayFinalApproveErrorModal
}) => (
    <>
        <Modal
            isOpen={displayFinalApproveModal}
            sourceOfFundStyle={true}
        >
            <ConfirmModalBody
                onConfirm={handleFinalApproveAction}
                confirmMessage={'Are you sure you want to approve this forecasting?'}
                onCancel={() => handleSetDisplayFinalApproveModal(false)}
                confirmButtonText={'Approve'}
            />
        </Modal>
        <ModalErrorMessage
            isOpen={displayFinalApproveErrorModal}
            customMessage="At least one pending approval needs to be selected"
            onClose={() => handleSetDisplayFinalApproveErrorModal(false)}
        />
        <ActionBar
            onFinalApproveAction={() => handleSetDisplayFinalApproveModal(true)}
            finalApproveButton={true}
            cancelButton={false}
            totalCostInformation={false}
            sourceOfFundButton={false}
        />
    </>
)

export default MOHActionBarFinalApprove