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

describe('viewItemsModalService', function() {

    beforeEach(function() {
        module('admin-supply-partner-edit');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.viewItemsModalService = $injector.get('viewItemsModalService');
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
        });

        this.testTitleLabel = 'label.test';
        this.testItems = [
            new this.FacilityDataBuilder().buildJson(),
            new this.FacilityDataBuilder().buildJson()
        ];
        this.config = {
            titleLabel: this.testTitleLabel,
            items: this.testItems
        };

        this.dialogDeferred = this.$q.defer();
        this.dialog = {
            promise: this.dialogDeferred.promise
        };
    });

    describe('show', function() {

        describe('modal behavior', function() {

            beforeEach(function() {
                spyOn(this.openlmisModalService, 'createDialog').andReturn(this.dialog);
            });

            it('should not open second dialog if the first one is still open', function() {
                this.viewItemsModalService.show(this.config);
                this.viewItemsModalService.show(this.config);

                expect(this.openlmisModalService.createDialog.calls.length).toBe(1);
            });

            it('should close modal if dialog resolves', function() {
                this.viewItemsModalService.show(this.config);
                this.dialogDeferred.resolve();
                this.$rootScope.$apply();

                expect(this.openlmisModalService.createDialog.calls.length).toBe(1);

                this.viewItemsModalService.show(this.config);

                expect(this.openlmisModalService.createDialog.calls.length).toBe(2);
            });

            it('should close modal if dialog does not resolve', function() {
                this.viewItemsModalService.show(this.config);
                this.dialogDeferred.reject();
                this.$rootScope.$apply();

                expect(this.openlmisModalService.createDialog.calls.length).toBe(1);

                this.viewItemsModalService.show(this.config);

                expect(this.openlmisModalService.createDialog.calls.length).toBe(2);
            });
        });

        describe('resolves', function() {

            beforeEach(function() {
                spyOn(this.openlmisModalService, 'createDialog').andCallThrough();
            });

            it('should resolve title label from config object', function() {
                this.viewItemsModalService.show(this.config);

                expect(this.openlmisModalService.createDialog.calls[0].args[0].resolve['titleLabel'])
                    .toEqual(this.testTitleLabel);
            });

            it('should resolve default title label if title label not found in config object', function() {
                this.config.titleLabel = null;
                this.viewItemsModalService.show(this.config);

                expect(this.openlmisModalService.createDialog.calls[0].args[0].resolve['titleLabel'])
                    .toEqual('adminSupplyPartnerEdit.items');
            });
        });
    });
});
