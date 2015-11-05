var controllerModule = angular.module('studentInfo.controllers', ['studentInfo.service']);
angular.module('studentInfo', ['ionic', 'studentInfo.controllers','ngCordova','openfb'])
	.constant("APP_CONST", {
	    "URL": "http://davfbdcampus.in",
	    "API_DIR": "/mobileapi/"
	})
	.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	    $stateProvider
	        .state('app', {
	            url: "/",
	            templateUrl: "partials/menu.html",
	            controller: "AppController"
	        })
	        .state('app.login', {
	            url: "login",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/login.html",
	                    controller: "LoginController"
	                }
	            }
	        })
	        .state('app.forgotpassword', {
	            url: "forgotpassword",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/forgot-password.html",
	                    controller: "ForgotPasswordController"
	                }
	            }
	        })
	        .state('app.changepassword', {
	            url: "changepassword",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/changepassword.html",
	                    controller: "ChangepasswordController"
	                }
	            }
	        })
	        .state('app.profile', {
	            url: "profile",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/profile.html",
	                    controller: "ProfileController"
	                }
	            }
	        })
	        .state('app.fees', {
	            url: "fees",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/fees.html",
	                    controller: "FeesController"
	                }
	            }
	        })
	        .state('app.docs', {
	            url: "docs",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/docs.html",
	                    controller: "DocsController"
	                }
	            }
	        })
	        .state('app.timetable', {
	            url: "timetable",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/timetable.html",
	                    controller: "TimetableController"
	                }
	            }
	        })
	        .state('app.paymenthistory', {
	            url: "paymenthistory",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/paymenthistory.html",
	                    controller: "PaymentHistoryController"
	                }
	            }
	        })
	        .state('app.dashboard', {
	            url: "dashboard",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/dashboard.html",
	                    controller: "DashboardController"
	                }
	            }
	        })
	        .state('app.commemail', {
	            url: "commemail",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/comm.html",
	                    controller: "CommemailController"
	                }
	            }
	        })
	        .state('app.commsms', {
	            url: "commsms",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/comm.html",
	                    controller: "CommsmsController"
	                }
	            }
	        })
	        .state('app.aboutus', {
	            url: "aboutus",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/aboutus.html",
	                    controller: "AboutusController"
	                }
	            }
	        })
	        .state('app.social', {
	            url: "social",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/social.html",
	                    controller: "SocialController"
	                }
	            }
	        })
	        .state('app.loading', {
	            url: "loading",
	            views: {
	                'studentContent': {
	                    templateUrl: "partials/loading.html",
	                    controller: "LoadingController"
	                }
	            }
	        });
	
	// fallback route
	$urlRouterProvider.otherwise('/loading');
	$ionicConfigProvider.tabs.position('bottom');
	}])

	.factory('App', ["$rootScope", "$cordovaToast", "$ionicLoading", function($rootScope, $cordovaToast, $ionicLoading) {
	  return {
		getAllstudentInfo: function() {
			var allShopping = window.localStorage.getItem('studentInfo');
		    if(allShopping) {
		    	return angular.fromJson(allShopping);
		    }
		    return [];
		},
		newstudentInfo: function(shoppingName) {
			var date = new Date();
			return {
				studentInfo_name: shoppingName,
				id_studentInfo: '',
				items: [],
				remaining_item: 0,
				sync: 0,
				created_at: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2)
			};
	    },
		saveUserDetails: function(userDetails) {
			window.localStorage.setItem('user',angular.toJson(userDetails));
		},
		removeUserDetails: function() {
			window.localStorage.removeItem('user');
			$rootScope.userName = '';
			$rootScope.userPic = '';
		},
	    getUserDetails: function() {
	    	var userString = window.localStorage.getItem('user');
		    if(userString) {
		    	return angular.fromJson(userString);
		    }
		    return null;
		},
		deleteStorage: function () {
			this.removeUserDetails();
		},
	    showToast: function(msg, duration, position){
	    	$cordovaToast.show(msg, duration, position);
	    },
	    showLoading : function(msg){
	    	$ionicLoading.show({
    	      template: msg + '...'
    	    });
	    },
	    hideLoading : function() {
	    	$ionicLoading.hide();
	    },
	    isLoggedIn: function() {
	    	if(this.getUserDetails() == null) {
	    		return false;
	    	}
	    	return true;
	    }
	  }
	}])
    .run(["$rootScope", "$state", "$window", "App", "$ionicPlatform", "$ionicSideMenuDelegate","OpenFB", function ($rootScope, $state, $window, App, $ionicPlatform, $ionicSideMenuDelegate, OpenFB) {   	
    	//window.localStorage.removeItem('user');
    	$rootScope.$on('OAuthException', function() {
            $state.go('app.login');
        });
    	
    	$ionicPlatform.registerBackButtonAction(function () {
    	    $ionicSideMenuDelegate.toggleLeft();
    	}, 100);
        $rootScope.$on('$stateChangeStart', function(event, toState) {
        	var userDetails = App.getUserDetails();
        	//console.log(userDetails);
        	$rootScope.logged_in = false;
            // hide session menu item
            if (userDetails !== null && userDetails.logged_in == 1) {
            	$rootScope.logged_in = true;
            	$rootScope.userName = userDetails.name;
            } else {
            	$rootScope.userName = '';
            }
        });

    }]) ;