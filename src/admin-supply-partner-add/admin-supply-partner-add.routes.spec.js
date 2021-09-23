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

describe('openlmis.administration.supplyPartners.add state', function() {

    'use strict';

    beforeEach(function() {
        module('admin-supply-partner-add');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.$templateCache = $injector.get('$templateCache');
            this.paginationService = $injector.get('paginationService');
            this.AdminSupplyPartnerAddService = $injector.get('AdminSupplyPartnerAddService');
            this.SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
        });

        this.supplyPartner = new this.SupplyPartnerDataBuilder().build();

        spyOn(this.$templateCache, 'get').andCallThrough();
        spyOn(this.paginationService, 'registerUrl').andReturn(this.$q.when());
        spyOn(this.AdminSupplyPartnerAddService.prototype, 'initSupplyPartner').andReturn(this.supplyPartner);

        this.$location.url('/administration/supplyPartners/new');
        this.$rootScope.$apply();

        this.getResolvedValue = function(context, name) {
            return context.$state.$current.locals.globals[name];
        };
    });

    it('should be available under \'administration/supplyPartners/new\'', function() {
        expect(this.$state.current.name).toEqual('openlmis.administration.supplyPartners.add');
    });

    it('should use template', function() {
        expect(this.$templateCache.get).toHaveBeenCalledWith('admin-supply-partner-add/supply-partner-add.html');
    });

    it('should resolve supplyPartner', function() {
        expect(this.getResolvedValue(this, 'supplyPartner')).toEqual(this.supplyPartner);
    });

});
