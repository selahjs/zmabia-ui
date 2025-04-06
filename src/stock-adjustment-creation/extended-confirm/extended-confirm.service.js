(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name stock-adjustment-creation.extendedConfirmService
     *
     * @description
     * Service extends the standard confirmation modal with additional fields.
     */
    angular
        .module('stock-adjustment-creation')
        .service('extendedConfirmService', extendedConfirmService);

    extendedConfirmService.$inject = ['openlmisModalService', '$q', 'messageService'];

    function extendedConfirmService(openlmisModalService, $q, messageService) {
        this.showExtendedConfirm = showExtendedConfirm;

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.extendedConfirmService
         * @name showExtendedConfirm
         *
         * @description
         * Shows an extended confirmation modal with additional fields.
         *
         * @param  {Object}  options     Options for the modal:
         *                              - message: The confirmation message
         *                              - buttonMessage: The text for the confirm button
         *                              - additionalData: Any additional data to pass to the modal
         * @return {Promise}            Promise that resolves with the collected data
         */
        function showExtendedConfirm(options) {
            var deferred = $q.defer();

            openlmisModalService.createDialog({
                templateUrl: 'stock-adjustment-creation/extended-confirm/extended-confirm-modal.html',
                controller: 'ExtendedConfirmModalController',
                controllerAs: 'vm',
                resolve: {
                    message: function() {
                        return options.message;
                    },
                    confirmMessage: function() {
                        return options.buttonMessage || 'openlmisModal.ok';
                    },
                    cancelMessage: function() {
                        return options.cancelMessage || 'openlmisModal.cancel';
                    },
                    titleMessage: function() {
                        return options.titleMessage || messageService.get('extendedConfirm.title');
                    },
                    additionalData: function() {
                        return options.additionalData || {};
                    },
                    confirmDeferred: function() {
                        return deferred;
                    }
                }
            });

            return deferred.promise;
        }
    }
})();