(function() {
    'use strict';

    /**
     * @module custom-stockmanagement
     *
     * @description
     * Responsible for custom stockmanagement functionality.
     */
    angular.module('custom-stockmanagement', [
        'stockmanagement',
        'openlmis-i18n', // This includes the message service
        'openlmis-facility',
        'openlmis-templates',
        'openlmis-urls',
        'ui.router'
    ]);

})();