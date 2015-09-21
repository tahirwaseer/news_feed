'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Items',
      state: 'articles',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'List Items',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Items',
      state: 'articles.create'
    });
    // Add the dropdown import item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Import Items',
      state: 'articles.import'
    });
  }
]);
