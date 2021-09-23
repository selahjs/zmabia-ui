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

describe('OrderableProgramEditController', function() {

    beforeEach(function() {
        module('admin-orderable-program-edit', function($provide) {
            $provide.service('notificationService', function() {
                return jasmine.createSpyObj('notificationService', ['success', 'error']);
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.confirmService = $injector.get('confirmService');
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.ProgramOrderableDataBuilder = $injector.get('ProgramOrderableDataBuilder');
            this.OrderableDisplayCategoryDataBuilder = $injector.get('OrderableDisplayCategoryDataBuilder');
            this.OrderableResource = $injector.get('OrderableResource');
            this.$rootScope = $injector.get('$rootScope');
            this.FunctionDecorator = $injector.get('FunctionDecorator');
        });

        this.filteredPrograms = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.programsMap = {};
        this.programsMap[this.filteredPrograms[0].id] = this.filteredPrograms[0];
        this.programsMap[this.filteredPrograms[1].id] = this.filteredPrograms[1];

        this.orderable = new this.OrderableDataBuilder()
            .withPrograms([
                new this.ProgramOrderableDataBuilder()
                    .withProgramId(this.filteredPrograms[0].id)
                    .buildJson(),
                new this.ProgramOrderableDataBuilder()
                    .withProgramId(this.filteredPrograms[1].id)
                    .buildJson()
            ])
            .build();

        this.orderableDisplayCategories = [
            new this.OrderableDisplayCategoryDataBuilder().build(),
            new this.OrderableDisplayCategoryDataBuilder().build(),
            new this.OrderableDisplayCategoryDataBuilder().build()
        ];

        this.programOrderable = this.orderable.programs[0];
        this.successNotificationKey = 'successMessage.key';
        this.errorNotificationKey = 'errorMessage.key';
        this.editMode = true;

        spyOn(this.$state, 'go');
        spyOn(this.OrderableResource.prototype, 'update').andReturn(this.$q.resolve(this.orderable));
        spyOn(this.FunctionDecorator.prototype, 'withSuccessNotification').andCallThrough();
        spyOn(this.FunctionDecorator.prototype, 'withErrorNotification').andCallThrough();

        this.vm = this.$controller('OrderableProgramEditController', {
            orderable: this.orderable,
            programOrderable: this.programOrderable,
            filteredPrograms: this.filteredPrograms,
            canEdit: this.canEdit,
            orderableDisplayCategories: this.orderableDisplayCategories,
            editMode: this.editMode,
            successNotificationKey: this.successNotificationKey,
            errorNotificationKey: this.errorNotificationKey,
            programsMap: this.programsMap
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose orderable', function() {
            expect(this.vm.orderable).toEqual(this.orderable);
        });

        it('should expose program orderable', function() {
            expect(this.vm.programOrderable).toEqual(this.orderable.programs[0]);
        });

        it('should expose filteredPrograms', function() {
            expect(this.vm.filteredPrograms).toEqual(this.filteredPrograms);
        });

        it('should expose programs map', function() {
            expect(this.vm.programsMap).toEqual(this.programsMap);
        });

        it('should expose orderable display categories', function() {
            expect(this.vm.orderableDisplayCategories).toEqual(this.orderableDisplayCategories);
        });

        it('should decorate with correct success message', function() {
            expect(this.FunctionDecorator.prototype.withSuccessNotification)
                .toHaveBeenCalledWith(this.successNotificationKey);
        });

        it('should decorate with correct error message', function() {
            expect(this.FunctionDecorator.prototype.withErrorNotification)
                .toHaveBeenCalledWith(this.errorNotificationKey);
        });

    });

    describe('saveProgramOrderable', function() {

        it('should save program orderable', function() {
            this.vm.saveProgramOrderable();
            this.$rootScope.$apply();

            expect(this.OrderableResource.prototype.update).toHaveBeenCalledWith(this.orderable);
        });

        it('should redirect to the previous state on success', function() {
            this.vm.saveProgramOrderable();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalled();
        });

        it('should not redirect to the previous state on failure', function() {
            this.OrderableResource.prototype.update.andReturn(this.$q.reject());

            this.vm.saveProgramOrderable();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });

    });
});