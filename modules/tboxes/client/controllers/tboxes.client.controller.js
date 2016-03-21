(function () {
  'use strict';

  angular
    .module('tboxes')
    .controller('TboxesController', TboxesController);

  TboxesController.$inject = ['$scope', '$state', 'tboxResolve', '$window', 'Authentication'];

  function TboxesController($scope, $state, tbox, $window, Authentication) {
    var vm = this;

    vm.tbox = tbox;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.getNumber = getNumber;

    vm.tbox.size = 6;
    vm.tbox.count = 1;

    // Remove existing Tbox
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tbox.$remove($state.go('tboxes.list'));
      }
    }

    // Save Tbox
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tboxForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.tbox._id) {
        vm.tbox.$update(successCallback, errorCallback);
      } else {
        vm.tbox.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('home');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Utility for creating a sized Array dynamically
    function getNumber(num) {
      var int = Number(num);
      return new Array(int);
    };

  }
}());
