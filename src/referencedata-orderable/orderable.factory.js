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
     * @name referencedata-orderable.orderableFactory
     *
     * @description
     * Allows the user to retrieve orderables with additional info.
     */
    angular
        .module('referencedata-orderable')
        .factory('orderableFactory', factory);

    factory.$inject = ['$q', '$filter', 'orderableService', 'programService'];

    function factory($q, $filter, orderableService, programService) {

        return {
            getOrderableWithProgramData: getOrderableWithProgramData
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-orderable.orderableFactory
         * @name getOrderableWithProgramData
         *
         * @description
         * Retrieves orderable and adds program info to all program orderables.
         *
         * @param  {Object}  orderableId UUID of needed orderable
         * @return {Promise}             orderable with program data
         */
        function getOrderableWithProgramData(orderableId) {
            var deferred = $q.defer();

            programService.getAll().then(function(programs) {
                orderableService.get(orderableId).then(function(orderable) {
                    angular.forEach(orderable.programs, function(programOrderable) {
                        var filtered = $filter('filter')(programs, {
                            id: programOrderable.programId
                        });
                        if (filtered && filtered.length > 0) {
                            programOrderable.$program = filtered[0];
                        }
                    });
                    deferred.resolve(orderable);
                }, deferred.reject);
            }, deferred.reject);

            return deferred.promise;
        }
    }
})();
