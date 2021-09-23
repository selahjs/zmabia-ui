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

describe('referencedata-lot run', function() {

    beforeEach(function() {
        var context = this;
        module('referencedata-lot');
        module('referencedata-user', function($provide) {
            context.loginServiceSpy = jasmine.createSpyObj('loginService', [
                'registerPostLoginAction', 'registerPostLogoutAction'
            ]);
            $provide.value('loginService', context.loginServiceSpy);
        });

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.lotService = $injector.get('lotService');
            this.LotDataBuilder = $injector.get('LotDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.lots = [
            new this.LotDataBuilder()
                .withId(1)
                .build(),
            new this.LotDataBuilder()
                .withId(2)
                .build(),
            new this.LotDataBuilder()
                .withId(3)
                .build(),
            new this.LotDataBuilder()
                .withId(4)
                .build()
        ];

        this.lotsPage = new this.PageDataBuilder()
            .withContent(this.lots)
            .build();

        this.postLoginAction = getLastCall(this.loginServiceSpy.registerPostLoginAction).args[0];

        spyOn(this.lotService, 'query').andReturn(this.$q.resolve(this.lotsPage));
        spyOn(this.lotService, 'clearLotsOffline');
    });

    describe('run block', function() {

        it('should register post login action', function() {
            expect(this.loginServiceSpy.registerPostLoginAction).toHaveBeenCalled();
        });

    });

    describe('post login action', function() {

        it('should clear lots cache', function() {
            this.postLoginAction(this.user);
            this.$rootScope.$apply();

            expect(this.lotService.clearLotsOffline).toHaveBeenCalled();
        });

        it('should get lots', function() {
            this.postLoginAction(this.user);
            this.$rootScope.$apply();

            expect(this.lotService.query).toHaveBeenCalled();
        });
    });

    function getLastCall(method) {
        return method.calls[method.calls.length - 1];
    }

});