gamingApp.factory('$infoModal', function ($uibModal) {
    return {
        open: function (errorMessage, cb, txt) {
            if(typeof txt === 'undefined') txt = "確認";
            $uibModal.open({
                templateUrl: 'includes/modals/info.htm',
                controller: function ($scope, message, $uibModalInstance) {
                    var vm = this;
                    vm.message = message;
                    vm.cb = cb;
                    vm.buttonText = txt;
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