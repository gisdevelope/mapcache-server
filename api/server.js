var ServerModel = require('mapcache-models').Server;

function Server() {
}

Server.prototype.getInfo = function(callback) {
  ServerModel.getInfo(callback);
};

Server.prototype.getMaxCacheSize = function(callback) {
  ServerModel.getMaxCacheSize(callback);
};

module.exports = Server;
