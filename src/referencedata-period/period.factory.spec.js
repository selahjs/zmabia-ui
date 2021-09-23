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

describe('periodFactory', function() {

    beforeEach(function() {
        module('referencedata-period');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.periodService = $injector.get('periodService');
            this.periodFactory = $injector.get('periodFactory');
            this.PeriodDataBuilder = $injector.get('PeriodDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.periods = [
            new this.PeriodDataBuilder().buildWithIsoStringsRandomDates(new Date('2017-12-12'), new Date('2017-12-12')),
            new this.PeriodDataBuilder().buildWithIsoStringsRandomDates(new Date('2017-11-12'), new Date('2017-11-12')),
            new this.PeriodDataBuilder().buildWithIsoStringsRandomDates(new Date('2017-10-12'), new Date('2017-10-12'))
        ];

        this.periodsPage = new this.PageDataBuilder()
            .withContent(this.periods)
            .build();

        this.scheduleId = 'schedule-id';

        this.params = {
            page: 1,
            size: 10
        };

        spyOn(this.periodService, 'query').andReturn(this.$q.resolve(this.periodsPage));
    });

    describe('getSortedPeriodsForSchedule', function() {

        it('should get sorted periods for schedule', function() {
            var result;
            this.periodFactory.getSortedPeriodsForSchedule(this.params, this.scheduleId)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(this.periodService.query).toHaveBeenCalledWith({
                page: 1,
                size: 10,
                processingScheduleId: this.scheduleId
            });

            expect(result.content[0].startDate instanceof Date).toBe(true);
            expect(result.content[1].startDate instanceof Date).toBe(true);
            expect(result.content[2].startDate instanceof Date).toBe(true);

            expect(result.content[0].endDate instanceof Date).toBe(true);
            expect(result.content[1].endDate instanceof Date).toBe(true);
            expect(result.content[2].endDate instanceof Date).toBe(true);
        });
    });

    describe('getNewStartDateForSchedule', function() {

        it('should get new start date for period', function() {
            var result;
            this.periodFactory.getNewStartDateForSchedule(this.scheduleId)
                .then(function(newStartDate) {
                    result = newStartDate;
                });
            this.$rootScope.$apply();

            expect(this.periodService.query).toHaveBeenCalledWith({
                page: 0,
                size: 1,
                processingScheduleId: this.scheduleId,
                sort: 'startDate,desc'
            });

            expect(result).toEqual(new Date('2017-12-13'));
        });

        it('should resolve to undefined if there is no period', function() {
            this.periodService.query.andReturn(this.$q.resolve(new this.PageDataBuilder().build()));

            var result;
            this.periodFactory.getNewStartDateForSchedule(this.scheduleId)
                .then(function(newStartDate) {
                    result = newStartDate;
                });
            this.$rootScope.$apply();

            expect(this.periodService.query).toHaveBeenCalledWith({
                page: 0,
                size: 1,
                processingScheduleId: this.scheduleId,
                sort: 'startDate,desc'
            });

            expect(result).toBe(undefined);
        });
    });
});
