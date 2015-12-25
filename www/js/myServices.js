angular.module('starter').factory('MyServices', ['$resource', function($resource){
   	var uuid;

   	return ({
   		setDeviceUUID: setDeviceUUID,
   		getDeviceUUID: getDeviceUUID
   	});

   	function setDeviceUUID(uuid) {
   		this.uuid = uuid;
   	}

   	function getDeviceUUID() {
   		return this.uuid;
   	}
}]);