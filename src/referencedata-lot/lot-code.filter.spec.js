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

describe('lotCode filter', function() {

    var NO_LOT_DEFINED = 'No Lot Defined';

    var $filter, messageService, LotDataBuilder;

    beforeEach(function() {
        module('referencedata-lot');

        inject(function($injector) {
            $filter = $injector.get('$filter');
            messageService = $injector.get('messageService');
            LotDataBuilder = $injector.get('LotDataBuilder');
        });

        spyOn(messageService, 'get').andReturn(NO_LOT_DEFINED);
    });

    it('should return lot code if lot was given', function() {
        var lot = new LotDataBuilder().build();

        var result = $filter('lotCode')(lot);

        expect(result).toBe(lot.lotCode);
    });

    it('should return No Lot Defined if undefined was passed', function() {
        expect($filter('lotCode')(undefined)).toEqual(NO_LOT_DEFINED);
    });

});
