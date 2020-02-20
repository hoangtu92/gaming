gamingApp.factory('$infoModal', function ($uibModal) {
    return {
        open: function (errorMessage) {
            $uibModal.open({
                templateUrl: 'includes/modals/info.htm',
                controller: function ($scope, message, $uibModalInstance) {
                    var vm = this;
                    vm.message = message;
                    vm.close = function () {
                        $uibModalInstance.dismiss();
                    }
                },
                controllerAs: "vm",
                size: 'lg',
                resolve: {
                    message: function () {
                        return errorMessage;
                    }
                }
            });
        }
    }
});