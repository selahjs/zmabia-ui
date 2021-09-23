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

describe('AdminSupplyPartnerAddService', function() {

    beforeEach(function() {
        module('admin-supply-partner-add');

        inject(function($injector) {
            this.AdminSupplyPartnerAddService = $injector.get('AdminSupplyPartnerAddService');
            this.SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            this.SupplyPartner = $injector.get('SupplyPartner');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.confirmService = $injector.get('confirmService');
        });

        this.supplyPartner = new this.SupplyPartnerDataBuilder().buildWithAssociations();
        this.adminSupplyPartnerAddService = new this.AdminSupplyPartnerAddService();

        spyOn(this.SupplyPartner.prototype, 'create').andReturn(this.$q.when(this.supplyPartner));
        spyOn(this.loadingModalService, 'open');
        spyOn(this.loadingModalService, 'close');
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');
        spyOn(this.confirmService, 'confirm').andReturn(this.$q.resolve());
        spyOn(this.$state, 'go');
    });

    describe('initSupplyPartner', function() {

        it('should init supply partner', function() {
            var expected = JSON.stringify({
                associations: []
            });
            var actual;

            this.adminSupplyPartnerAddService.initSupplyPartner()
                .then(function(supplyPartner) {
                    actual = JSON.stringify(supplyPartner, function(key, value) {
                        // to avoid converting repository inside the object
                        return key === 'repository' ? undefined : value;
                    });
                });

            this.$rootScope.$apply();

            expect(actual).toEqual(expected);
        });

    });

    describe('decoratedCreate', function() {

        beforeEach(function() {
            var suite = this;

            this.adminSupplyPartnerAddService.initSupplyPartner()
                .then(function(supplyPartner) {
                    suite.createdSupplyPartner = supplyPartner;
                });

            this.$rootScope.$apply();
        });

        it('should open loading modal', function() {
            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should leave closing loading modal to the state change after successfully saving', function() {
            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should close loading modal after failing to create', function() {
            this.SupplyPartner.prototype.create.andReturn(this.$q.reject());

            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should reject with original error if create fails', function() {
            var error = 'Some error message';
            this.SupplyPartner.prototype.create.andReturn(this.$q.reject(error));

            var result;
            this.createdSupplyPartner.create()
                .catch(function(error) {
                    result = error;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(error);
        });

        it('should resolve to supply partner if create succeed', function() {
            var result;
            this.createdSupplyPartner.create()
                .then(function(response) {
                    result = response;
                });

            this.$rootScope.$apply();

            expect(result).toEqual(this.supplyPartner);
        });

        it('should show successful notification on success', function() {
            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.notificationService.success)
                .toHaveBeenCalledWith('adminSupplyPartnerAdd.message.supplyPartnerHasBeenSaved');
        });

        it('should prompt user to add associations', function() {
            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'adminSupplyPartnerAdd.message.doYouWantToAddAssociations',
                'adminSupplyPartnerAdd.button.yesAddAssociation',
                'adminSupplyPartnerAdd.button.no'
            );
        });

        it('should open loading modal if user refuses to add associations', function() {
            this.confirmService.confirm.andReturn(this.$q.reject());
            this.createdSupplyPartner.create();

            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should take to the user to add associations page if user agrees to it', function() {
            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith(
                'openlmis.administration.supplyPartners.edit', {
                    id: this.supplyPartner.id
                }
            );
        });

        it('should not error notification on success', function() {
            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.notificationService.error).not.toHaveBeenCalled();
        });

        it('should show error notification', function() {
            this.SupplyPartner.prototype.create.andReturn(this.$q.reject());

            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.notificationService.error)
                .toHaveBeenCalledWith('adminSupplyPartnerAdd.message.failedToSaveSupplyPartner');
        });

        it('should not show successful notification on failure', function() {
            this.SupplyPartner.prototype.create.andReturn(this.$q.reject());

            this.createdSupplyPartner.create();
            this.$rootScope.$apply();

            expect(this.notificationService.success).not.toHaveBeenCalled();
        });

    });

});
