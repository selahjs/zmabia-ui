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

    /**
     * @ngdoc service
     * @name stock-card-summary.StockCardSummaryRepositoryImpl
     *
     * @description
     * Implementation of the StockCardSummary interface.
     * Communicates with the REST API of the OpenLMIS server.
     */
    angular
        .module('stock-card-summary')
        .factory('StockCardSummaryRepositoryImpl', StockCardSummaryRepositoryImpl);

    StockCardSummaryRepositoryImpl.$inject = [
        'stockmanagementUrlFactory', 'lotService', 'OrderableResource', '$q', '$window',
        'accessTokenFactory', 'StockCardSummaryResource', 'dateUtils', 'offlineService',
        'currentUserService', 'messageService'
    ];

    function StockCardSummaryRepositoryImpl(stockmanagementUrlFactory,
                                            lotService, OrderableResource,
                                            $q, $window, accessTokenFactory,
                                            StockCardSummaryResource, dateUtils,
                                            offlineService, currentUserService, messageService) {

        StockCardSummaryRepositoryImpl.prototype.query = query;
        StockCardSummaryRepositoryImpl.prototype.print = print;

        return StockCardSummaryRepositoryImpl;

        /**
         * @ngdoc method
         * @methodOf stock-card-summary.StockCardSummaryRepositoryImpl
         * @name StockCardSummaryRepositoryImpl
         * @constructor
         *
         * @description
         * Creates an instance of the StockCardSummaryRepositoryImpl class.
         */
        function StockCardSummaryRepositoryImpl() {
            this.orderableResource = new OrderableResource();
            this.resource = new StockCardSummaryResource();
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary.StockCardSummaryRepositoryImpl
         * @name print
         *
         * @description
         * Opens window with Stock Card Summaries.
         *
         * @param {string} program  the program UUID the stock cards will be retrieved
         * @param {string} facility the facility UUID the stock cards will be retrieved
         */
        function print(program, facility) {
            var sohPrintUrl = '/api/common/stockCardSummaries/print',
                params = 'program=' + program + '&' + 'facility=' + facility +
                    '&' + 'lang=' + messageService.getCurrentLocale();
            $window.open(accessTokenFactory.addAccessToken(
                stockmanagementUrlFactory(sohPrintUrl + '?' + params)
            ), '_blank');
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary.StockCardSummaryRepositoryImpl
         * @name query
         *
         * @description
         * Retrieves a page of stock card summaries from the OpenLMIS server.
         * Communicates with the endpoint of the Stock Cards Summaries V2 REST API.
         *
         * @param  {Object}  params request query params
         * @return {Promise}        page of stock card summaries
         */
        function query(params) {
            var orderableResource = this.orderableResource;
            var resource = this.resource;

            return currentUserService.getUserInfo()
                .then(function(user) {
                    var docId = params['programId'] + '/' + params['facilityId']
                        + '/' + user.id;

                    return resource.query(params, docId)
                        .then(function(stockCardSummariesPage) {
                            if (offlineService.isOffline()) {
                                stockCardSummariesPage.content = filterNonEmptyStockCardSummaries(
                                    stockCardSummariesPage
                                );
                            }

                            var lotIds = getLotIds(stockCardSummariesPage.content),
                                orderableIds = getOrderableIds(stockCardSummariesPage.content);

                            return $q.all([
                                orderableResource.query({
                                    id: orderableIds
                                }),
                                lotService.query({
                                    id: lotIds
                                })
                            ])
                                .then(function(responses) {
                                    var orderablePage = responses[0],
                                        lotPage = responses[1];

                                    return combineResponses(stockCardSummariesPage,
                                        orderablePage.content,
                                        lotPage.content, params);
                                });
                        });
                });
        }

        function combineResponses(stockCardSummariesPage, orderables, lots, params) {
            stockCardSummariesPage.content.forEach(function(summary) {
                summary.orderable = getObjectForReference(orderables, summary.orderable);

                summary.canFulfillForMe.forEach(function(fulfill) {
                    fulfill.orderable = getObjectForReference(orderables, fulfill.orderable);
                    fulfill.lot = getObjectForReference(lots, fulfill.lot);
                    fulfill.occurredDate = dateUtils.toDate(fulfill.occurredDate);

                    if (fulfill.lot && fulfill.lot.expirationDate) {
                        fulfill.lot.expirationDate = dateUtils.toDate(fulfill.lot.expirationDate);
                    }
                });
            });
            if (params.includeInactive) {
                stockCardSummariesPage.content = filterStockCardSummariesByActiveParam(
                    stockCardSummariesPage.content,
                    params.includeInactive === 'true'
                );

            }

            return stockCardSummariesPage;
        }

        function getLotIds(stockCardSummaries) {
            var ids = [];

            stockCardSummaries.forEach(function(summary) {
                summary.canFulfillForMe.forEach(function(fulfill) {
                    if (fulfill.lot) {
                        ids.push(fulfill.lot.id);
                    }
                });
            });

            return ids;
        }

        function getOrderableIds(stockCardSummaries) {
            var ids = [];

            stockCardSummaries.forEach(function(summary) {
                ids.push(summary.orderable.id);
                summary.canFulfillForMe.forEach(function(fulfill) {
                    if (fulfill.orderable) {
                        ids.push(fulfill.orderable.id);
                    }
                });
            });

            return ids;
        }

        function getObjectForReference(objectList, reference) {
            if (reference) {
                return objectList.filter(function(object) {
                    return reference.id === object.id;
                })[0];
            }
            return null;
        }

        function filterNonEmptyStockCardSummaries(stockCardSummariesPage) {
            return stockCardSummariesPage.content.reduce(function(items, summary) {
                if (summary.stockOnHand !== null) {
                    items.push(summary);
                }
                return items;
            }, []);
        }

        /**
         * @param {StockCardSummary[]} stockCardSummariesPage
         * @param {Boolean} includeInactive
         * @return {StockCardSummary[]}
         */
        function filterStockCardSummariesByActiveParam(stockCardSummariesPage,
                                                       includeInactive) {
            if (includeInactive) {
                return stockCardSummariesPage;
            }

            return _.filter(stockCardSummariesPage, function(summary) {
                summary.canFulfillForMe = _.filter(summary.canFulfillForMe, function(item) {
                    return item.active === true;
                });
                return summary;
            }, []);
        }
    }
})();
