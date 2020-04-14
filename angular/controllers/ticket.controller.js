gamingApp.controller("ticketController", function ($scope, $route, $http, $infoModal, $timeout) {

    /**
     * support ticket
     */
    $scope.selectedTicket = {};
    $scope.getTickets = function (page) {
        if (typeof page === 'undefined') page = 0;
        $http.post(localStorage.base_api + "ticket/list", JSON.stringify({
            page: page,
            perPage: 5
        })).then(function (res) {
            $scope.tickets = res.data;
        })
    };

    $scope.setSelectedTicket = function (item) {
        $scope.$parent.selectedTicket = item;
    };

    $scope.ticketIssue = {issue: "", description: ""};
    $scope.submitTicket = function () {

        $http.post(localStorage.base_api + "ticket/submit", JSON.stringify($scope.ticketIssue)).then(function (res) {
            $infoModal.open("表單已成功送出");
            $scope.getTickets();
        });
        return false;
    };


});