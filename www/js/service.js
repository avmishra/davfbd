angular.module('studentInfo.service', [])

        .service("RemoteService", ["$http", "$q", "APP_CONST", function ($http, $q, APP_CONST) {

// Return public API.
                    return({
                        login: userLogin,
                        getProfile: getProfile,
                        getFeesDetails:getFeesDetails,
                        getDocsDetails:getDocsDetails,
                        getPaymentHistory:getPaymentHistory,
                        getCommunication:getCommunication,
                        getTimeTable: getTimeTable,
                        buildUrl: buildUrl,
                        changePassword: changePassword,
                        forgotpassword: forgotpassword,
                    });
                    
                    function buildUrl(pageName) {
                    	return APP_CONST.URL + APP_CONST.API_DIR + pageName;
                    }
                    
                    
                    
                    function forgotpassword(email, code) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("users/forgotpassword"),
                            data: {
                            	email: email,
                            	code: code
                            }
                        });
                    	return(request.then(handleSuccess, handleError));
                    }
                    
                    
                    function changePassword(oldpass, newpass, apiKey) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("users/changepassword"),
                            data: {
                            	oldpass: oldpass,
                            	newpass: newpass
                            },
                            params: {
                                api_key: apiKey
                            }
                        });
                        
                        return(request.then(handleSuccess, handleError));
                    }

                    function userLogin(email, pass) {
                        var request = $http({
                            method: "post",
                            url: buildUrl("checkstudent"),
                            data : $.param({token:"b3Rlcmk",rollno: email,pwd:pass}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function getProfile(studentId) {
                        var request = $http({
                            method: "post",
                            url: buildUrl("getprofile"),
                            data : $.param({token:"b3Rlcmk",studentId: studentId}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function getFeesDetails(studentId, year,batch) {
                        var request = $http({
                            method: "post",
                            url: buildUrl("getfees"),
                            data : $.param({token:"b3Rlcmk",studentId: studentId, year:year, batch_year:batch}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function getDocsDetails() {
                        var request = $http({
                            method: "post",
                            url: buildUrl("getsuportingdoc"),
                            data : $.param({token:"b3Rlcmk"}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function getPaymentHistory(studentId) {
                        var request = $http({
                            method: "post",
                            url: buildUrl("getonlinepaymenthistory"),
                            data : $.param({token:"b3Rlcmk",studentId: studentId}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function getCommunication(studentId,type) {
                        var request = $http({
                            method: "post",
                            url: buildUrl("getcommnication"),
                            data : $.param({token:"b3Rlcmk",studentId: studentId, type: type}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function getTimeTable() {
                        var request = $http({
                            method: "post",
                            url: buildUrl("gettimetable"),
                            data : $.param({token:"b3Rlcmk"}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function handleError(response) {
                        if (!angular.isObject(response.data) || !response.data.message) {
                            return($q.reject("An unknown error occurred."));
                        }
                        return($q.reject(response.data.message));

                    }
                    function handleSuccess(response) {
                        return(response.data);

                    }

                }]
        );
