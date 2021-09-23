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

describe('AdminSupervisoryNodeEditService', function() {

    beforeEach(function() {
        module('admin-supervisory-node-edit');

        inject(function($injector) {
            this.AdminSupervisoryNodeEditService = $injector.get('AdminSupervisoryNodeEditService');
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.SupervisoryNodeRepository = $injector.get('SupervisoryNodeRepository');
            this.SupervisoryNode = $injector.get('SupervisoryNode');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.confirmService = $injector.get('confirmService');
            this.$state = $injector.get('$state');
        });

        this.supervisoryNode = new this.SupervisoryNodeDataBuilder()
            .withChildNodes()
            .withPartnerNodes()
            .build();
        this.supervisoryNodeId = this.supervisoryNode.id;
        this.adminSupervisoryNodeEditService = new this.AdminSupervisoryNodeEditService();

        spyOn(this.SupervisoryNodeRepository.prototype, 'get').andReturn();
        spyOn(this.SupervisoryNode.prototype, 'save');
        spyOn(this.SupervisoryNode.prototype, 'removeChildNode');
        spyOn(this.SupervisoryNode.prototype, 'removePartnerNode');
        spyOn(this.loadingModalService, 'open');
        spyOn(this.loadingModalService, 'close');
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');
        spyOn(this.confirmService, 'confirmDestroy');
        spyOn(this.$state, 'go');
    });

    describe('getSupervisoryNode', function() {

        it('should fetch supervisory node', function() {
            this.SupervisoryNodeRepository.prototype.get.andReturn(this.$q.resolve(this.supervisoryNode));

            this.adminSupervisoryNodeEditService.getSupervisoryNode(this.supervisoryNodeId);

            expect(this.SupervisoryNodeRepository.prototype.get).toHaveBeenCalledWith(this.supervisoryNodeId);
        });

        it('should resolve to supervisory node when supervisory node is fetched', function() {
            this.SupervisoryNodeRepository.prototype.get.andReturn(this.$q.resolve(this.supervisoryNode));

            var result;
            this.adminSupervisoryNodeEditService
                .getSupervisoryNode(this.supervisoryNodeId)
                .then(function(supervisoryNode) {
                    result = supervisoryNode;
                });
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.supervisoryNode));
        });

        it('should reject if failed to be fetched', function() {
            this.SupervisoryNodeRepository.prototype.get.andReturn(this.$q.reject());

            var rejected;
            this.adminSupervisoryNodeEditService
                .getSupervisoryNode(this.supervisoryNodeId)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should decorate methods', function() {
            var originalSave = this.supervisoryNode.save,
                originalRemoveChildNode = this.supervisoryNode.removeChildNode;

            this.SupervisoryNodeRepository.prototype.get.andReturn(this.$q.resolve(this.supervisoryNode));

            var result;
            this.adminSupervisoryNodeEditService
                .getSupervisoryNode(this.supervisoryNodeId)
                .then(function(supervisoryNode) {
                    result = supervisoryNode;
                });
            this.$rootScope.$apply();

            expect(result.save).not.toBe(originalSave);
            expect(result.removeChildNode).not.toBe(originalRemoveChildNode);
        });

    });

    describe('decoratedSave', function() {

        beforeEach(function() {
            this.SupervisoryNodeRepository.prototype.get.andReturn(this.$q.resolve(this.supervisoryNode));
            this.SupervisoryNode.prototype.save.andReturn(this.$q.resolve(this.supervisoryNode));

            var suite = this;
            this.adminSupervisoryNodeEditService.getSupervisoryNode()
                .then(function(supervisoryNode) {
                    suite.supervisoryNode = supervisoryNode;
                });
            this.$rootScope.$apply();
        });

        it('should open loading modal', function() {
            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should leave closing of the loading modal to the state change', function() {
            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should close loading modal after failing to save', function() {
            this.SupervisoryNode.prototype.save.andReturn(this.$q.reject());

            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should reject with original error if save fails', function() {
            var error = 'Some error message';
            this.SupervisoryNode.prototype.save.andReturn(this.$q.reject(error));

            var result;
            this.supervisoryNode.save()
                .catch(function(error) {
                    result = error;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(error);
        });

        it('should resolve to supervisory node if save succeed', function() {
            var result;
            this.supervisoryNode.save()
                .then(function(supervisoryNode) {
                    result = supervisoryNode;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supervisoryNode);
        });

        it('should show successful notification on success', function() {
            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.notificationService.success)
                .toHaveBeenCalledWith('adminSupervisoryNodeEdit.supervisoryNodeUpdatedSuccessfully');
        });

        it('should not error notification on success', function() {
            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.notificationService.error).not.toHaveBeenCalled();
        });

        it('should show error notification', function() {
            this.SupervisoryNode.prototype.save.andReturn(this.$q.reject());

            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.notificationService.error)
                .toHaveBeenCalledWith('adminSupervisoryNodeEdit.failedToUpdateSupervisoryNode');
        });

        it('should not show successful notification on failure', function() {
            this.SupervisoryNode.prototype.save.andReturn(this.$q.reject());

            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.notificationService.success).not.toHaveBeenCalled();
        });

        it('should take user to the View Supervisory Node view after saving is successful', function() {
            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.supervisoryNodes', {}, {
                reload: true
            });
        });

        it('should not take user to the View Supervisory Node view after failed save', function() {
            this.SupervisoryNode.prototype.save.andReturn(this.$q.reject());

            this.supervisoryNode.save();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });

    });

    describe('removeChildNode', function() {

        beforeEach(function() {
            this.SupervisoryNodeRepository.prototype.get.andReturn(this.$q.resolve(this.supervisoryNode));
            this.SupervisoryNode.prototype.save.andReturn(this.$q.resolve(this.supervisoryNode));
            this.confirmService.confirmDestroy.andReturn(this.$q.resolve());

            var suite = this;
            this.adminSupervisoryNodeEditService.getSupervisoryNode()
                .then(function(supervisoryNode) {
                    suite.supervisoryNode = supervisoryNode;
                });
            this.$rootScope.$apply();
        });

        it('should confirm removing', function() {
            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id);

            expect(this.confirmService.confirmDestroy).toHaveBeenCalledWith(
                'adminSupervisoryNodeEdit.confirmChildNodeRemoval',
                'adminSupervisoryNodeEdit.removeChildNode'
            );
        });

        it('should open loading modal after confirmation', function() {
            this.confirmService.confirmDestroy.andReturn(this.$q.resolve());

            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id);

            expect(this.loadingModalService.open).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should do nothing without confirmation', function() {
            this.confirmService.confirmDestroy.andReturn(this.$q.defer().promise);

            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id);

            expect(this.loadingModalService.open).not.toHaveBeenCalled();
            expect(this.SupervisoryNode.prototype.removeChildNode).not.toHaveBeenCalled();
        });

        it('should remove child node after confirmation', function() {
            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id);
            this.$rootScope.$apply();

            expect(this.SupervisoryNode.prototype.removeChildNode)
                .toHaveBeenCalledWith(this.supervisoryNode.childNodes[0].id);
        });

        it('should close loading modal on success', function() {
            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal on failure', function() {
            this.SupervisoryNode.prototype.removeChildNode.andThrow('Error message');

            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();

        });

        it('should reject with exception message if removing throws an exception', function() {
            var errorMessage = 'Error message';

            this.SupervisoryNode.prototype.removeChildNode.andThrow('Error message');

            var result;
            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id)
                .catch(function(errorMessage) {
                    result = errorMessage;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(errorMessage);
        });

        it('should resolve when successful', function() {
            var success;
            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id)
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should call original function with original arguments', function() {
            this.supervisoryNode.removeChildNode(this.supervisoryNode.childNodes[0].id);
            this.$rootScope.$apply();

            expect(this.SupervisoryNode.prototype.removeChildNode)
                .toHaveBeenCalledWith(this.supervisoryNode.childNodes[0].id);
        });

    });

    describe('removePartnerNode', function() {

        beforeEach(function() {
            this.SupervisoryNodeRepository.prototype.get.andReturn(this.$q.resolve(this.supervisoryNode));
            this.SupervisoryNode.prototype.save.andReturn(this.$q.resolve(this.supervisoryNode));
            this.confirmService.confirmDestroy.andReturn(this.$q.resolve());

            var suite = this;
            this.adminSupervisoryNodeEditService.getSupervisoryNode()
                .then(function(supervisoryNode) {
                    suite.supervisoryNode = supervisoryNode;
                });
            this.$rootScope.$apply();
        });

        it('should confirm removing', function() {
            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id);

            expect(this.confirmService.confirmDestroy).toHaveBeenCalledWith(
                'adminSupervisoryNodeEdit.confirmPartnerNodeRemoval',
                'adminSupervisoryNodeEdit.removePartnerNode'
            );
        });

        it('should open loading modal after confirmation', function() {
            this.confirmService.confirmDestroy.andReturn(this.$q.resolve());

            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id);

            expect(this.loadingModalService.open).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should do nothing without confirmation', function() {
            this.confirmService.confirmDestroy.andReturn(this.$q.defer().promise);

            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id);

            expect(this.loadingModalService.open).not.toHaveBeenCalled();
            expect(this.SupervisoryNode.prototype.removePartnerNode).not.toHaveBeenCalled();
        });

        it('should remove partner node after confirmation', function() {
            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id);
            this.$rootScope.$apply();

            expect(this.SupervisoryNode.prototype.removePartnerNode)
                .toHaveBeenCalledWith(this.supervisoryNode.partnerNodes[0].id);
        });

        it('should close loading modal on success', function() {
            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal on failure', function() {
            this.SupervisoryNode.prototype.removePartnerNode.andThrow('Error message');

            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();

        });

        it('should reject with exception message if removing throws an exception', function() {
            var errorMessage = 'Error message';

            this.SupervisoryNode.prototype.removePartnerNode.andThrow('Error message');

            var result;
            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id)
                .catch(function(errorMessage) {
                    result = errorMessage;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(errorMessage);
        });

        it('should resolve when successful', function() {
            var success;
            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id)
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should call original function with original arguments', function() {
            this.supervisoryNode.removePartnerNode(this.supervisoryNode.partnerNodes[0].id);
            this.$rootScope.$apply();

            expect(this.SupervisoryNode.prototype.removePartnerNode)
                .toHaveBeenCalledWith(this.supervisoryNode.partnerNodes[0].id);
        });

    });

});