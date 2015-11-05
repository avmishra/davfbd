controllerModule.controller('AppController', ["$scope", "$state", "App", "RemoteService", "$ionicPopup", function ($scope, $state, App, RemoteService, $ionicPopup) {
    	var userDetails = App.getUserDetails();
    	if (userDetails == null) {
    		$scope.name = '';
    	} else {
    		$scope.name = userDetails.first_name;
    	}
    	
    	// A delete confirm dialog
    	$scope.showConfirm = function(index) {
	          var confirmPopup = $ionicPopup.confirm({
	            title: 'Logout?',
	            template: 'Do you really want to logout?'
	          });
	          confirmPopup.then(function(res) {	
	            if(res) {
	            	App.deleteStorage();
	                $state.go('app.login');
	            }
	          });
        };
    	
    	$scope.exitApp = function() {
    		ionic.Platform.exitApp();
    	}
    }])
    .controller('ForgotPasswordController', ["$scope", "$state", "App", "RemoteService", function ($scope, $state, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
        $scope.forgot = {};
        $scope.submitted = false;
        var userDetails = App.getUserDetails();
        $scope.sendCodeFrm = true;
        $scope.sendPasswordFrm = false;
        $scope.verifyForm = {};
        
    	$scope.sendForgotPassCode = function (codeFrm) {
    		if (codeFrm.$valid) {
    			App.showLoading('Please wait');
                RemoteService.sendForgotPassCode($scope.forgot.email).then(
            		function(responseData) {
                		jsonResponse = angular.fromJson(JSON.parse(responseData));
                		if (jsonResponse.status != "200") {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			App.hideLoading();
                		} else {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			$scope.sendCodeFrm = false;
                			$scope.sendPasswordFrm = true;
                			$scope.verifyForm.email = $scope.forgot.email;
                			App.hideLoading();
                		}
                		
                	},
                	function( errorMessage ) {
                		console.warn( errorMessage );
                		App.showToast('Network error occurred. Please try again.', 'long', 'top');
                		App.hideLoading();
                	}
                );
            } else {
                $scope.submitted = true;
            }
    	}
    	
    	$scope.submit = function(verificationFrm) {
            if (verificationFrm.$valid) {
            	App.showLoading('Please wait');
                RemoteService.forgotpassword($scope.verifyForm['email'], $scope.verifyForm['code']).then(
                	function(responseData) {
                		jsonResponse = angular.fromJson(JSON.parse(responseData));
                		if (jsonResponse.status != "200") {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			App.hideLoading();
                		} else {
                			App.showToast('We have sent new password on your email', 'long', 'top');
                			App.hideLoading();
                			$state.go('app.login');
                		}
                	},
                	function( errorMessage ) {
                		console.warn( errorMessage );
                		App.showToast('Network error occurred. Please try again.', 'long', 'top');
                		App.hideLoading();
                	}
                );
            } else {
                $scope.submitted = true;
            }
        }
    	
    }])
    .controller('ChangepasswordController', ["$scope", "$state", "App", "RemoteService", function ($scope, $state, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
        $scope.userForm = {};
        $scope.submitted = false;
        var userDetails = App.getUserDetails();        
    	$scope.changePassword = function (userFrm) {
    		if (userFrm.$valid) {
    			if ($scope.userForm.password != $scope.userForm.confirmpassword) {
    				$scope.errorMsg = stackMessages('Password mismatched');
    				$scope.errorBlockShow = true;
    			} else {
	    			App.showLoading('Please wait');
	                RemoteService.changePassword($scope.userForm.oldpassword, $scope.userForm.password, userDetails['api_key']).then(
	            		function(responseData) {
	                		jsonResponse = angular.fromJson(JSON.parse(responseData));
	                		if (jsonResponse.status != "200") {
	                			$scope.errorMsg = stackMessages(jsonResponse.message);
	                			$scope.errorBlockShow = true;
	                			App.hideLoading();
	                		} else {
	                			App.showToast('Password changed successfully', 'long', 'top');
	                			App.hideLoading();
	                			$state.go('app.listing');
	                		}
	                		
	                	},
	                	function( errorMessage ) {
	                		console.warn( errorMessage );
	                		App.showToast('Network error occurred. Please try again.', 'long', 'top');
	                		App.hideLoading();
	                	}
	                );
    			}
            } else {
                $scope.submitted = true;
            }
        };
    }])
    .controller('LoginController', ["$rootScope", "$scope", "$state", "$location", "$http", "RemoteService", "App", "OpenFB", "$cordovaOauth", function ($rootScope, $scope, $state, $location, $http, RemoteService, App, OpenFB, $cordovaOauth) {
    	var userDetails = App.getUserDetails();
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
        $scope.userForm = {};
        $scope.submitted = false;
        $scope.noUserExist = true;
        
        // if user exist redirect on home page
        if (userDetails != null && userDetails.logged_in == 1) {
        	$state.go('app.dashboard');
        }
        
        $scope.userLogin = function(userFrm) {
            if (userFrm.$valid) {
            	App.showLoading('Please wait');
                RemoteService.login($scope.userForm.email, $scope.userForm.password).then(
            		function(responseData) {
                		jsonResponse = responseData;//angular.fromJson(JSON.parse(responseData));
                		if (jsonResponse.status != "Success") {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			App.hideLoading();
                		} else {
                			App.removeUserDetails();
                			App.saveUserDetails(
                					{
                						logged_in:1,
                						studentId:jsonResponse.data.studentId,
                						rollno:jsonResponse.data.rollNo,
                						name: jsonResponse.data.student_name,
                						year: jsonResponse.data.year,
                						batch_year: jsonResponse.data.batch_year,
                						type: jsonResponse.data.type
                					}
                				);
                			App.hideLoading();
                			$state.go('app.dashboard');
                			
                		}

                	},
                	function( errorMessage ) {
                		console.warn( errorMessage );
                		App.showToast('Network error occurred. Please try again.', 'long', 'top');
                		App.hideLoading();
                	}
                );
            } else {
                $scope.submitted = true;
            }
        }
        
    }])
    .controller('LoadingController', ["$scope", "$state", "$timeout", function($scope, $state, $timeout) {
    	$timeout(function(){$state.go('app.login');}, 3000);
    }])
    .controller('DashboardController', ["$scope", "$state", function($scope, $state) {
    	
    }])
    .controller('ProfileController', ["$rootScope", "$scope", "App", "RemoteService", function($rootScope, $scope, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	$scope.userDetails = {};
    	var userDetails = App.getUserDetails();
    	
    	App.showLoading('Please wait');
        RemoteService.getProfile(userDetails.studentId).then(
    		function(responseData) {
        		jsonResponse = responseData;//angular.fromJson(JSON.parse(responseData));
        		if (jsonResponse.status != "success") {
        			$scope.errorMsg = stackMessages(jsonResponse.message);
        			$scope.errorBlockShow = true;
        			App.hideLoading();
        		} else {
        			App.hideLoading();
        			$scope.userDetails.basic = jsonResponse.data.basic[0];
        			$scope.userDetails.contact = jsonResponse.data.contact[0];
        			$scope.userDetails.academic = jsonResponse.data.academic;
        			$scope.userDetails.college_academic = jsonResponse.data.college_academic;
        			$scope.userDetails.document = jsonResponse.data.document;
        			$scope.userDetails.extra = jsonResponse.data.extra_activity;
        		}
        	},
        	function( errorMessage ) {
        		console.warn( errorMessage );
        		App.showToast('Network error occurred. Please try again.', 'long', 'top');
        		App.hideLoading();
        	}
        );
    }])
    .controller('FeesController', ["$rootScope", "$scope", "App", "RemoteService", function($rootScope, $scope, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	$scope.feesDetails = {};
    	var userDetails = App.getUserDetails();
    	
    	App.showLoading('Please wait');
        RemoteService.getFeesDetails(userDetails.studentId,userDetails.year,userDetails.batch_year).then(
    		function(responseData) {
        		jsonResponse = responseData;
        		if (jsonResponse.status != "success") {
        			$scope.errorMsg = stackMessages(jsonResponse.message);
        			$scope.errorBlockShow = true;
        			App.hideLoading();
        		} else {
        			App.hideLoading();
        			$scope.feesDetails = jsonResponse.data;
        		}
        	},
        	function( errorMessage ) {
        		console.warn( errorMessage );
        		App.showToast('Network error occurred. Please try again.', 'long', 'top');
        		App.hideLoading();
        	}
        );
    }])
    .controller('DocsController', ["$rootScope", "$scope", "App", "RemoteService", "APP_CONST", function($rootScope, $scope, App, RemoteService, APP_CONST) {
    	
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	$scope.docsDetails = {};
    	var userDetails = App.getUserDetails();
    	
    	App.showLoading('Please wait');
        RemoteService.getDocsDetails().then(
    		function(responseData) {
        		jsonResponse = responseData;
        		if (jsonResponse.status != "success") {
        			$scope.errorMsg = stackMessages(jsonResponse.message);
        			$scope.errorBlockShow = true;
        			App.hideLoading();
        		} else {
        			App.hideLoading();
        			$scope.docsDetails = jsonResponse.data.documents;
        		}
        	},
        	function( errorMessage ) {
        		console.warn( errorMessage );
        		App.showToast('Network error occurred. Please try again.', 'long', 'top');
        		App.hideLoading();
        	}
        );
        
        $scope.downloadFile = function(fileName) {
        	window.open(APP_CONST.URL + fileName, '_system', 'location=no');
        };
    }])
    .controller('PaymentHistoryController', ["$rootScope", "$scope", "App", "RemoteService", function($rootScope, $scope, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	$scope.paymentHistory = {};
    	var userDetails = App.getUserDetails();
    	
    	App.showLoading('Please wait');
        RemoteService.getPaymentHistory(userDetails.studentId).then(
    		function(responseData) {
        		jsonResponse = responseData;
        		if (jsonResponse.status != "success") {
        			$scope.errorMsg = stackMessages(jsonResponse.message);
        			$scope.errorBlockShow = true;
        			App.hideLoading();
        		} else {
        			App.hideLoading();
        			$scope.paymentHistory = jsonResponse.data;
        		}
        	},
        	function( errorMessage ) {
        		console.warn( errorMessage );
        		App.showToast('Network error occurred. Please try again.', 'long', 'top');
        		App.hideLoading();
        	}
        );
    }])
    .controller('CommsmsController', ["$rootScope", "$scope", "App", "RemoteService", function($rootScope, $scope, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	$scope.communication = {};
    	var userDetails = App.getUserDetails();
    	$scope.type = 'SMS';
    	
    	App.showLoading('Please wait');
        RemoteService.getCommunication(userDetails.studentId, 'M').then(
    		function(responseData) {
        		jsonResponse = responseData;
        		if (jsonResponse.status != "success") {
        			$scope.errorMsg = stackMessages(jsonResponse.message);
        			$scope.errorBlockShow = true;
        			App.hideLoading();
        		} else {
        			App.hideLoading();
        			console.log(jsonResponse.data);
        			$scope.communication = jsonResponse.data;
        		}
        	},
        	function( errorMessage ) {
        		console.warn( errorMessage );
        		App.showToast('Network error occurred. Please try again.', 'long', 'top');
        		App.hideLoading();
        	}
        );
    }])
    .controller('CommemailController', ["$rootScope", "$scope", "App", "RemoteService", function($rootScope, $scope, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	$scope.communication = {};
    	var userDetails = App.getUserDetails();
    	$scope.type = 'Email';
    	
    	App.showLoading('Please wait');
        RemoteService.getCommunication(userDetails.studentId, 'E').then(
    		function(responseData) {
        		jsonResponse = responseData;
        		if (jsonResponse.status != "success") {
        			$scope.errorMsg = stackMessages(jsonResponse.message);
        			$scope.errorBlockShow = true;
        			App.hideLoading();
        		} else {
        			App.hideLoading();
        			$scope.communication = jsonResponse.data;
        		}
        	},
        	function( errorMessage ) {
        		console.warn( errorMessage );
        		App.showToast('Network error occurred. Please try again.', 'long', 'top');
        		App.hideLoading();
        	}
        );
    }])
    .controller('TimetableController', ["$rootScope", "$scope", "App", "RemoteService", "APP_CONST", function($rootScope, $scope, App, RemoteService, APP_CONST) {
    	
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	$scope.docsDetails = {};
    	var userDetails = App.getUserDetails();
    	
    	App.showLoading('Please wait');
        RemoteService.getTimeTable().then(
    		function(responseData) {
        		jsonResponse = responseData;
        		if (jsonResponse.status != "success") {
        			$scope.errorMsg = stackMessages(jsonResponse.message);
        			$scope.errorBlockShow = true;
        			App.hideLoading();
        		} else {
        			App.hideLoading();
        			$scope.docsDetails = jsonResponse.data.timetable;
        		}
        	},
        	function( errorMessage ) {
        		console.warn( errorMessage );
        		App.showToast('Network error occurred. Please try again.', 'long', 'top');
        		App.hideLoading();
        	}
        );
        
        $scope.downloadFile = function(fileName) {
        	window.open(APP_CONST.URL + fileName, '_system', 'location=no');
        };
    }])
    .controller('AboutusController', ["$rootScope", "$scope", "App", "RemoteService", "APP_CONST", function($rootScope, $scope, App, RemoteService, APP_CONST) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	
    	$scope.openSite = function() {
    		window.open("http://davccfbd.com", '_system', 'location=no');
    	}
    }])
    .controller('SocialController', ["$rootScope", "$scope", "App", "RemoteService", "APP_CONST", function($rootScope, $scope, App, RemoteService, APP_CONST) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	
    	$scope.openFacebook = function() {
    		window.open("https://www.facebook.com/davccfaridabad", '_system');
    	}
    	
    	$scope.openWebsite = function() {
    		window.open("http://www.davccfbd.com", '_system', 'location=no');
    	}
    	
    	$scope.openYoutube = function() {
    		window.open("https://www.youtube.com/watch?v=TaP_aTz2SL8", '_system', 'location=no');
    	}
    	
    }])
    ;

function stackMessages(msg) {
    var data = msg.split('^');
    var text = [{}];
    for (i = 0; i < data.length; i++) {
        text.push({msg:data[i]});
    }
    return text;
}