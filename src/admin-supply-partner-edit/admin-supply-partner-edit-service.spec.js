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

describe('AdminSupplyPartnerEditService', function() {

    beforeEach(function() {
        module('admin-supply-partner-edit');

        inject(function($injector) {
            this.AdminSupplyPartnerEditService = $injector.get('AdminSupplyPartnerEditService');
            this.SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            this.SupplyPartnerRepository = $injector.get('SupplyPartnerRepository');
            this.SupplyPartner = $injector.get('SupplyPartner');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.confirmService = $injector.get('confirmService');
            this.$state = $injector.get('$state');
        });

        this.supplyPartner = new this.SupplyPartnerDataBuilder().buildWithAssociations();
        this.supplyPartnerId = this.supplyPartner.id;
        this.adminSupplyPartnerEditService = new this.AdminSupplyPartnerEditService();

        spyOn(this.SupplyPartnerRepository.prototype, 'get').andReturn();
        spyOn(this.SupplyPartner.prototype, 'save');
        spyOn(this.SupplyPartner.prototype, 'removeAssociation');
        spyOn(this.loadingModalService, 'open');
        spyOn(this.loadingModalService, 'close');
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');
        spyOn(this.confirmService, 'confirmDestroy');
        spyOn(this.$state, 'go');
    });

    describe('getSupplyPartner', function() {

        it('should fetch supply partner', function() {
            this.SupplyPartnerRepository.prototype.get.andReturn(this.$q.resolve(this.supplyPartner));

            this.adminSupplyPartnerEditService.getSupplyPartner(this.supplyPartnerId);

            expect(this.SupplyPartnerRepository.prototype.get).toHaveBeenCalledWith(this.supplyPartnerId);
        });

        it('should resolve to supply partner when supply partner is fetched', function() {
            this.SupplyPartnerRepository.prototype.get.andReturn(this.$q.resolve(this.supplyPartner));

            var result;
            this.adminSupplyPartnerEditService
                .getSupplyPartner(this.supplyPartnerId)
                .then(function(supplyPartner) {
                    result = supplyPartner;
                });
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.supplyPartner));
        });

        it('should reject if failed to be fetched', function() {
            this.SupplyPartnerRepository.prototype.get.andReturn(this.$q.reject());

            var rejected;
            this.adminSupplyPartnerEditService
                .getSupplyPartner(this.supplyPartnerId)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should decorate methods', function() {
            var originalSave = this.supplyPartner.save,
                originalRemoveChildNode = this.supplyPartner.removeAssociation;

            this.SupplyPartnerRepository.prototype.get.andReturn(this.$q.resolve(this.supplyPartner));

            var result;
            this.adminSupplyPartnerEditService
                .getSupplyPartner(this.supplyPartnerId)
                .then(function(supplyPartner) {
                    result = supplyPartner;
                });
            this.$rootScope.$apply();

            expect(result.save).not.toBe(originalSave);
            expect(result.removeAssociation).not.toBe(originalRemoveChildNode);
        });

    });

    describe('decoratedSave', function() {

        beforeEach(function() {
            this.SupplyPartnerRepository.prototype.get.andReturn(this.$q.resolve(this.supplyPartner));
            this.SupplyPartner.prototype.save.andReturn(this.$q.resolve(this.supplyPartner));

            var suite = this;
            this.adminSupplyPartnerEditService.getSupplyPartner()
                .then(function(supplyPartner) {
                    suite.supplyPartner = supplyPartner;
                });
            this.$rootScope.$apply();
        });

        it('should open loading modal', function() {
            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should leave closing of the loading modal to the state change', function() {
            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should close loading modal after failing to save', function() {
            this.SupplyPartner.prototype.save.andReturn(this.$q.reject());

            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should reject with original error if save fails', function() {
            var error = 'Some error message';
            this.SupplyPartner.prototype.save.andReturn(this.$q.reject(error));

            var result;
            this.supplyPartner.save()
                .catch(function(error) {
                    result = error;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(error);
        });

        it('should resolve to supply partner if save succeed', function() {
            var result;
            this.supplyPartner.save()
                .then(function(supplyPartner) {
                    result = supplyPartner;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supplyPartner);
        });

        it('should show successful notification on success', function() {
            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.notificationService.success)
                .toHaveBeenCalledWith('adminSupplyPartnerEdit.supplyPartnerUpdatedSuccessfully');
        });

        it('should not error notification on success', function() {
            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.notificationService.error).not.toHaveBeenCalled();
        });

        it('should show error notification', function() {
            this.SupplyPartner.prototype.save.andReturn(this.$q.reject());

            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.notificationService.error)
                .toHaveBeenCalledWith('adminSupplyPartnerEdit.failedToUpdateSupplyPartner');
        });

        it('should not show successful notification on failure', function() {
            this.SupplyPartner.prototype.save.andReturn(this.$q.reject());

            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.notificationService.success).not.toHaveBeenCalled();
        });

        it('should take user to the View Supervisory Node view after saving is successful', function() {
            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.supplyPartners', {}, {
                reload: true
            });
        });

        it('should not take user to the View Supervisory Node view after failed save', function() {
            this.SupplyPartner.prototype.save.andReturn(this.$q.reject());

            this.supplyPartner.save();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });

    });

    describe('removeAssociation', function() {

        beforeEach(function() {
            this.SupplyPartnerRepository.prototype.get.andReturn(this.$q.resolve(this.supplyPartner));
            this.SupplyPartner.prototype.save.andReturn(this.$q.resolve(this.supplyPartner));
            this.confirmService.confirmDestroy.andReturn(this.$q.resolve());

            var suite = this;
            this.adminSupplyPartnerEditService.getSupplyPartner()
                .then(function(supplyPartner) {
                    suite.supplyPartner = supplyPartner;
                });
            this.$rootScope.$apply();
        });

        it('should confirm removing', function() {
            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id);

            expect(this.confirmService.confirmDestroy).toHaveBeenCalledWith(
                'adminSupplyPartnerEdit.confirmAssociationRemoval',
                'adminSupplyPartnerEdit.removeAssociation'
            );
        });

        it('should open loading modal after confirmation', function() {
            this.confirmService.confirmDestroy.andReturn(this.$q.resolve());

            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id);

            expect(this.loadingModalService.open).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should do nothing without confirmation', function() {
            this.confirmService.confirmDestroy.andReturn(this.$q.defer().promise);

            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id);

            expect(this.loadingModalService.open).not.toHaveBeenCalled();
            expect(this.SupplyPartner.prototype.removeAssociation).not.toHaveBeenCalled();
        });

        it('should remove child node after confirmation', function() {
            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id);
            this.$rootScope.$apply();

            expect(this.SupplyPartner.prototype.removeAssociation)
                .toHaveBeenCalledWith(this.supplyPartner.associations[0].id);
        });

        it('should close loading modal on success', function() {
            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal on failure', function() {
            this.SupplyPartner.prototype.removeAssociation.andThrow('Error message');

            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();

        });

        it('should reject with exception message if removing throws an exception', function() {
            var errorMessage = 'Error message';

            this.SupplyPartner.prototype.removeAssociation.andThrow('Error message');

            var result;
            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id)
                .catch(function(errorMessage) {
                    result = errorMessage;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(errorMessage);
        });

        it('should resolve when successful', function() {
            var success;
            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id)
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should call original function with original arguments', function() {
            this.supplyPartner.removeAssociation(this.supplyPartner.associations[0].id);
            this.$rootScope.$apply();

            expect(this.SupplyPartner.prototype.removeAssociation)
                .toHaveBeenCalledWith(this.supplyPartner.associations[0].id);
        });

    });

});