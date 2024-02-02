import React from 'react';

const AdminBuqForm = ({
    title,
    submitText,
    values,
    setName,
    setErrors,
    nameValidation,
    setDescription,
    onCancel,
    isSaveButtonDisabled,
    onSubmitHandler,
    onSubmit,
}) => (
    <div className='page-container'>
        <div className='page-header-responsive'>
            <h2>{title}</h2>
        </div>
        <div className='page-content element-create-form'>
            <div className='section'>
                <div>
                    <strong className='is-required'>
                        Name
                    </strong>
                </div>
                <div className='field-full-width'>
                    <div
                        className={`${values.errors.length ? 'exclamation-mark' : ''}`}
                    >
                        <input
                            className={`text-field remarks-name-field ${values.errors.length ? 'invalid-field' : ''}`}
                            value={values.name}
                            onInput={e => setName(e.target.value)}
                            onKeyUp={() => {
                                setErrors([]);
                                nameValidation();
                            }}
                            maxLength='255'
                        />
                    </div>
                </div>
                {values.errors.map((error, key) => <p key={error + key} className='invalid-name'>{error}</p>)}
                <div>
                    <strong>
                        Description (optional)
                    </strong>
                </div>
                <textarea
                    className='text-field description-field'
                    value={values.description}
                    onInput={e => setDescription(e.target.value)}
                    maxLength='4000'
                />
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
                    className={`primary ${isSaveButtonDisabled && 'disabled-button'}`}
                    type='button'
                    disabled={isSaveButtonDisabled}
                    onClick={() => onSubmitHandler(onSubmit)}
                >
                    {submitText}
                </button>
            </div>
        </div>
    </div>
);

export default AdminBuqForm;
