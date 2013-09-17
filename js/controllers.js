var app = angular.module('speakglobalApp', ['ui.bootstrap']);

app.factory('speakglobalHomePageService', function ($http) {
    return {
        getVideosCount: function () {
            //since $http.get returns a promise,
            //and promise.then() also returns a promise
            //that resolves to whatever value is returned in it's
            //callback argument, we can return that.
            return $http.get('http://speakglobally.net/api/videos/count').then(function (result) {
                return result.data.rows;
            });
        },
        getNoneFeaturedVideos: function (videosPerPage, skipValue) {
            return $http.get('http://speakglobally.net/api/videos/featured_none?limit=' + videosPerPage + '&skip=' + skipValue).then(function (result) {
                return result.data.rows;
            });
        },
        getLatestVideos: function () {
            return $http.get('http://speakglobally.net/api/videos/latest').then(function (result) {
                return result.data.rows;
            });
        },
        getHomeVideo: function () {
            return $http.get('http://speakglobally.net/api/videos/home_video').then(function (result) {
                // Pick a random number from 15 and get that video from Top 15 videos sorted in order.
                var randVideoCount = Math.floor((Math.random() * 15) + 1);
                return result.data.rows[randVideoCount];
            });
        }
    };
});

// Single Video Page Serives
app.factory('speakglobalVideoPageService', function ($http) {
    return {
        getVideoDetails: function (vId) {
            return $http.get('http://speakglobally.net/api/videos/single_video/' + vId).then(function (result) {
                return result.data;
            });
        }
    };
});

// Similar Videos Page Serives
app.factory('speakglobalSimilarVideosPageService', function ($http) {
    return {
        getSimilarVideosCount: function () {
            return $http.get('http://speakglobally.net/api/videos/count').then(function (result) {
                return result.data.rows;
            });
        },
        getSimilarVideos: function (videosPerPage, skipValue) {
            return $http.get('http://speakglobally.net/api/videos/featured_none?limit=' + videosPerPage + '&skip=' + skipValue).then(function (result) {
                return result.data.rows;
            });
        },
        getLatestVideos: function () {
            return $http.get('http://speakglobally.net/api/videos/latest').then(function (result) {
                return result.data.rows;
            });
        }
    };
});

// Home Page Controller
app.controller('SpeakglobalHome', function ($scope, speakglobalHomePageService, $window, $log) {

    // Non Featured Videos i.e all Videos
    $scope.videosPerPage = 42;

    // Javascript Custom Function to get teh URL params, decode them


    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
    }

    // Get all Video's Count
    $scope.videoCount = speakglobalHomePageService.getVideosCount();
    // Generate the numberOfPages and pages content based on the videoCount
    $scope.$watch('videoCount', function (videoCountObj) {
        if (videoCountObj !== undefined) {
            // Sample Output: {"rows":[{"key":null,"value":650}]}
            $scope.numberOfPages = (Math.ceil(videoCountObj[0].value / $scope.videosPerPage)).toString();

            // Pagination plugin
            $scope.bigTotalItems = videoCountObj[0].value;
        }
    });

    // Get noneFeaturedVideos list based on the page(number) we are hitting from.
    $scope.currentPageNumber = parseInt(getURLParameter('p'), 10);
    if (isNaN($scope.currentPageNumber)) {
        skipValue = 0;
        $scope.currentPageNumber = 1;
    } else {
        skipValue = parseInt(($scope.currentPageNumber - 1) * $scope.videosPerPage, 10);
    }
    $scope.noneFeaturedVideos = speakglobalHomePageService.getNoneFeaturedVideos($scope.videosPerPage, skipValue);

    // Pagination plugin
    $scope.bigCurrentPage = $scope.currentPageNumber;
    $scope.maxSize = 6; // Max number of pages to be displayed at a time

    // Pagination plugin
    // This function is triggred when user tends to change the page using the plugin.
    $scope.pageChanged = function (page) {
        location.replace('/pages?p=' + page);
    };

    // Get the top 5 Latest Videos List
    $scope.latestVideos = speakglobalHomePageService.getLatestVideos();

    // Set the homeVideoEmbedPath, homeVideoTitle, hiro player with the video playlist after getting the valid Video's Object
    $scope.homeVideo = speakglobalHomePageService.getHomeVideo();
    $scope.$watch('homeVideo', function (homeVideoObj) {
        if (homeVideoObj !== undefined) {
            $scope.homeVideoEmbedPath = homeVideoObj.value.video_path;
            $scope.homeVideoTitle = homeVideoObj.value.title;
            $scope.homeVideoPath = 'http://speakglobally.net/' + homeVideoObj.value._id;

            $window.hiro.playList[0].url = 'http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/' + homeVideoObj.value.video_path;
            $window.hiro.playList[0].customProperties.videoTitle = homeVideoObj.value.title;
            $window.hiro.playList[0].customProperties.videoExternalId = homeVideoObj.value._id;
            $window.hiro.playList[0].customProperties.videoDescription = homeVideoObj.value.description;
            $window.hiro.playList[0].customProperties.videoKeyWords = homeVideoObj.value.description;
            $window.hiro.playList[0].customProperties.videoTags = homeVideoObj.value.title;
            $window.hiro.playList[0].customProperties.videoDurationSecs = homeVideoObj.value.duration;
        }
    });
});

