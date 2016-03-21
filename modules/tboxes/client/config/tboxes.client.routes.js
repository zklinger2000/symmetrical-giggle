(function () {
  'use strict';

  angular
    .module('tboxes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tboxes', {
        abstract: true,
        url: '/tboxes',
        template: '<ui-view/>'
      })
      .state('tboxes.list', {
        url: '',
        templateUrl: 'modules/tboxes/client/views/list-tboxes.client.view.html',
        controller: 'TboxesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tboxes List'
        }
      })
      .state('tboxes.create', {
        url: '/create',
        templateUrl: 'modules/tboxes/client/views/form-tbox.client.view.html',
        controller: 'TboxesController',
        controllerAs: 'vm',
        resolve: {
          tboxResolve: newTbox
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tboxes Create'
        }
      })
      .state('tboxes.edit', {
        url: '/:tboxId/edit',
        templateUrl: 'modules/tboxes/client/views/form-tbox.client.view.html',
        controller: 'TboxesController',
        controllerAs: 'vm',
        resolve: {
          tboxResolve: getTbox
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit {{ tboxResolve.category }}'
        }
      })
      .state('tboxes.view', {
        url: '/:tboxId',
        templateUrl: 'modules/tboxes/client/views/view-tbox.client.view.html',
        controller: 'TboxesController',
        controllerAs: 'vm',
        resolve: {
          tboxResolve: getTbox
        },
        data: {
          pageTitle: '{{ tboxResolve.category }}'
        }
      });
  }

  getTbox.$inject = ['$stateParams', 'TboxesService'];

  function getTbox($stateParams, TboxesService) {
    return TboxesService.get({
      tboxId: $stateParams.tboxId
    }).$promise;
  }

  newTbox.$inject = ['TboxesService'];

  function newTbox(TboxesService) {
    return new TboxesService();
  }
}());
