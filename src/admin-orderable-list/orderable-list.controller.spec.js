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

describe('OrderableListController', function() {

    beforeEach(function() {
        module('referencedata-program');
        module('admin-orderable-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.orderables = [
            new this.OrderableDataBuilder()
                .withPrograms([
                    this.programs[0],
                    this.programs[1]
                ])
                .build(),
            new this.OrderableDataBuilder()
                .withPrograms([
                    this.programs[0]
                ])
                .build()
        ];

        this.stateParams = {
            page: 0,
            size: 10,
            code: 'code',
            name: 'product',
            program: this.programs[0].id
        };

        this.vm = this.$controller('OrderableListController', {
            orderables: this.orderables,
            programs: this.programs,
            $stateParams: this.stateParams,
            canAdd: true
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose search method', function() {
            expect(angular.isFunction(this.vm.search)).toBe(true);
        });

        it('should expose orderables array', function() {
            expect(this.vm.orderables).toEqual(this.orderables);
        });

        it('should expose programs array', function() {
            expect(this.vm.programs).toEqual(this.programs);
        });

        it('should expose code', function() {
            expect(this.vm.code).toEqual(this.stateParams.code);
        });

        it('should expose name', function() {
            expect(this.vm.name).toEqual(this.stateParams.name);
        });

        it('should expose program', function() {
            expect(this.vm.program).toEqual(this.stateParams.program);
        });
    });

    describe('search', function() {

        it('should set code param', function() {
            this.vm.code = 'some-code';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.orderables', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                code: 'some-code',
                name: this.stateParams.name,
                program: this.stateParams.program
            }, {
                reload: true
            });
        });

        it('should set name param', function() {
            this.vm.name = 'some-name';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.orderables', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                code: this.stateParams.code,
                name: 'some-name',
                program: this.stateParams.program
            }, {
                reload: true
            });
        });

        it('should set name description', function() {
            this.vm.program = 'some-program';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.orderables', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                code: this.stateParams.code,
                name: this.stateParams.name,
                program: 'some-program'
            }, {
                reload: true
            });
        });

        it('should call state go method', function() {
            this.vm.search();

            expect(this.$state.go).toHaveBeenCalled();
        });
    });
});
