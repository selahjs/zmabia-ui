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

describe('openlmis-permissions run', function() {

    beforeEach(function() {
        var context = this;
        module('openlmis-permissions');
        module('referencedata-user', function($provide) {
            context.loginServiceSpy = jasmine.createSpyObj('loginService', [
                'registerPostLoginAction', 'registerPostLogoutAction'
            ]);
            $provide.value('loginService', context.loginServiceSpy);
        });

        inject(function($injector) {
            this.RightDataBuilder = $injector.get('RightDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.userRightsFactory = $injector.get('userRightsFactory');
            this.authorizationService = $injector.get('authorizationService');
            this.currentUserRolesService = $injector.get('currentUserRolesService');
        });

        this.rights = [
            new this.RightDataBuilder().build()
        ];

        this.user = new this.UserDataBuilder().build();

        this.postLoginAction = getLastCall(this.loginServiceSpy.registerPostLoginAction).args[0];
        this.postLogoutAction = getLastCall(this.loginServiceSpy.registerPostLogoutAction).args[0];

        spyOn(this.userRightsFactory, 'buildRights').andReturn(this.$q.resolve(this.rights));
        spyOn(this.authorizationService, 'setRights');
        spyOn(this.authorizationService, 'clearRights');
        spyOn(this.currentUserRolesService, 'getUserRoles');
        spyOn(this.currentUserRolesService, 'clearCachedRoles');
    });

    describe('run block', function() {

        it('should register post login action', function() {
            expect(this.loginServiceSpy.registerPostLoginAction).toHaveBeenCalled();
        });

        it('should register post logout action', function() {
            expect(this.loginServiceSpy.registerPostLogoutAction).toHaveBeenCalled();
        });

    });

    describe('post login action', function() {

        it('should build user this.rights', function() {
            this.postLoginAction(this.user);
            this.$rootScope.$apply();

            expect(this.userRightsFactory.buildRights).toHaveBeenCalledWith(this.user.userId);
        });

        it('should set up this.rights', function() {
            this.authorizationService.setRights.andReturn(this.$q.resolve());

            var success;
            this.postLoginAction(this.user)
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.authorizationService.setRights).toHaveBeenCalledWith(this.rights);
        });

        it('should cache user roles', function() {
            this.postLoginAction(this.user);
            this.$rootScope.$apply();

            expect(this.currentUserRolesService.getUserRoles).toHaveBeenCalled();
        });

    });

    describe('post logout action', function() {

        it('should clear this.rights', function() {
            this.authorizationService.clearRights.andReturn(this.$q.resolve());

            var success;
            this.postLogoutAction()
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.authorizationService.clearRights).toHaveBeenCalled();
        });

        it('should cache user roles', function() {
            this.postLogoutAction();
            this.$rootScope.$apply();

            expect(this.currentUserRolesService.clearCachedRoles).toHaveBeenCalled();
        });

    });

    function getLastCall(method) {
        return method.calls[method.calls.length - 1];
    }

});