angular
  .module('mapcache')
  .controller('MapcacheCacheController', MapcacheCacheController);

MapcacheCacheController.$inject = [
  '$scope',
  '$location',
  '$timeout',
  '$routeParams',
  'CacheService'
];

function MapcacheCacheController($scope, $location, $timeout, $routeParams, CacheService) {

  $scope.mapOptions = {
    baseLayerUrl: 'http://mapbox.geointapps.org:2999/v4/mapbox.light/{z}/{x}/{y}.png',
    opacity: .25
  };

  $scope.createAnotherCache = function() {
    $location.path('/create');
  }

  $scope.returnToList = function () {
    $location.path('/mapcache');
  };

  $scope.cacheProgress = function(cache) {
    if (cache)
      return Math.min(100,100*(cache.status.generatedTiles/cache.status.totalTiles));
  }
  $scope.zoomProgress = function(zoomStatus) {
    if (zoomStatus)
      return Math.min(100,100*(zoomStatus.generatedTiles/zoomStatus.totalTiles));
  }
  $scope.sortedZooms = function(cache) {
    console.log('zoom rows', cache);
    if (!cache) return;
    var zoomRows = [];
    for (var i = cache.minZoom; i <= cache.maxZoom; i=i+3) {
      var row = [];
      if (cache.status.zoomLevelStatus[i]) {
        row.push({zoom: i, status:cache.status.zoomLevelStatus[i]});
      }
      if (cache.status.zoomLevelStatus[i+1]) {
        row.push({zoom: i+1, status:cache.status.zoomLevelStatus[i+1]});
      }
      if (cache.status.zoomLevelStatus[i+2]) {
        row.push({zoom: i+2, status:cache.status.zoomLevelStatus[i+2]});
      }
      zoomRows.push(row);
    }
    console.log('zoom rows', zoomRows);
    return zoomRows;
  }

  $scope.cacheFormatExists = function(cache, format) {
    return cache.formats && cache.formats[format] && !cache.formats[format].generating;
  }

  $scope.cacheFormatGenerating = function(cache, format) {
    return cache.formats && cache.formats[format] && cache.formats[format].generating;
  }

  $scope.cacheFormatSize = function(cache, format) {
    var size = "Unknown";
    if (cache.formats && cache.formats[format]) {
      var bytes = cache.formats[format].size;
      var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
  			number = Math.floor(Math.log(bytes) / Math.log(1024));
  		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(3) +  ' ' + units[number];
    }
    return size;
  }

  $scope.generateFormat = function(cache, format) {
    CacheService.createCacheFormat(cache, format, function() {
      cache.formats = cache.formats || {};
      cache.formats[format] = cache.formats[format] || {};
      cache.formats[format].generating = true;
      console.log('go get the cache');
      getCache(cache.id);
    });
  }

  $scope.cacheBoundingBox = function(cache) {
    var extent = turf.extent(cache.geometry);
    return "West: " + extent[0] + " South: " + extent[1] + " East: " + extent[2]+ " North: " + extent[3];
  }

  function getCache(id) {
    var cache = $scope.cache || {};
    if (id) {
      cache.id = id;
    }
    CacheService.getCache(cache, function(cache) {
      // success
      $scope.cache = cache;
      $scope.zoomRows = $scope.sortedZooms(cache);
      if (!cache.status.complete) {
        $timeout(getCache, 5000);
      } else {
        for (var format in cache.formats) {
          if(cache.formats.hasOwnProperty(format)){
            if (cache.formats[format].generating) {
              $timeout(getCache, 5000);
            }
          }
        }
      }
    }, function(data) {
      // error
    });
  }

  getCache($routeParams.cacheId);

};
