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

describe('referencedata-user run', function() {

    beforeEach(function() {
        this.loginServiceSpy = jasmine.createSpyObj('loginService', [
            'registerPostLoginAction', 'registerPostLogoutAction'
        ]);

        this.currentUserServiceSpy = jasmine.createSpyObj('currentUserService', ['getUserInfo', 'clearCache']);

        var suite = this;
        module('referencedata-user', function($provide) {
            $provide.value('loginService', suite.loginServiceSpy);
            $provide.value('currentUserService', suite.currentUserServiceSpy);
        });

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
        });

        this.postLoginAction = this.loginServiceSpy.registerPostLoginAction.calls[0].args[0];
        this.postLogoutAction = this.loginServiceSpy.registerPostLogoutAction.calls[0].args[0];

        inject();
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

        it('should try to fetch current user information', function() {
            this.currentUserServiceSpy.getUserInfo.andReturn(this.$q.resolve());

            var success;
            this.postLoginAction()
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.currentUserServiceSpy.getUserInfo).toHaveBeenCalled();
        });

    });

    describe('post logout action', function() {

        it('should clear current user cache', function() {
            this.currentUserServiceSpy.clearCache.andReturn(this.$q.resolve());

            var success;
            this.postLogoutAction()
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.currentUserServiceSpy.clearCache).toHaveBeenCalled();
        });

    });

});