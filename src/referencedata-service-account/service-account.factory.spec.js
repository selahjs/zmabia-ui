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

describe('serviceAccountFactory', function() {

    beforeEach(function() {
        module('referencedata-service-account');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.serviceAccountFactory = $injector.get('serviceAccountFactory');
            this.apiKeysService = $injector.get('apiKeysService');
            this.serviceAccountService = $injector.get('serviceAccountService');
            this.$rootScope = $injector.get('$rootScope');
            this.ServiceAccountBuilder = $injector.get('ServiceAccountBuilder');
            this.ApiKeyBuilder = $injector.get('ApiKeyBuilder');
        });

        this.apiKey = new this.ApiKeyBuilder().build();
        this.serviceAccount = new this.ServiceAccountBuilder()
            .withToken(this.apiKey.token)
            .build();
    });

    describe('create', function() {

        it('should create service account', function() {
            spyOn(this.serviceAccountService, 'create').andReturn(this.$q.resolve(this.serviceAccount));
            spyOn(this.apiKeysService, 'create').andReturn(this.$q.resolve(this.apiKey));

            var result;
            this.serviceAccountFactory
                .create()
                .then(function(data) {
                    result = data;
                });
            this.$rootScope.$apply();

            expect(result.token).toEqual(this.serviceAccount.token);
            expect(this.serviceAccountService.create).toHaveBeenCalledWith(this.apiKey.token);
            expect(this.apiKeysService.create).toHaveBeenCalled();
        });
    });

    describe('remove', function() {

        it('should remove service account', function() {
            spyOn(this.serviceAccountService, 'remove').andReturn(this.$q.resolve());
            spyOn(this.apiKeysService, 'remove').andReturn(this.$q.resolve());

            this.serviceAccountFactory.remove(this.serviceAccount.token);
            this.$rootScope.$apply();

            expect(this.serviceAccountService.remove).toHaveBeenCalledWith(this.serviceAccount.token);
            expect(this.apiKeysService.remove).toHaveBeenCalledWith(this.serviceAccount.token);
        });
    });
});
