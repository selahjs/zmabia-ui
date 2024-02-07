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

    angular
        .module('referencedata-facility-type')
        .factory('FacilityTypeDataBuilder', FacilityTypeDataBuilder);

    FacilityTypeDataBuilder.$inject = ['FacilityType'];

    function FacilityTypeDataBuilder(FacilityType) {

        FacilityTypeDataBuilder.prototype.build = build;
        FacilityTypeDataBuilder.buildDistrictHospital = buildAsDistrictHospital;
        FacilityTypeDataBuilder.buildDistrictStore = buildAsDistrictStore;
        FacilityTypeDataBuilder.buildAsInactive = buildAsInactive;
        FacilityTypeDataBuilder.prototype.withId = withId;
        FacilityTypeDataBuilder.prototype.withName = withName;
        FacilityTypeDataBuilder.prototype.withCode = withCode;
        FacilityTypeDataBuilder.prototype.withDisplayOrder = withDisplayOrder;
        FacilityTypeDataBuilder.prototype.withoutId = withoutId;
        FacilityTypeDataBuilder.prototype.deactivated = deactivated;
        FacilityTypeDataBuilder.prototype.isPrimaryHealthCare = isPrimaryHealthCare;

        return FacilityTypeDataBuilder;

        function FacilityTypeDataBuilder() {
            FacilityTypeDataBuilder.instanceNumber = (FacilityTypeDataBuilder.instanceNumber || 0) + 1;

            this.id = 'facility-type-id-' + FacilityTypeDataBuilder.instanceNumber;
            this.code = 'health_center';
            this.name = 'Health Center';
            this.description = 'description';
            this.displayOrder = 2;
            this.active = true;
            this.primaryHealthCare = false;
        }

        function buildAsDistrictHospital() {
            return new FacilityTypeDataBuilder()
                .withCode('dist_hosp')
                .withName('District Hospital')
                .withDisplayOrder(3)
                .build();
        }

        function buildAsDistrictStore() {
            return new FacilityTypeDataBuilder()
                .withCode('dist_store')
                .withName('District Store')
                .withDisplayOrder(4)
                .build();
        }

        function buildAsInactive() {
            return new FacilityTypeDataBuilder()
                .withCode('inactive_type')
                .withName('Inactive Type')
                .withDisplayOrder(5)
                .deactivated()
                .build();
        }

        function withId(id) {
            this.id = id;
            return this;
        }

        function withName(name) {
            this.name = name;
            return this;
        }

        function withCode(code) {
            this.code = code;
            return this;
        }

        function withDisplayOrder(displayOrder) {
            this.displayOrder = displayOrder;
            return this;
        }

        function withoutId() {
            this.id = undefined;
            return this;
        }

        function deactivated() {
            this.active = false;
            return this;
        }

        function isPrimaryHealthCare(primaryHealthCare) {
            this.primaryHealthCare = primaryHealthCare;
        }

        function build() {
            return new FacilityType(
                this.id,
                this.code,
                this.name,
                this.description,
                this.displayOrder,
                this.active,
                this.primaryHealthCare
            );
        }

    }

})();