// Single Video Page Controller
app.controller('SpeakglobalSingleVideo', function ($scope, speakglobalVideoPageService, $window, $log) {
    // Fetch the Video Information by transfering the Video ID from the template.
    $scope.init = function (vId) {
        $scope.video_id = vId;
        $scope.videoDetails = speakglobalVideoPageService.getVideoDetails(vId);
        // Set the homeVideoEmbedPath, homeVideoTitle, hiro player with the video playlist after getting the valid Video Object
        $scope.$watch('videoDetails', function (videoObj) {
            if (videoObj !== undefined) {
                $scope.homeVideoEmbedPath = videoObj.video_path;
                $scope.homeVideoTitle = videoObj.title;
                $window.hiro.playList[0].url = 'http://91cefb89b61292d7a6a5-9b3e53ad93e76fa27450765a72dfcdf1.r61.cf2.rackcdn.com/' + videoObj.video_path;
                $window.hiro.playList[0].customProperties.videoTitle = videoObj.title;
                $window.hiro.playList[0].customProperties.videoExternalId = videoObj._id;
                $window.hiro.playList[0].customProperties.videoDescription = videoObj.description;
                $window.hiro.playList[0].customProperties.videoKeyWords = videoObj.description;
                $window.hiro.playList[0].customProperties.videoTags = videoObj.title;
                $window.hiro.playList[0].customProperties.videoDurationSecs = videoObj.duration;
            }
        });
    };
});

// Similar Video's Page Controller
app.controller('SpeakglobalSimilarVideos', function ($scope, speakglobalSimilarVideosPageService, $window, $log) {
    // Similar Videos
    $scope.videosPerPage = 42;

    // Javascript Custom Function to get teh URL params, decode them


    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
    }

    // Get all Similar Video's Count
    $scope.videoCount = speakglobalSimilarVideosPageService.getSimilarVideosCount();
    // Generate the numberOfPages and pages content based on the videoCount
    $scope.$watch('videoCount', function (videoCountObj) {
        if (videoCountObj !== undefined) {
            // Sample Output: {"rows":[{"key":null,"value":650}]}
            $scope.numberOfPages = (Math.ceil(videoCountObj[0].value / $scope.videosPerPage)).toString();

            // Pagination plugin
            $scope.bigTotalItems = videoCountObj[0].value;
        }
    });

    // Get Similar videos list based on the page(number) we are hitting from.
    $scope.currentPageNumber = parseInt(getURLParameter('p'), 10);
    if (isNaN($scope.currentPageNumber)) {
        skipValue = 0;
        $scope.currentPageNumber = 1;
    } else {
        skipValue = parseInt(($scope.currentPageNumber - 1) * $scope.videosPerPage, 10);
    }
    $scope.similarVideos = speakglobalSimilarVideosPageService.getSimilarVideos($scope.videosPerPage, skipValue);

    // Pagination plugin
    $scope.bigCurrentPage = $scope.currentPageNumber;
    $scope.maxSize = 6; // Max number of pages to be displayed at a time
    // Pagination plugin
    // This function is triggred when user tends to change the page using the plugin.
    $scope.pageChanged = function (page) {
        location.replace('/pages?p=' + page);
    };

    // Get the top 5 Latest Videos List
    $scope.latestVideos = speakglobalSimilarVideosPageService.getLatestVideos();
});