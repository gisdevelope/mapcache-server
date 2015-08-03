angular
  .module('mapcache')
  .controller('MapsController', MapsController);

MapsController.$inject = [
  '$scope',
  '$rootScope',
  'LocalStorageService',
  'CacheService',
  'MapService'
];

function MapsController($scope, $rootScope, LocalStorageService, CacheService, MapService) {
  $scope.token = LocalStorageService.getToken();
  $rootScope.title = 'Maps';

  $scope.mapOptions = {
    baseLayerUrl: 'http://mapbox.geointapps.org:2999/v4/mapbox.light/{z}/{x}/{y}.png',
    opacity: .5,
    // mapOptions: {
    //   hideZoomIndicator: true,
    //   dragging: false,
    //   touchZoom: false,
    //   scrollWheelZoom: false,
    //   doubleClickZoom: false,
    //   zoomControl: false
    // }
  };

  MapService.getAllMaps(true).success(function(maps) {
    $scope.maps = maps;
  });

}
