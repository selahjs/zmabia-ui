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

describe('referencedataRoleService', function() {

    beforeEach(function() {
        module('referencedata-role');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataRoleFactory = $injector.get('referencedataRoleFactory');
            this.referencedataRoleService = $injector.get('referencedataRoleService');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.RightDataBuilder = $injector.get('RightDataBuilder');
        });

        this.roles = [
            new this.RoleDataBuilder()
                .withRight(new this.RightDataBuilder().build())
                .build(),
            new this.RoleDataBuilder()
                .withRight(new this.RightDataBuilder().build())
                .build()
        ];

        spyOn(this.referencedataRoleService, 'getAll').andReturn(this.$q.when(this.roles));
    });

    describe('getAllWithType', function() {

        it('should set types property for all roles', function() {
            var result;
            this.referencedataRoleFactory
                .getAllWithType()
                .then(function(roles) {
                    result = roles;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.roles);
            angular.forEach(result, function(role) {
                expect(role.type).toEqual(role.rights[0].type);
            });
        });
    });
});
