/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

import React, { useEffect, useMemo, useState } from 'react';
import TableByCategories from '../../../react-components/table/table-by-categories';
import NumericInput from '../../../react-components/inputs/numeric-input';
import InputWithSuggestionsAndValidation from '../../../react-components/inputs/input-with-suggestions-and-validation';
import { FIELD_REQUIRED_TOOLTIP } from '../../utils/constants';

const FacilityDemandingForecastingTable = ({
    getField,
    tableData,
    remarksParams,
    buqProgramId,
    onRowChange,
    deleteRow,
    validateRow,
    isRowValid,
    showValidationErrors,
    noItemsMessage,
    isEditable,
    ...props
}) => {
    const [dataWithCategoriesIncluded, setDataWithCategoriesIncluded] = useState([]);

    const sortAlphabetically = (items, key) => items.sort((a, b) => {
        if (a.orderable[key] < b.orderable[key]) {
            return -1;
        }
        if (a.orderable[key] > b.orderable[key]) {
            return 1;
        }
        return 0;
    });

    useEffect(() => {
        const categories = tableData.reduce((prev, categoryName) => {
            if (prev.includes(categoryName.category)) {
                return prev;
            }
            return [...prev, categoryName.category];
        }, []).sort();

        const dataWithCategoriesIncluded = categories.reduce((prev, categoryName) => {
            const lineItemsWithCategory = tableData.filter((lineItem) => lineItem.category === categoryName);
            const sortedLineItemsWithCategory = sortAlphabetically(lineItemsWithCategory, 'fullProductName');
            const categoryObject = { displayCategory: categoryName };

            return [...prev, categoryObject, ...sortedLineItemsWithCategory];
        }, []);

        setDataWithCategoriesIncluded(dataWithCategoriesIncluded);
    }, [tableData]);

    const columns = useMemo(
        () => [
            {
                Header: 'MSD Item Code',
                accessor: 'orderable.productCode',
            },
            {
                Header: 'Product',
                accessor: 'orderable.fullProductName'
            },
            {
                Header: 'Unit of Measure',
                accessor: 'orderable.dispensable.displayUnit',
                Cell: ({ row }) => {
                    const unitOfMeasure = row.original.orderable.dispensable.displayUnit;
                    return (
                        <>
                            {unitOfMeasure ?? ''}
                        </>
                    );
                }
            },
            {
                Header: 'Annual adjusted consumption',
                accessor: 'annualAdjustedConsumption',
                Cell: ({ row }) => {
                    const annualAdjustedConsumption = row.original.annualAdjustedConsumption;
                    return (<NumericInput
                        value={annualAdjustedConsumption}
                        disabled
                    />
                    );
                }
            },
            {
                Header: 'Verified annual adjusted consumption',
                accessor: 'verifiedAnnualAdjustedConsumption',
                Cell: ({ row }) => {
                    const verifiedAnnualAdjustedConsumption = row.original.verifiedAnnualAdjustedConsumption;
                    const hasError = row.original.errors.includes('VERIFIED_CONSUMPTION');
                    return (
                        <NumericInput
                            key={row.original.id}
                            value={verifiedAnnualAdjustedConsumption}
                            isInvalid={hasError}
                            errorMessage={FIELD_REQUIRED_TOOLTIP}
                            onChange={(value) => onRowChange('verifiedAnnualAdjustedConsumption', value, row.original)}
                            onBlur={() => validateRow(row.original)}
                            disabled={!isEditable}
                        />
                    );
                }
            },
            {
                Header: 'Forecasted demand',
                accessor: 'forecastedDemand',
                Cell: ({ row }) => {
                    const forecastedDemand = row.original.forecastedDemand;
                    const hasError = row.original.errors.includes('FORECASTED_DEMAND');
                    return (
                        <NumericInput
                            key={row.original.id}
                            value={forecastedDemand}
                            isInvalid={hasError}
                            errorMessage={FIELD_REQUIRED_TOOLTIP}
                            onChange={(value) => onRowChange('forecastedDemand', value, row.original)}
                            onBlur={() => validateRow(row.original)}
                            disabled={!isEditable}
                        />
                    );
                }
            },
            {
                Header: 'MSD Sales Price',
                accessor: 'orderable.netContent',
                Cell: ({ row }) => {
                    const price = getField(row.original.orderable, 'pricePerPack');
                    return (
                        <NumericInput
                            value={price ?? 0}
                            disabled
                        />
                    );
                }
            },
            {
                Header: 'Total Cost',
                accessor: 'totalCost',
                Cell: ({ row }) => {
                    const totalCost = Number(row.original.totalCost).toFixed(2);
                    return (
                        <NumericInput
                            value={totalCost}
                            disabled
                        />
                    );
                }
            },
            {
                Header: 'Remarks',
                accessor: 'id',
                Cell: ({ row }) => {
                    const remark = row.original.remark;
                    const hasError = row.original.errors.includes('REMARK');
                    return (
                        <InputWithSuggestionsAndValidation
                            placeholder='Select Remark'
                            data={remarksParams}
                            displayValue='name'
                            onClick={(value) => onRowChange('remark', value, row.original)}
                            disabled={(!hasError && !remark) || !isEditable}
                            valueId={remark?.id ?? remark}
                            isInvalid={hasError}
                            displayInformation={false}
                            onBlur={() => validateRow(row.original)}
                        />
                    )
                }
            }
        ],
        []
    );

    return (
        <div className='forecast-table-container' {...props}>
            <TableByCategories
                data={dataWithCategoriesIncluded}
                columns={columns}
                skipPageReset={true}
                validateRow={isRowValid}
                showValidationErrors={true}
                withScrollStyle={true}
            />
        </div>
    );
};

export default FacilityDemandingForecastingTable;
