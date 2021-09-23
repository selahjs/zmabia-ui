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

describe('openlmis.administration.users state', function() {

    beforeEach(function() {
        module('admin-user-list');

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.ADMINISTRATION_RIGHTS = $injector.get('ADMINISTRATION_RIGHTS');
            this.UserRepository = $injector.get('UserRepository');
            this.paginationService = $injector.get('paginationService');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.$location = $injector.get('$location');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.users = [
            new this.UserDataBuilder().buildReferenceDataUserJson(),
            new this.UserDataBuilder().buildReferenceDataUserJson()
        ];

        this.usersPage = new this.PageDataBuilder()
            .withContent(this.users)
            .build();

        spyOn(this.UserRepository.prototype, 'query').andReturn(this.$q.when(this.usersPage));

        this.goToUrl = function(url) {
            this.$location.url(url);
            this.$rootScope.$apply();
        };

        this.getResolvedValue = function(name) {
            return this.$state.$current.locals.globals[name];
        };
    });

    it('should fetch a list of users', function() {
        this.goToUrl('/administration/users?usersPage=0&usersSize=10&sort=username');

        expect(this.getResolvedValue('users')).toEqual(this.users);
        expect(this.UserRepository.prototype.query).toHaveBeenCalledWith({
            sort: 'username',
            page: '0',
            size: '10'
        });
    });

    it('should require USERS_MANAGE right to enter', function() {
        expect(this.$state.get('openlmis.administration.users').accessRights)
            .toEqual([this.ADMINISTRATION_RIGHTS.USERS_MANAGE]);
    });

});
