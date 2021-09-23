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

describe('openlmis.administration.facilities.facility state', function() {

    'use strict';

    beforeEach(function() {
        module('admin-facility', function($stateProvider) {
            $stateProvider.state('openlmis.administration.facilities.facility.fake', {
                url: '/fake'
            });
        });

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.geographicZoneService = $injector.get('geographicZoneService');
            this.facilityService = $injector.get('facilityService');
            this.$q = $injector.get('$q');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
        });

        this.facilities = [
            new this.FacilityDataBuilder().build(),
            new this.FacilityDataBuilder().build()
        ];

        spyOn(this.geographicZoneService, 'getAll').andReturn(this.$q.when({
            content: []
        }));
        spyOn(this.facilityService, 'search').andReturn(this.$q.when({
            content: []
        }));

        this.$state.go('openlmis');
        this.$rootScope.$apply();

        this.goToUrl = function(url) {
            this.$location.url(url);
            this.$rootScope.$apply();
        };

        this.goToState = function() {
            this.$state.go.apply(this, arguments);
            this.$rootScope.$apply();
        };

        this.getResolvedValue = function(name) {
            return this.$state.$current.locals.globals[name];
        };
    });

    it('should resolve to facility if it was given', function() {
        this.goToState('openlmis.administration.facilities.facility.fake', {
            facility: this.facilities[0]
        });

        expect(this.$state.current.name).toEqual('openlmis.administration.facilities.facility.fake');
        expect(this.getResolvedValue('facility')).toEqual(this.facilities[0]);
    });

    it('should resolve to empty object', function() {
        this.goToUrl('/administration/facilities/new/fake');

        expect(this.$state.current.name).toEqual('openlmis.administration.facilities.facility.fake');
        expect(this.getResolvedValue('facility')).toEqual({});
    });

});
