(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-auth.Right
     *
     * @description
     * Represents a single right along with related programs, warehouses and supervisory nodes.
     */
    angular
        .module('openlmis-auth')
        .factory('Right', factory);

    factory.$inject = [];

    function factory() {

        Right.buildRights = buildRights;

        return Right;

        /**
         * @ngdoc function
         * @methodOf openlmis-auth.Right
         * @name constructor
         *
         * @description
         * Creates a Right class object.
         *
         * @param {String}  id          the id of the Right
         * @param {String}  name        the name of the Right
         * @param {Array}   programs    the list of related programs
         * @param {Array}   facilities  the list of related warehouses
         * @param {Array}   nodes       the list of related supervisory nodes
         */
        function Right(id, name, programCodes, programIds, warehouseCodes, warehouseIds, nodeCodes, nodeIds, isDirect) {
            this.id = id;
            this.name = name;
            this.programCodes = programCodes;
            this.programIds = programIds
            this.warehouseCodes = warehouseCodes;
            this.warehouseIds = warehouseIds;
            this.supervisoryNodeCodes = nodeCodes;
            this.supervisoryNodeIds = nodeIds;
            this.isDirect = isDirect;
        }

        /**
         * @ngdoc methodOf
         * @methodOf openlmis-auth.Right
         * @name buildRights
         *
         * @description
         * Builds a list or rights from the given list of role assignments.
         *
         * @param  {Array}  assignments the list of role assignments
         * @return {Array}              the list of user rights
         */
        function buildRights(assignments) {
            var rights = {};

            assignments.forEach(function(assignment) {
                assignment.role.rights.forEach(function(rightObj) {
                    var name = rightObj.name;

                    var right;
                    if (!rights[name]) {
                        right = {
                            id: rightObj.id,
                            programCode: [],
                            programId: [],
                            warehouseCode: [],
                            warehouseId: [],
                            supervisoryNodeCode: [],
                            supervisoryNodeId: []
                        };
                        rights[name] = right;
                    } else {
                        right = rights[name];
                    }

                    var isDirect = true;

                    [
                        'programCode', 'programId',
                        'warehouseCode', 'warehouseId',
                        'supervisoryNodeCode', 'supervisoryNodeId'
                    ]
                    .forEach(function(field) {
                        var fieldValue = assignment[field];
                        if (fieldValue) {
                            if (right[field].indexOf(fieldValue) === -1) {
                                right[field].push(fieldValue);
                            }
                            isDirect = false;
                        }
                    });

                    if (isDirect) {
                        right.isDirect = true;
                    }
                });
            });

            return toRightList(rights);
        }

        function toRightList(rights) {
            var rightList = [];
            for (var right in rights) {
                rightList.push(new Right(
                    rights[right].id,
                    right,
                    rights[right].programCode,
                    rights[right].programId,
                    rights[right].warehouseCode,
                    rights[right].warehouseId,
                    rights[right].supervisoryNodeCode,
                    rights[right].supervisoryNodeId,
                    rights[right].isDirect
                ));
            }
            return rightList;
        }

    }

})();
