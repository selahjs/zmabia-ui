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

describe('orderableFactory', function() {

    beforeEach(function() {
        module('referencedata-orderable');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.orderableFactory = $injector.get('orderableFactory');
            this.programService = $injector.get('programService');
            this.orderableService = $injector.get('orderableService');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.ProgramOrderableDataBuilder = $injector.get('ProgramOrderableDataBuilder');
        });

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.orderable = new this.OrderableDataBuilder()
            .withPrograms([
                new this.ProgramOrderableDataBuilder()
                    .withProgramId(this.programs[0].id)
                    .buildJson(),
                new this.ProgramOrderableDataBuilder().buildJson()
            ])
            .build();

        spyOn(this.orderableService, 'get').andReturn(this.$q.when(this.orderable));
        spyOn(this.programService, 'getAll').andReturn(this.$q.when(this.programs));
    });

    describe('getOrderableWithProgramData', function() {

        beforeEach(function() {
            var suite = this;
            this.orderableFactory.getOrderableWithProgramData(this.orderable.id)
                .then(function(orderables) {
                    suite.result = orderables;
                });
            this.$rootScope.$apply();
        });

        it('should get programs', function() {
            expect(this.programService.getAll).toHaveBeenCalled();
        });

        it('should get orderable', function() {
            expect(this.orderableService.get).toHaveBeenCalledWith(this.orderable.id);
        });

        it('should return orderable', function() {
            expect(this.result.id).toEqual(this.orderable.id);
        });

        it('should assign program if exists', function() {
            expect(this.result.programs[0].$program).toEqual(this.programs[0]);
        });

        it('should not assign program if does not exists', function() {
            expect(this.result.programs[1].$program).toBeUndefined();
        });
    });
});
