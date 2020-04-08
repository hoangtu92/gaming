gamingApp.factory('$infoModal', function ($uibModal) {
    return {
        open: function (errorMessage, cb, txt, cb2, txt2, hideCancel) {
            if(typeof txt === 'undefined') txt = "確認";
            if(typeof txt2 === 'undefined') txt2 = "取消";
            if(typeof hideCancel === 'undefined') hideCancel = false;
            return $uibModal.open({
                templateUrl: 'includes/modals/info.htm',
                controller: function ($scope, message, $uibModalInstance) {
                    var vm = this;
                    vm.message = message;
                    vm.cb = cb;
                    vm.cb2 = cb2;
                    vm.hideCancel = hideCancel;
                    vm.buttonText = txt;
                    vm.cancelText = txt2;
                    vm.close = function () {
                        $uibModalInstance.dismiss();
                    }
                },
                controllerAs: "vm",
                size: 'xs',
                resolve: {
                    message: function () {
                        return errorMessage;
                    }
                }
            });
        }
    }
});