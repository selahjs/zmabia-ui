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

(function() {

    'use strict';

    angular.module('admin-lot-list').config(routes);

    routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes($stateProvider, ADMINISTRATION_RIGHTS) {

        $stateProvider.state('openlmis.administration.lots', {
            showInNavigation: true,
            label: 'adminLotList.lots',
            url: '/lots?orderableId&expirationDateFrom&expirationDateTo&page&size',
            controller: 'LotListController',
            templateUrl: 'admin-lot-list/lot-list.html',
            controllerAs: 'vm',
            accessRights: [ADMINISTRATION_RIGHTS.LOTS_MANAGE],
            resolve: {
                paginatedLots: function($q, $stateParams, paginationService, lotService) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
                        if (!stateParams.hasOwnProperty('orderableId')
                            || stateParams.orderableId === null) {
                            return $q(function(resolve) {
                                resolve({
                                    content: []
                                });
                            });
                        }

                        var params = angular.copy(stateParams);

                        params.page = stateParams.page;
                        params.size = stateParams.size;
                        params.tradeItemIdIgnored = true;

                        if (params.orderableId === '*') {
                            delete params.orderableId;
                        }

                        return lotService.query(params);
                    });
                },
                lots: function(paginatedLots, orderables) {
                    return paginatedLots.map(function(lot) {
                        var orderable = orderables.find(function(p) {
                            if (p.identifiers.hasOwnProperty('tradeItem') && lot.tradeItemId !== null) {
                                return p.identifiers.tradeItem.toLowerCase()
                                    === lot.tradeItemId.toLowerCase();
                            }

                            return false;
                        });

                        var noProductMsg = 'No product';

                        return {
                            productCode: orderable === undefined
                                ? noProductMsg
                                : orderable.productCode,
                            productName: orderable === undefined
                                ? noProductMsg
                                : orderable.fullProductName,
                            lotCode: lot.lotCode,
                            expirationDate: lot.expirationDate,
                            manufacturedDate: lot.manufactureDate
                        };
                    });
                },
                orderables: function($q, orderableService) {
                    var deferred = $q.defer();

                    orderableService.search().then(function(response) {
                        // NOP Confirm that only orderables with lots should be visible
                        // deferred.resolve(response.content.filter(function (x) {
                        //     return !angular.equals(x.identifiers, {});
                        // }));
                        deferred.resolve(response.content);
                    }, deferred.reject);

                    return deferred.promise;
                },
                orderablesFilterOptions: function(orderables) {
                    return [
                        {
                            value: '*',
                            name: 'All'
                        }
                    ].concat(orderables.map(function(p) {
                        return {
                            value: p.id,
                            name: p.fullProductName
                        };
                    }));
                }
            }
        });
    }
})();
