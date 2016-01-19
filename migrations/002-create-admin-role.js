var  Role = require('mapcache-models').Role;

exports.id = 'create-initial-admin-role';

exports.up = function(done) {

  var adminPermissions = [
    'CREATE_USER', 'READ_USER', 'UPDATE_USER', 'DELETE_USER',
    'CREATE_ROLE', 'READ_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE',
    'CREATE_CACHE', 'READ_CACHE', 'UPDATE_CACHE', 'DELETE_CACHE','EXPORT_CACHE',
    'CREATE_SERVER', 'READ_SERVER', 'UPDATE_SERVER', 'DELETE_SERVER'
  ];

  var adminRole = {
    name: "ADMIN_ROLE",
    description: "Administrative role, full acces to entire MAGE API.",
    permissions: adminPermissions
  };

  Role.createRole(adminRole, done);
};

exports.down = function(done) {

  Role.getRole("ADMIN_ROLE", function(err, role) {
    if (err || !role) return done(err);

    Role.deleteRole(role, done);
  });
};
