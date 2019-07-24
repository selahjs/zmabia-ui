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
     * @name admin-orderable-edit.controller:OrderableEditKitUnpackListController
     *
     * @description
     * Controller for managing orderable view screen.
     */
    angular
        .module('admin-orderable-edit')
        .controller('OrderableEditKitUnpackListController', controller);

    controller.$inject = [
        'selectProductsModalService', 'orderable', 'children', 'orderables', 'OrderableResource', 'orderablesMap',
        'FunctionDecorator', '$state', 'alertService', '$q'
    ];

    function controller(selectProductsModalService, orderable, children, orderables, OrderableResource, orderablesMap,
                        FunctionDecorator, $state, alertService, $q) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToOrderableList = goToOrderableList;
        vm.addChild = addChild;
        vm.removeChild = removeChild;
        vm.saveOrderable = new FunctionDecorator()
            .decorateFunction(saveOrderable)
            .withSuccessNotification('adminOrderableEdit.kitUnpackListSavedSuccessfully')
            .withErrorNotification('adminOrderableEdit.failedToSaveKitUnpackList')
            .withLoading(true)
            .getDecoratedFunction();

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableEditKitUnpackListController.
         */
        function onInit() {
            vm.orderable = orderable;
            vm.children = children;
            vm.orderablesMap = orderablesMap;
        }

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name addChild
         *
         * @description
         * Method that displays a modal for selecting and adding a orderable to the UI
         */
        function addChild() {
            selectProducts(excludeSelectedOrderables())
                .then(mapToChildren)
                .then(addToChildrenList);
        }

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name removeChild
         *
         * @description
         * Method that removes kit constituest from the kit orderable
         *
         * @param {Object} a single child or kit constituent to be removed
         */
        function removeChild(child) {
            if (vm.children.indexOf(child) > -1) {
                vm.children.splice(vm.children.indexOf(child), 1);
            }
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name goToOrderableList
         *
         * @description
         * Redirects to orderable list screen.
         */
        function goToOrderableList() {
            $state.go('^.^', {}, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name saveOrderable
         *
         * @description
         * Updates the orderable and return to the orderable list on success.
         */
        function saveOrderable() {
            return new OrderableResource()
                .update(vm.orderable)
                .then(goToOrderableList);
        }

        function selectProducts(availableProducts) {
            if (!availableProducts.length) {
                alertService.error(
                    'adminOrderableEdit.noProductsToAdd.label',
                    'adminOrderableEdit.noProductsToAdd.message'
                );
                return $q.reject();
            }

            return selectProductsModalService.show(availableProducts);
        }

        function excludeSelectedOrderables() {
            var childOrderableIds = vm.children.map(function(child) {
                return child.orderable.id;
            });

            return orderables.filter(function(i) {
                return childOrderableIds.indexOf(i.id) < 0;
            });
        }

        function mapToChildren(orderables) {
            return orderables.map(mapToChild);
        }

        function mapToChild(orderable) {
            return {
                orderable: {
                    id: orderable.id
                },
                quantity: undefined
            };
        }

        function addToChildrenList(selectedProducts) {
            vm.children.push.apply(vm.children, selectedProducts);
        }

    }
})();
