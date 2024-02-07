import React from 'react';

const AdminBuqDeleteForm = ({ submitDelete, confirmMessage, onCancel }) => (
        <div className='page-container'>
            <div className='page-content element-create-form'>
                <div className='section'>
                    {confirmMessage}
                </div>
            </div>
            <div className='bottom-bar'>
                <div>
                    <button
                        type='button'
                        className='secondary'
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        <span>Cancel</span>
                    </button>
                </div>
                <div>
                    <button
                        className='danger'
                        type='button'
                        onClick={() => submitDelete()}
                    >
                    Delete
                    </button>
                </div>
            </div>
        </div>
    );

export default AdminBuqDeleteForm;