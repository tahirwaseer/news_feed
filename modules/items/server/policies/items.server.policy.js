'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/items',
      permissions: '*'
    }, {
      resources: '/api/items/:articleId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/items',
      permissions: ['get', 'post']
    }, {
      resources: '/api/items/:articleId',
      permissions: ['get']
    },{
      resources: '/api/items/import',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/items',
      permissions: ['get']
    }, {
      resources: '/api/items/:articleId',
      permissions: ['get']
    },{
      resources: '/items/:articleId',
      permissions: ['get']
    },{
      resources: '/items',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an article is being processed and the current user created it then allow any manipulation
  // if (req.article && req.user && req.article.user.id === req.user.id) {
  //   return next();
  // }
  // to disable user 
  if (req.article ) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
