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

describe('openlmis-locale-cache run', function() {

    beforeEach(function() {
        this.loginServiceSpy = jasmine.createSpyObj('loginService', ['registerPostLoginAction']);
        this.localeServiceSpy = jasmine.createSpyObj('localeService', ['getLocaleSettings']);

        var loginServiceSpy = this.loginServiceSpy,
            localeServiceSpy = this.localeServiceSpy;
        module('openlmis-locale-cache', function($provide) {
            $provide.value('loginService', loginServiceSpy);
            $provide.value('localeService', localeServiceSpy);
        });

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
        });

        this.postLoginAction = loginServiceSpy.registerPostLoginAction.calls[0].args[0];
    });

    describe('run block', function() {

        it('should register post login action', function() {
            expect(this.loginServiceSpy.registerPostLoginAction).toHaveBeenCalled();
        });

    });

    describe('post login action', function() {

        it('should try to fetch locale settings from the server', function() {
            this.localeServiceSpy.getLocaleSettings.andReturn(this.$q.resolve());

            var success;
            this.postLoginAction()
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.localeServiceSpy.getLocaleSettings).toHaveBeenCalled();
        });
    });

});