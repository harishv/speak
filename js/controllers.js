function FVideo($scope, $http, $window, $location) {

	// Non Featured Videos i.e all Videos
	$scope.videosPerPage = 42;

	// Javascript Custom Function to get teh URL params, decode them
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	// Get the Video Count
	$http.get('http://speakglobally.net/api/videos/count').success(function (vidCount) {
		$scope.videoCount = vidCount.rows[0].value;
		$scope.numberOfPages = (Math.ceil($scope.videoCount/$scope.videosPerPage)).toString();
		$scope.pages = [];
		var i;
		for(i=1;i<=$scope.numberOfPages;i++){
			$scope.pages.push(i);
		}

	});

	var skipValue = 0;
	var urlToQuery = '';
	if (location.pathname == '/'){
		skipValue = 0;
		urlToQuery = 'http://speakglobally.net/api/videos/featured_none?limit=' + $scope.videosPerPage + '&skip=0';
	} else{

		$scope.currentPageNumber = parseInt(getURLParameter('p'), 10);
		skipValue = ($scope.currentPageNumber - 1) * $scope.videosPerPage;
		urlToQuery = 'http://speakglobally.net/api/videos/featured_none?limit=' + $scope.videosPerPage + '&skip=' + skipValue;
	}
	$http.get(urlToQuery).success(function(data3) {
		$scope.noneFeaturedVideos = data3.rows;
	});


	// Latest Videos
	$http.get('http://speakglobally.net/api/videos/latest').success(function(data4) {
		$scope.latestVideos = data4.rows;
	});

	$http.get('http://speakglobally.net/api/videos/home_video').success(function(dat) {
		// Get a random number from 15. Top 15 videos sorted in order
		var i = Math.floor((Math.random()*15)+1);
		$scope.homeVideoEmbedPath = dat.rows[i].value.video_path;
		$scope.homeVideoTitle = dat.rows[i].value.title;
		$window.hiro.playList[0].url= "http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/" + dat.rows[i].value.video_path;
		$window.hiro.playList[0].customProperties.videoTitle = dat.rows[i].value.title;
		$window.hiro.playList[0].customProperties.videoExternalId = dat.rows[i].value._id;
		$window.hiro.playList[0].customProperties.videoDescription = dat.rows[i].value.description;
		$window.hiro.playList[0].customProperties.videoKeyWords = dat.rows[i].value.description;
		$window.hiro.playList[0].customProperties.videoTags = dat.rows[i].value.title;
		$window.hiro.playList[0].customProperties.videoDurationSecs = dat.rows[i].value.duration;

	});
}

// Inidividual Video
function IVideo($scope, $http, $window){


	var qUrl="";
	$scope.init = function(id){
		$scope.video_id = id;
		qUrl = 'http://speakglobally.net/api/videos/single_video/' + $scope.video_id;
		// alert($scope.video_id);
			$http.get(qUrl ).success(function(dat) {
				$scope.homeVideoEmbedPath = dat.video_path;
				$scope.homeVideoTitle = dat.title;
				$window.hiro.playList[0].url= "http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/" + dat.video_path;
				$window.hiro.playList[0].customProperties.videoTitle = dat.title;
				$window.hiro.playList[0].customProperties.videoExternalId = dat._id;
				$window.hiro.playList[0].customProperties.videoDescription = dat.description;
				$window.hiro.playList[0].customProperties.videoKeyWords = dat.description;
				$window.hiro.playList[0].customProperties.videoTags = dat.title;
				$window.hiro.playList[0].customProperties.videoDurationSecs = dat.duration;
		});
	};


}

function SimilarVideos($scope,$http){
	$scope.videosPerPage = 42;
	// Get the count of Videos
	$http.get('http://speakglobally.net/api/videos/count').success(function(vidCount) {
		$scope.videoCount = vidCount.rows[0].value;
		$scope.numberOfPages = (Math.ceil($scope.videoCount/$scope.videosPerPage)).toString();
		$scope.pages = [];
		var i;
		for(i=1;i<=$scope.numberOfPages;i++){
			$scope.pages.push(i);
		}

	});

	var urlToQuery = 'http://speakglobally.net/api/videos/featured_none?limit=' + $scope.videosPerPage + '&skip=0';

	$http.get(urlToQuery).success(function(data5) {
		$scope.noneFeaturedVideos = data5.rows;
	});

	$http.get('http://speakglobally.net/api/videos/latest').success(function(data4) {
		$scope.latestVideos = data4.rows;
	});
}


