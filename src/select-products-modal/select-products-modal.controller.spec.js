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

describe('SelectProductsModalController', function() {

    beforeEach(function() {
        module('referencedata-orderable');
        module('select-products-modal');

        //Polyfill snippet as our version of PhantomJS doesn't support startsWith yet
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(search, pos) {
                return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
            };
        }

        var OrderableDataBuilder;
        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.alertService = $injector.get('alertService');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });

        this.modalDeferred = this.$q.defer();

        this.products = [
            new OrderableDataBuilder()
                .withFullProductName('Product One')
                .withProductCode('PC1')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Product Two pc2')
                .withProductCode('PS1')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Product Three')
                .withProductCode('XB1')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Product Four')
                .withProductCode('N64')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('undefined')
                .withProductCode('undefined')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Counter Something')
                .withProductCode('Co1')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Another product')
                .withProductCode('Code Name')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Some Product')
                .withProductCode('CD1')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Same Product')
                .withProductCode('AME1')
                .build()
        ];

        spyOn(this.alertService, 'error');

        this.vm = this.$controller('SelectProductsModalController', {
            modalDeferred: this.modalDeferred,
            products: this.products
        });

        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose requisitionLineItems', function() {
            expect(this.vm.products).toEqual(this.products);
        });

        it('should expose this.modalDeferred.reject method', function() {
            expect(this.vm.close).toBe(this.modalDeferred.reject);
        });

        it('should initialize selection object', function() {
            expect(this.vm.selections).toEqual({});
        });
    });

    describe('selectProducts', function() {

        it('should resolve to selected this.products', function() {
            this.vm.selections[this.products[0].id] = true;
            this.vm.selections[this.products[2].id] = true;

            var result;
            this.modalDeferred.promise
                .then(function(response) {
                    result = response;
                });

            this.vm.selectProducts();
            this.$rootScope.$apply();

            expect(result).toEqual([
                this.products[0],
                this.products[2]
            ]);
        });

        it('should show error modal if no products were selected', function() {
            this.vm.selectProducts();
            this.$rootScope.$apply();

            expect(this.alertService.error).toHaveBeenCalledWith('selectProductsModal.addProducts.emptyList');
        });
    });

    describe('search', function() {

        it('should show all for empty filter', function() {
            this.vm.searchText = '';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual(this.products);
        });

        it('should show all for undefined', function() {
            this.vm.searchText = undefined;

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual(this.products);
        });

        it('should show all for null', function() {
            this.vm.searchText = null;

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual(this.products);
        });

        it('should only return codes starting with the search text', function() {
            this.vm.searchText = 'Ps';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual([this.products[1]]);

            this.vm.searchText = '1';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual([]);
        });

        it('should only return defined full product name', function() {
            this.vm.searchText = 'mC1';

            this.vm.search();

            expect(this.products[4].withFullProductName).toBeUndefined();
        });

        it('should only return defined product codes', function() {
            this.vm.searchText = 'mC1';

            this.vm.search();

            expect(this.products[4].withProductCode).toBeUndefined();
        });

        it('should return result for search text of both product codes and full product name', function() {
            this.vm.searchText = 'co';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual([this.products[5], this.products[6]]);

        });

        it('should return empty list if no matches found', function() {
            this.vm.searchText = 'po';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual([]);

        });

        it('should return result with either product code or full product name', function() {
            this.vm.searchText = 'ame';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual([this.products[8]]);

        });

    });

});
