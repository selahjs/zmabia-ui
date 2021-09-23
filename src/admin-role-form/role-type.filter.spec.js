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

describe('role type filter', function() {

    beforeEach(function() {
        module('admin-role-form');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
            this.messageService = $injector.get('messageService');
        });

        this.roleTypeFilter = this.$filter('roleType');

        spyOn(this.messageService, 'get');
    });

    it('should throw exception for undefined', function() {
        var roleTypeFilter = this.roleTypeFilter;

        expect(function() {
            roleTypeFilter();
        }).toThrow('"undefined" is not a valid role type');
    });

    it('should return translated role name', function() {
        this.messageService.get.andReturn('Administration');

        expect(this.roleTypeFilter('GENERAL_ADMIN')).toEqual('Administration');
        expect(this.messageService.get).toHaveBeenCalledWith('referencedataRoles.administration');
    });

    it('should return translated role description if flag is set', function() {
        this.messageService.get.andReturn('Role Type Description');

        expect(this.roleTypeFilter('GENERAL_ADMIN', true)).toEqual('Role Type Description');
        expect(this.messageService.get).toHaveBeenCalledWith('adminRoleForm.generalAdminDescription');
    });

});