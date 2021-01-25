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

    angular
        .module('referencedata-orderable')
        .run(routes);

    routes.$inject = ['loginService', 'OrderableResource', 'programService'];

    function routes(loginService, OrderableResource, programService) {

        loginService.registerPostLoginAction(function(user) {
            return programService.getUserPrograms(user.userId)
                .then(function(programs) {
                    programs.forEach(function(program) {
                        var params = {
                            program: program.code
                        };
                        return new OrderableResource().getAll(params)
                            .then(function(orderables) {
                                return orderables;
                            });
                    });
                });
        });
    }

})();
