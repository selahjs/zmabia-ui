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
     * @ngdoc controller
     * @name admin-orderable-edit.controller:OrderableAddEditFtapsController
     *
     * @description
     * Controller for managing FTAPs tab on orderable view screen.
     */
    angular
        .module('admin-orderable-edit')
        .controller('OrderableAddEditFtapsController', controller);

    controller.$inject = [
        'facilityTypeApprovedProduct', 'FacilityTypeApprovedProductResource', 'FunctionDecorator',
        'successNotificationKey', 'errorNotificationKey', 'programOrderables', 'facilityTypes', 'canEdit',
        '$state', 'orderableService'
    ];

    function controller(facilityTypeApprovedProduct, FacilityTypeApprovedProductResource, FunctionDecorator,
                        successNotificationKey, errorNotificationKey, programOrderables, facilityTypes, canEdit,
                        $state, orderableService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToFtapsList  = goToFtapsList;
        vm.saveFacilityTypeApprovedProduct = new FunctionDecorator()
            .decorateFunction(saveFacilityTypeApprovedProduct)
            .withSuccessNotification(successNotificationKey)
            .withErrorNotification(errorNotificationKey)
            .withLoading(true)
            .getDecoratedFunction();

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableAddEditFtapsController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableAddEditFtapsController.
         */
        function onInit() {
            vm.facilityTypeApprovedProduct = facilityTypeApprovedProduct;
            if (vm.facilityTypeApprovedProduct.id === vm.facilityTypeApprovedProduct.orderable
                .extraData.facilityTypeApprovedProductId) {
                vm.facilityTypeApprovedProduct.priorityDrug = vm.facilityTypeApprovedProduct
                    .orderable.extraData.priorityDrug;
            }
            vm.programs = programOrderables;
            vm.facilityTypes = facilityTypes;
            vm.canEdit = canEdit;
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableAddEditFtapsController
         * @name goToFtapsList
         *
         * @description
         * Redirects to FTAP list screen.
         */
        function goToFtapsList() {
            $state.go('^', {}, {
                reload: true
            });
        }

        function updateOrderableExtraData(vm, orderableService) {
            //construct orderable update object to extraDataColumn.
            var extraDataObject = {};
            extraDataObject.facilityTypeApprovedProductId = vm.facilityTypeApprovedProduct.id;
            extraDataObject.facilityTypeId = vm.facilityTypeApprovedProduct.facilityType.id;
            extraDataObject.programId = vm.facilityTypeApprovedProduct.program.id;
            extraDataObject.orderableId = vm.facilityTypeApprovedProduct.orderable.id;
            extraDataObject.priorityDrug = vm.facilityTypeApprovedProduct.priorityDrug;
            vm.facilityTypeApprovedProduct.orderable.extraData = extraDataObject;

            vm.facilityTypeApprovedProduct.orderable.updateid = vm.facilityTypeApprovedProduct.orderable.id;
            //console.log(extraDataObject);
            //save products
            orderableService.update(vm.facilityTypeApprovedProduct.orderable)
                .then(function(data) {
                    console.log('saved');
                    console.log(data);
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableAddEditFtapsController
         * @name saveFacilityTypeApprovedProduct
         *
         * @description
         * Updates the ftap and return to the ftaps list on success. If user wants to add new ftap and
         * inactive ftap with the same program, facility type and orderable exists, it will be updated.
         * Otherwise, the new ftap will be created.
         */
        function saveFacilityTypeApprovedProduct() {
            if (vm.facilityTypeApprovedProduct.id) {
                return save(vm.facilityTypeApprovedProduct);
            }
            return new FacilityTypeApprovedProductResource().query({
                orderableId: vm.facilityTypeApprovedProduct.orderable.id,
                facilityType: vm.facilityTypeApprovedProduct.facilityType.code,
                program: vm.facilityTypeApprovedProduct.program.code,
                active: false
            })
                .then(function(result) {
                    if (result.content.length > 0) {
                        var ftap = _.extend({}, result.content[0], vm.facilityTypeApprovedProduct);
                        ftap.emergencyOrderPoint = vm.facilityTypeApprovedProduct.emergencyOrderPoint;
                        ftap.minPeriodsOfStock = vm.facilityTypeApprovedProduct.minPeriodsOfStock;

                        return save(ftap);
                    }
                    return new FacilityTypeApprovedProductResource()
                        .create(vm.facilityTypeApprovedProduct)
                        .then(function() {
                            goToFtapsList();
                        });
                });
        }

        function save(ftap) {
            updateOrderableExtraData(vm, orderableService);
            return new FacilityTypeApprovedProductResource()
                .update(ftap)
                .then(function() {
                    goToFtapsList();
                });
        }
    }
})();
