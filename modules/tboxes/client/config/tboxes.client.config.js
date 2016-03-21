(function () {
  'use strict';

  angular
    .module('tboxes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Tboxes',
      state: 'tboxes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tboxes', {
      title: 'List Tboxes',
      state: 'tboxes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tboxes', {
      title: 'Create Tbox',
      state: 'tboxes.create',
      roles: ['user']
    });
  }
}());
