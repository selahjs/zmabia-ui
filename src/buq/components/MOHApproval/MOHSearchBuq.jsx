import React, { useState } from "react";
import InputWithSuggestionsAndValidation from '../../../react-components/inputs/input-with-suggestions-and-validation';

const MOHSearchBuq = ({
                          geographicZoneParams,
                          forecastingPeriodsParams,
                          group,
                          handleSetGroup,
                          forecastingPeriodId,
                          handleSetForecastingPeriodId,
                          fetchBuqs
                      }) => {

    const [noneSelectedGroup, setNoneSelectedGroup] = useState(false);
    const [noneSelectedForecastingPeriod, setNoneSelectedForecastingPeriod] = useState(false);

    const handleSearchButton = () => {
        if (!group) {
            setNoneSelectedGroup(true);
        }
        if (!forecastingPeriodId) {
            setNoneSelectedForecastingPeriod(true);
        }
        if (group && forecastingPeriodId) {
            fetchBuqs();
        }
    };

    return (
        <div className="approve-buq-page-left">
            <div className="approve-buq-select-section">
                <div className="approve-buq-select">
                    <p className="is-required">Group</p>
                    <InputWithSuggestionsAndValidation
                        data={geographicZoneParams}
                        defaultValue={geographicZoneParams[0]}
                        displayValue="name"
                        placeholder="Select group"
                        onClick={(value) => {
                            handleSetGroup(value);
                            setNoneSelectedGroup(false);
                        }}
                        isInvalid={noneSelectedGroup}
                        displayInformation={true}
                    />
                </div>
                <div className="approve-buq-select">
                    <p className="is-required">Forecasting period</p>
                    <InputWithSuggestionsAndValidation
                        data={forecastingPeriodsParams}
                        defaultValue={forecastingPeriodsParams.at(-1)}
                        displayValue="name"
                        placeholder="Select period"
                        onClick={(value) => {
                            handleSetForecastingPeriodId(value);
                            setNoneSelectedForecastingPeriod(false);
                        }}
                        isInvalid={noneSelectedForecastingPeriod}
                        displayInformation={true}
                    />
                </div>
            </div>
            <div className="approve-buq-button">
                <button
                    className="primary"
                    type="button"
                    onClick={() => handleSearchButton()}
                >
                    Search
                </button>
            </div>
        </div>
    )
}

export default MOHSearchBuq