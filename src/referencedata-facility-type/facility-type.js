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

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name referencedata-facility-type.FacilityType
     *
     * @description
     * Represents a single facility type.
     */
    angular
        .module('referencedata-facility-type')
        .factory('FacilityType', FacilityType);

    function FacilityType() {

        return FacilityType;

        /**
         * @ngdoc method
         * @methodOf referencedata-facility-type.FacilityType
         * @name FacilityType
         *
         * @description
         * Creates a new instance of the FacilityType class.
         *
         * @param  {String}  id             the UUID of the facility type to be created
         * @param  {String}  code           the code of the facility type to be created
         * @param  {String}  name           the name of the facility type to be created
         * @param  {String}  description    the description of the facility type to be created
         * @param  {Number}  displayOrder   the display order of the facility type to be created
         * @param  {Boolean} active         true if the facility type is active
         * @param  {boolean} primaryHealthCare true if the facility type is primary health care
         * @return {Object}                 the facility type object
         */
        function FacilityType(id, code, name, description, displayOrder, active, primaryHealthCare) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.description = description;
            this.displayOrder = displayOrder;
            this.active = active;
            this.primaryHealthCare = primaryHealthCare;
        }

    }

})();
