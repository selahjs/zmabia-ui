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

describe('OrderableEditProgramsController', function() {

    beforeEach(function() {
        module('admin-orderable-edit', function($provide) {
            $provide.service('notificationService', function() {
                return jasmine.createSpyObj('notificationService', ['success', 'error']);
            });
            $provide.service('confirmService', function() {
                return jasmine.createSpyObj('confirmService', ['confirm']);
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.OrderableResource = $injector.get('OrderableResource');
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.FunctionDecorator = $injector.get('FunctionDecorator');
            this.ProgramOrderableDataBuilder = $injector.get('ProgramOrderableDataBuilder');
        });

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.orderable = new this.OrderableDataBuilder()
            .withPrograms([
                new this.ProgramOrderableDataBuilder()
                    .withProgramId(this.programs[0].id)
                    .buildJson(),
                new this.ProgramOrderableDataBuilder()
                    .withProgramId(this.programs[1].id)
                    .buildJson()
            ])
            .build();

        this.programOrderables = this.orderable.programs;

        this.programsMap = {};
        this.programsMap[this.programs[0].id] = this.programs[0];
        this.programsMap[this.programs[1].id] = this.programs[1];
        this.programsMap[this.programs[2].id] = this.programs[2];

        this.successNotificationKey = 'adminOrderableEdit.programOrderableRemovedSuccessfully';
        this.errorNotificationKey = 'adminOrderableEdit.failedToRemoveProgramOrderable';
        this.confirmNotificationKey = 'adminOrderableEdit.confirmToRemoveProgramOrderable';

        spyOn(this.$state, 'reload').andReturn(true);
        spyOn(this.OrderableResource.prototype, 'update').andReturn(this.$q.resolve(this.programs[0]));
        spyOn(this.FunctionDecorator.prototype, 'withSuccessNotification').andCallThrough();
        spyOn(this.FunctionDecorator.prototype, 'withErrorNotification').andCallThrough();
        spyOn(this.FunctionDecorator.prototype, 'withConfirm').andCallThrough();
        var context = this;
        spyOn(this.FunctionDecorator.prototype, 'decorateFunction').andCallFake(function(fn) {
            context.fn = fn;
            return this;
        });

        spyOn(this.FunctionDecorator.prototype, 'getDecoratedFunction').andCallFake(function() {
            return context.fn;
        });

        this.vm = this.$controller('OrderableEditProgramsController', {
            programOrderables: this.programOrderables,
            programsMap: this.programsMap,
            canEdit: this.canEdit,
            orderable: this.orderable
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose program Orderables', function() {
            expect(this.vm.programOrderables).toEqual(this.programOrderables);
        });

        it('should expose programs map', function() {
            expect(this.vm.programsMap).toEqual(this.programsMap);
        });

        it('should expose can edit', function() {
            expect(this.vm.canEdit).toEqual(this.canEdit);
        });

        it('should expose orderable', function() {
            expect(this.vm.orderable).toEqual(this.orderable);
        });

        it('should decorate with confirm message', function() {
            expect(this.FunctionDecorator.prototype.withConfirm)
                .toHaveBeenCalledWith(this.confirmNotificationKey);
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

    describe('removeProgramOrderable', function() {

        it('should remove program orderable', function() {
            this.vm.removeProgramOrderable(this.programOrderables[0]);
            this.$rootScope.$apply();

            expect(this.OrderableResource.prototype.update).toHaveBeenCalledWith(this.orderable);
        });

        it('should redirect to the list view on success', function() {
            this.vm.removeProgramOrderable(this.programOrderables[0]);
            this.$rootScope.$apply();

            expect(this.$state.reload).toHaveBeenCalled();
        });

        it('should not redirect to the list view on failure', function() {
            this.OrderableResource.prototype.update.andReturn(this.$q.reject());

            this.vm.removeProgramOrderable(this.orderable.programs[0]);
            this.$rootScope.$apply();

            expect(this.$state.reload).not.toHaveBeenCalled();
        });
    });
});