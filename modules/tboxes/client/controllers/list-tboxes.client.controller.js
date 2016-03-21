(function () {
  'use strict';

  angular
    .module('tboxes')
    .controller('TboxesListController', TboxesListController);

  TboxesListController.$inject = ['TboxesService'];

  function TboxesListController(TboxesService) {
    var vm = this;

    vm.tboxes = TboxesService.query();
  }
}());
