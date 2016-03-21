(function () {
  'use strict';

  angular
    .module('tboxes.services')
    .factory('TboxesService', TboxesService);

  TboxesService.$inject = ['$resource'];

  function TboxesService($resource) {
    return $resource('api/tboxes/:tboxId', {
      tboxId: '@_id',
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
