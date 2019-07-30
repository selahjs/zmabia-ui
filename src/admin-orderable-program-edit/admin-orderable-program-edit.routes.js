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

    angular.module('admin-orderable-program-edit').config(routes);

    routes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes(modalStateProvider, ADMINISTRATION_RIGHTS) {

        modalStateProvider.state('openlmis.administration.orderables.edit.programs.edit', {
            controller: 'OrderableProgramEditController',
            templateUrl: 'admin-orderable-program-edit/orderable-program-edit.html',
            url: '/edit/:programId',
            controllerAs: 'vm',
            accessRights: [
                ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE,
                ADMINISTRATION_RIGHTS.FACILITY_APPROVED_ORDERABLES_MANAGE
            ],
            areAllRightsRequired: false,
            resolve: {
                orderableDisplayCategories: function(OrderableDisplayCategoriesResource) {
                    return new OrderableDisplayCategoriesResource().query();
                },
                programOrderable: function($stateParams, programsOrderable) {
                    var program = _.findWhere(programsOrderable, {
                        programId: $stateParams.programId
                    });
                    return program;
                },
                successNotificationKey: function() {
                    if (typeof programOrderable !== 'undefined') {
                        return  'adminOrderableProgram.save.success';
                    }
                    return 'adminOrderableProgram.create.success';
                },
                errorNotificationKey: function() {
                    if (typeof programOrderable !== 'undefined') {
                        return 'adminOrderableProgram.save.failure';
                    }
                    return 'adminOrderableProgram.create.failure';
                }
            },
            parentResolves: ['orderable', 'programsOrderable', 'canEdit', 'programs', 'programsMap']
        });
    }
})();