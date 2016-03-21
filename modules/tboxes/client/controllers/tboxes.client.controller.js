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

    vm.tbox.size = 5;
    
    $scope.data = {
      availableOptions: [
        {id: '1', value: '1'},
        {id: '2', value: '2'},
        {id: '3', value: '3'}
      ],
      selectedOption: {id: '3', value: '3'} //This sets the default value of the select in the ui
    };

    // vm.number = 5;
    vm.getNumber = function(num) {
      var int = Number(num);
      return new Array(int);   
    }

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
  }
}());
