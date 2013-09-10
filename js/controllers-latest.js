var app = angular.module('speakglobalApp', []);

app.factory('speakglobalHomePageService', function ($http) {

	return {
		getVideosCount: function () {
			//since $http.get returns a promise,
			//and promise.then() also returns a promise
			//that resolves to whatever value is returned in it's
			//callback argument, we can return that.
			return $http.get('http://speakglobally.net/api/videos/count').then(function(result) {
				return result.data.rows[0].value;
			});
		},
		getNoneFeaturedVideos: function (videosPerPage, skipValue) {
			return $http.get('http://speakglobally.net/api/videos/featured_none?limit=' + videosPerPage + '&skip=' + skipValue).then(function(result) {
				return result.data.rows;
			});
		},
		getLatestVideos: function () {
			return $http.get('http://speakglobally.net/api/videos/latest').then(function (result) {
				return result.data.rows;
			});
		},
		getHomeVideo: function (){
			return $http.get('http://speakglobally.net/api/videos/home_video').then(function (result){
				// Get a random number from 15. Top 15 videos sorted in order.
				var i = Math.floor((Math.random() * 15) + 1);
				//console.log(JSON.stringify(result.data.rows[i]));
				return result.data.rows[i];
			});
		}
	};
});

app.controller('SpeakglobalHome', function ($scope, speakglobalHomePageService, $window, $log) {

	// Non Featured Videos i.e all Videos
	$scope.videosPerPage = 42;

	// Javascript Custom Function to get teh URL params, decode them
	function getURLParameter (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	// Get the Video Count
	$scope.videoCount = speakglobalHomePageService.getVideosCount();
	$scope.numberOfPages = (Math.ceil($scope.videoCount/$scope.videosPerPage)).toString();
	$scope.pages = [];
	for(var i = 1; i <= $scope.numberOfPages; i++){
		$scope.pages.push(i);
	}

	// var skipValue = 0;
	$scope.currentPageNumber = parseInt(getURLParameter('p'), 10);
	if (isNaN($scope.currentPageNumber)) {
		skipValue = 0;
		$scope.currentPageNumber = 1;
	} else {
		skipValue = parseInt(($scope.currentPageNumber - 1) * $scope.videosPerPage, 10);
	}

	$scope.noneFeaturedVideos = speakglobalHomePageService.getNoneFeaturedVideos($scope.videosPerPage, skipValue);

	// Latest Videos
	$scope.latestVideos = speakglobalHomePageService.getLatestVideos();

	// Set the hiro player playlist after getting the valid Video Object
	$scope.homeVideo = speakglobalHomePageService.getHomeVideo();
	$scope.$watch('homeVideo', function(homeVideoObj) {
		if (homeVideoObj !== undefined) {
			$scope.homeVideoEmbedPath = homeVideoObj.value.video_path;
			$scope.homeVideoTitle = homeVideoObj.value.title;

			$window.hiro.playList[0].url= "http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/" + homeVideoObj.value.video_path;
			$window.hiro.playList[0].customProperties.videoTitle = homeVideoObj.value.title;
			$window.hiro.playList[0].customProperties.videoExternalId = homeVideoObj.value._id;
			$window.hiro.playList[0].customProperties.videoDescription = homeVideoObj.value.description;
			$window.hiro.playList[0].customProperties.videoKeyWords = homeVideoObj.value.description;
			$window.hiro.playList[0].customProperties.videoTags = homeVideoObj.value.title;
			$window.hiro.playList[0].customProperties.videoDurationSecs = homeVideoObj.value.duration;
		}
	});

});