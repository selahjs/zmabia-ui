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

describe('OrderableFulfillsResource', function() {

    beforeEach(function() {
        module('referencedata-orderable-fulfills');

        inject(function($injector) {
            this.OrderableFulfillsResource = $injector.get('OrderableFulfillsResource');
            this.ParameterSplitter = $injector.get('ParameterSplitter');
            this.$httpBackend = $injector.get('$httpBackend');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });

        spyOn(this.ParameterSplitter.prototype, 'split');

        this.orderableFulfillsResource = new this.OrderableFulfillsResource();

        this.params = {
            some: [
                'paramOne',
                'paramTwo'
            ]
        };

        this.ParameterSplitter.prototype.split.andReturn([{
            some: ['paramOne']
        }, {
            some: ['paramTwo']
        }]);

        this.responseOne = {
            idOne: ['idTwo', 'idThree']
        };

        this.responseTwo = {
            idFour: ['ifFive', 'idSix']
        };
    });

    describe('query', function() {

        it('should return response if only one request was sent', function() {
            var params = {
                some: 'param'
            };

            this.ParameterSplitter.prototype.split.andReturn([params]);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/orderableFulfills?some=param'))
                .respond(200, this.responseOne);

            var result;
            this.orderableFulfillsResource.query(params)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.responseOne));
        });

        it('should reject if any of the requests fails', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/orderableFulfills?some=paramOne'))
                .respond(200, this.responseOne);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/orderableFulfills?some=paramTwo'))
                .respond(500);

            var rejected;
            this.orderableFulfillsResource.query(this.params)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should return merged responses if multiple requests were sent', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/orderableFulfills?some=paramOne'))
                .respond(200, this.responseOne);

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/orderableFulfills?some=paramTwo'))
                .respond(200, this.responseTwo);

            var result;
            this.orderableFulfillsResource.query(this.params)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson({
                idOne: ['idTwo', 'idThree'],
                idFour: ['ifFive', 'idSix']
            }));
        });

    });
});