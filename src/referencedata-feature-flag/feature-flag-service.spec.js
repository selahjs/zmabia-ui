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

describe('FeatureFlagService', function() {

    beforeEach(function() {
        module('referencedata-feature-flag');

        inject(function($injector) {
            this.FeatureFlagService = $injector.get('FeatureFlagService');
            this.FeatureFlagResource = $injector.get('FeatureFlagResource');
            this.FeatureFlagDataBuilder = $injector.get('FeatureFlagDataBuilder');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.featureFlags = [
            new this.FeatureFlagDataBuilder()
                .enable()
                .buildJson(),
            new this.FeatureFlagDataBuilder()
                .disable()
                .buildJson()
        ];

        this.featureFlagService = new this.FeatureFlagService();

        spyOn(this.FeatureFlagResource.prototype, 'query').andReturn(this.$q.resolve(this.featureFlags));
    });

    describe('isEnabled', function() {

        it('should resolve to true if flag is enabled', function() {
            var enabled;

            this.featureFlagService.isEnabled(this.featureFlags[0].name)
                .then(function(response) {
                    enabled = response;
                });
            this.$rootScope.$apply();

            expect(enabled).toBeTruthy();
        });

        it('should resolve to false if flag is disabled', function() {
            var enabled;

            this.featureFlagService.isEnabled(this.featureFlags[1].name)
                .then(function(response) {
                    enabled = response;
                });
            this.$rootScope.$apply();

            expect(enabled).toBeFalsy();
        });
    });
});
