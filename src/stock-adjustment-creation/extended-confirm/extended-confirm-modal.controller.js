(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name stock-adjustment-creation.controller:ExtendedConfirmModalController
     *
     * @description
     * Manages the extended confirmation modal.
     */
    angular
        .module('stock-adjustment-creation')
        .controller('ExtendedConfirmModalController', controller);

    controller.$inject = [
        'message', 'confirmMessage', 'cancelMessage', 'titleMessage', 
        'additionalData', 'confirmDeferred', 'modalDeferred', '$scope'
    ];

    function controller(message, confirmMessage, cancelMessage, titleMessage, 
                       additionalData, confirmDeferred, modalDeferred, $scope) {
        var vm = this;

        vm.message = message;
        vm.confirmMessage = confirmMessage;
        vm.cancelMessage = cancelMessage;
        vm.titleMessage = titleMessage;
        vm.data = angular.copy(additionalData);
        
        // Default values for the three steps
        vm.currentStep = 1;
        vm.totalSteps = 3;
        
        // Methods
        vm.confirm = confirm;
        vm.cancel = cancel;
        vm.nextStep = nextStep;
        vm.prevStep = prevStep;
        vm.isFirstStep = isFirstStep;
        vm.isLastStep = isLastStep;

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:ExtendedConfirmModalController
         * @name confirm
         *
         * @description
         * Resolves the promise with the collected data.
         */
        function confirm() {
            console.log(vm.data);
            // confirmDeferred.resolve();
            confirmDeferred.resolve(vm.data);
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:ExtendedConfirmModalController
         * @name cancel
         *
         * @description
         * Rejects the promise.
         */
        function cancel() {
            confirmDeferred.reject();
            modalDeferred.resolve();
        }
        
        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:ExtendedConfirmModalController
         * @name nextStep
         *
         * @description
         * Moves to the next step in the wizard.
         */
        function nextStep() {
            if (vm.currentStep < vm.totalSteps) {
                vm.currentStep++;
            }
        }
        
        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:ExtendedConfirmModalController
         * @name prevStep
         *
         * @description
         * Moves to the previous step in the wizard.
         */
        function prevStep() {
            if (vm.currentStep > 1) {
                vm.currentStep--;
            }
        }
        
        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:ExtendedConfirmModalController
         * @name isFirstStep
         *
         * @description
         * Checks if the current step is the first step.
         */
        function isFirstStep() {
            return vm.currentStep === 1;
        }
        
        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:ExtendedConfirmModalController
         * @name isLastStep
         *
         * @description
         * Checks if the current step is the last step.
         */
        function isLastStep() {
            return vm.currentStep === vm.totalSteps;
        }
    }
})();
