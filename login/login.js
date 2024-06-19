'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('loginRegApp.login', ['angular.snackbar']);


app.controller("launchCtrl", ['$scope', 'loginRegService', '$timeout', '$window', '$rootScope', '$interval', function ($scope, loginRegService, $timeout, $window, $rootScope, $interval) {
    $scope.orgDet = {};
    // $scope.orgDet.orgName = "Daido Metal";
    //Getting the logo path of the organization by checking the alias name from the url
    $scope.checkOrgLogo = function () {
        var url = window.location.href;
        //below match function provides alias in first index of urlAlias variable
        //var urlAlias = url.match(new RegExp("://" + "(.*)" + '-demo.myenovation')); //for uat
        var urlAlias = url.match(new RegExp("://" + "(.*)" + '.myenovation')); //for Prod
        //var urlAlias = url.match(new RegExp("://aihub." + "(.*)" + '.com')); //for DEV

        //console.log(urlAlias);
        if (urlAlias != null) {
            loginRegService.httpGet('getorglogo/' + urlAlias[1])
                .then(function (response) {
                    //console.log("-------------Check Org Logo Response-----------");
                    //console.log(response);
                    if (response.result) {
                        $scope.orgDet = response;
                    } else {
                        $scope.orgLogoPath = '';
                        $scope.orgDet = {};
                    }
                    //console.log(response);
                });
        }
        $("#LaunchPage1").modal('show');
        $scope.isNewUser = true;
        $scope.isNewUserLoading = false;
    }

    /* Alies name wise */
    $scope.getOrgByAlies = function (alies) {
        var flag = false;
        if ($rootScope.empDetails != null && $rootScope.empDetails != undefined) {
            var tmpAlies = $rootScope.empDetails.organization.alies;
            if (tmpAlies != null && !angular.isUndefined(tmpAlies) && tmpAlies == alies) {
                flag = true;
            }
        }
        return flag;
    }
    $scope.checkOrgLogo();
    // if ($scope.orgDet != null && $scope.orgDet != undefined && $scope.orgDet != '') {
    //     if ($scope.orgDet.orgName == "Daido Metal") {
    //         // if (localStorage.getItem('launchPage') == undefined && localStorage.getItem('launchPage') == null) {
    //         $("#LaunchPage1").modal('show');
    //         //}
    //         $scope.isNewUser = true;
    //         $scope.isNewUserLoading = false;
    //     } else {

    //     }
    // }
    $scope.isEmpty = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    $scope.windowHeight = $(window)
        .innerHeight();
    var promise;
    $scope.goLive = function () {
        $scope.isNewUserLoading = true;
        promise = $interval(function () {
            $scope.isNewUserLoading = false;
            $scope.isNewUser = false;
        }, 1500);
    }
    $scope.stopInterval = function () {
        // localStorage.setItem('launchPage', 1);
        $interval.cancel(promise);
    };
    $scope.goLoginPage = function () {
        window.location.href = 'login.html';
    }
}]);
app.controller("loginCtrl", ['$scope', 'loginRegService', '$timeout', '$window', '$rootScope', '$interval', '$location', function ($scope, loginRegService, $timeout, $window, $rootScope, $interval, $location) {
    $scope.screenDetect = function () {
        var flag = false;
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        // var isMobile = Math.min(window.screen.width, window.screen.height) < 768 || navigator.userAgent.indexOf("Mobi") > -1;
        if (isMobile) {
            /* your code here */
            flag = true;
        }
        return flag;
    }
    // $scope.$watch($scope.screenDetect, function(newValue, oldValue) {
    //     //console.log(newValue);
    //     $scope.isMobile = newValue;
    // });
    $scope.data = null;
    $scope.username = null;
    $scope.pass = null;
    $scope.flagSpinner = false;
    $scope.flagErrorMsg = false;
    $scope.error = {
        errMgs: '',
        remainingLoginAttempts: ''
    };
    $scope.isEmailVerified = false;

    $scope.loginDet = {
        username: '',
        pass: ''
    }

    $scope.ROLE_TYPE = {
        HR: "HR",
        EVALUATION: 1,
        IMPLEMENTATION: 2,
        ANALYSIS: 3
    };

    $scope.LANG_CONST = {
        EMAIL_ID: 'Email ID',
        MOBILE_NUMBER: 'Mobile Number',
        EMPLOYEE_ID: 'Employee ID',
        // EMAIL_ID: 'Email ID/ Mobile Number/ Employee ID',
        PASS: 'Password',
        FORGOT_PASS: 'Forgot Password',
        USERNAME: 'Username',
        ENTR_EML_ID: 'Enter Email ID / Mobile Number',
        // ENTR_EML_ID: 'Enter Email ID/ Mobile Number/ Employee ID',
        VERIFY: 'VERIFY',
        LOGIN: 'LOGIN',
        VAL_ENTR_EML_ID: 'Please enter email id / mobile number',
        VAL_ENTR_VLD_EML_ID: 'Please enter valid email id / mobile number',
        // VAL_ENTR_VLD_EML_ID: 'Please enter valid email id/ mobile number/ employee id',
        VAL_PLS_ENTR_PASS: 'Please enter password',
        ENTR_PASS: 'Enter Password',
        CHANGE_EML: 'Change Email ID / Mobile Number'
        // CHANGE_EML: 'Change Email ID/ Mobile Number/ Employee ID'
    };

    // $scope.orgLogoPath = "dist/icons/my_enovation_white@2x_pencil.png";
    $scope.orgLogoPath = "dist/icons/pencil_up.png";
    $scope.isUrlValid = function (testLink) {
        if (testLink != undefined && testLink != null) {
            var url = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
            var Link = testLink;
            if (Link != "" && Link != undefined && url.test(Link)) {
                if (Link.indexOf("http") != 0) {
                    Link = "http://" + Link;
                }
                return true;
            } else
                return false;
        } else {
            return false;
        }
    };

    $scope.showloginIssueModel = function () {
        $("#loginIssueModal")
            .modal({
                backdrop: 'static',
                keyboard: false
            });
    }
    $scope.orgDet = {};
    $scope.feedback = {};
    $scope.microsoft = {};
    //Getting the logo path of the organization by checking the alias name from the url
    $scope.checkOrgLogo = function () {
        var url = window.location.href;
        //below match function provides alias in first index of urlAlias variable
        //var urlAlias = url.match(new RegExp("://" + "(.*)" + '-demo.myenovation')); //for uat
        // var urlAlias = url.match(new RegExp("://" + "(.*)" + '.myenovation')); //for Prod
        var urlAlias = url.match(new RegExp("://gtdev." + "(.*)" + '.com'));  //for DEV
        // var urlAlias = ["", "GT"]
        //console.log(urlAlias);
        if (urlAlias != null) {
            //urlAlias[1]  "greentinsolutions"
            loginRegService.httpGet('getorglogo/' + urlAlias[1])
                .then(function (response) {
                    //console.log("-------------Check Org Logo Response-----------");
                    //console.log(response);
                    if (response.result) {
                        $scope.orgDet = response;
                        //console.log($scope.orgDet);
                        // $scope.orgDet.orgName = "Daido Metal"
                        $scope.orgLogoPath = response.logoPath;
                        // Author - Aniket G. (Modifier).  Add launch logo on login  page for all orgs except roopauto, gmr and etc
                        $scope.launchLogoPath = response.launchLogoPath;
                        $scope.superadminList = response.superAdminsList;
                        //console.log("superAdminList", $scope.superadminList);
                        $scope.feedback.organization = response.orgName;

                        $scope.micrUserDetail = $scope.orgDet;
                        $scope.giveAccessMicr = $scope.micrUserDetail.isSSOAccessible
                        if ($scope.giveAccessMicr == "Y") {
                            localStorage.setItem('giveAccessMicr', JSON.stringify($scope.giveAccessMicr));

                            const clientId = $scope.orgDet.appId;
                            const authority = 'https://login.microsoftonline.com/' + $scope.orgDet.tenantId;
                            const redirectUri = $scope.orgDet.redirectUrl;
                            const scopes = ['openid', 'profile', 'User.Read'];
                            const msalConfig = {
                                auth: {
                                    clientId,
                                    authority,
                                    redirectUri,
                                    scopes
                                },
                                cache: {
                                    cacheLocation: 'localStorage',
                                }
                            };
                            //console.log(msalConfig);
                            $scope.msalInstance = new Msal.UserAgentApplication(msalConfig);
                            localStorage.setItem('msalInstanceData', JSON.stringify($scope.msalInstance));

                        }

                    } else {
                        $scope.orgLogoPath = '';
                    }
                    //console.log(response);
                });
        }
    }
    $scope.checkOrgLogo();
    $scope.getOrgAliesName = function () {
        var alias = '';
        var url = window.location.href;
        //below match function provides alias in first index of urlAlias variable
        //var urlAlias = url.match(new RegExp("://" + "(.*)" + '-demo.myenovation')); //for uat
        // var urlAlias = url.match(new RegExp("://" + "(.*)" + '.myenovation')); //for Prod
        var urlAlias = url.match(new RegExp("://gtdev." + "(.*)" + '.com'));  //for DEV
        //console.log(urlAlias);
        if (urlAlias != null && urlAlias.length > 0) {
            alias = urlAlias[1];
        }
        // alias = 'GT';
        return alias;
    }
    $scope.loginWithMicro = function () {
        //console.log($scope.msalInstance);
        // $scope.newLogin();
        // if( !$scope.msalInstance.getAccount()){
        $scope.msalInstance.loginPopup().then(response => {
            //console.log('Login successful:', response);
            // displayUserInfo();
            $scope.getAccessToken();
            closePopup();
        })
            .catch(error => {
                console.error('Login error:', error);
            });
    }
    $scope.getAccessToken = function () {
        const account = $scope.msalInstance.getAccount();
        if (account) {
            $scope.msalInstance.acquireTokenSilent({
                scopes: ['openid', 'profile', 'User.Read'],
                account,
                forceRefresh: true,
            }).then(response => {
                //console.log('Access token:', response.accessToken);
                $scope.micrToken = response.accessToken;
                $scope.micrMail = account.userName;
                $scope.submitLogin();
            }).catch(error => {
                console.error('Access token error:', error);
            });
        }
    }
    $scope.isEmpty = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    $scope.submitLogin = function () {

        $scope.flagErrorMsg = false;
        $scope.errMgs = '';

        if ($scope.loginDet.pass != '' || $scope.giveAccessMicr == "Y") {
            if ($scope.giveAccessMicr == "Y") {
                $scope.data = {
                    "emailId": $scope.micrMail,
                    "token": $scope.micrToken,
                    "sourceType": 'portal'
                }
                $scope.urlApi = "ssoAuth"
            } else if ($scope.loginDet.pass != '' || $scope.giveAccessMicr != "Y") {
                $scope.data = {
                    emailId: $scope.loginDet.username,
                    password: $scope.loginDet.pass,
                    origin: window.location.origin,
                    sourceType: 'portal'
                };
                if (!$scope.isEmpty($scope.orgDet)) {
                    $scope.data.orgId = $scope.orgDet.orgId;
                }
                if ($scope.getOrgAliesName() && $scope.getOrgAliesName() != '') {
                    $scope.data.orgAlies = $scope.getOrgAliesName();
                }
                $scope.urlApi = "login"
                $scope.flagSpinner = true;
                //console.log("Logging");
                //console.log($scope.data);   

            }
            loginRegService.httpPost($scope.data, $scope.urlApi)
                .then(function (response) {
                    $scope.response = response;
                    $scope.flagSpinner = false;
                    if (response.result) {
                        //Checking that user's organization have completed the setup or not to
                        //strat the work on suggestion
                        var flagValid = false;
                        if (response.employeeDetails.productOrgConfigDet.isSetupCompleted == 0) {

                            for (var i = 0; i < response.employeeDetails.roles.length; i++) {
                                if (response.employeeDetails.roles[i].name == 'SUPERADMIN') {
                                    flagValid = true;
                                    break;
                                }
                            }
                        } else {
                            flagValid = true;
                        }

                        if (flagValid) {
                            localStorage.setItem("menuData", window.btoa(JSON.stringify(response.menuDataList)));
                            response.employeeDetails.authToken = response.authToken;
                            if (response.employeeDetails.lastName == null)
                                response.employeeDetails.lastName = "";
                            //response.employeeDetails.organization.productOrgConfigList.push({"isSetupCompleted":0});
                            localStorage.setItem("userDet", JSON.stringify(response.employeeDetails));
                            localStorage.setItem("versioning", JSON.stringify(response.subscriptionData));
                            // localStorage.setItem("suggStatus", response.masterStatus);
                            sessionStorage.removeItem("selectedSideMenu");
                            sessionStorage.removeItem('sideMenuData');
                            if ($scope.screenDetect()) {
                                window.location.href = 'mobileView/index.html';
                            } else {
                                if (response.employeeDetails.isPasswordExpired == 1 && response.employeeDetails.passwordPolicyDetails.isEnable == "Y") {
                                    //console.log(response.employeeDetails.isPasswordExpired);
                                    window.location.href = 'template.html#!/changepassword';

                                } else {
                                    if (response.employeeDetails.productOrgConfigDet.isSetupCompleted == 0) {
                                        if ($scope.isUrlValid(response.employeeDetails.organization.portalLink) == true)
                                            window.location.href = response.employeeDetails.organization.portalLink + 'setup-config/index.html';
                                        else
                                            window.location.href = 'setup-config/index.html';
                                    } else if (response.employeeDetails.productOrgConfigDet.isSetupCompleted == 1 && response.employeeDetails.dept == null) {
                                        if ($scope.isUrlValid(response.employeeDetails.organization.portalLink) == true)
                                            window.location.href = response.employeeDetails.organization.portalLink + 'template.html#!/updateprofile';
                                        else
                                            window.location.href = 'template.html#!/updateprofile';
                                    } else {
                                        if ($scope.isUrlValid(response.employeeDetails.organization.portalLink) == true)
                                            window.location.href = response.employeeDetails.organization.portalLink + 'template.html';
                                        else
                                            window.location.href = 'template.html';
                                    }
                                }
                            }
                        } else {
                            $scope.flagErrorMsg = true;
                            $scope.error.errMgs = "You are not authorised.";
                        }
                    } else {
                        //console.log("Failed Login");
                        $scope.flagErrorMsg = true;
                        if (response.statusCode == 100) {
                            if (response.remainingLoginAttempts > 0) {
                                if ($scope.isClient('jcb')) {
                                    $scope.error.errMgs = "Invalid Password. Please enter the correct password.";
                                    $scope.error.remainingLoginAttempts = response.remainingLoginAttempts;
                                } else {
                                    $scope.error.errMgs = response.reason;
                                    $scope.error.remainingLoginAttempts = response.remainingLoginAttempts;
                                }
                            } else {
                                if ($scope.isClient('jcb')) {
                                    $scope.error.remainingLoginAttempts = '';
                                    $scope.error.errMgs = " Invalid Password. Please enter the correct password.";
                                } else {
                                    $scope.error.remainingLoginAttempts = '';
                                    $scope.error.errMgs = response.reason;
                                }
                            }
                        } else {
                            if ($scope.isClient('jcb')) {
                                $scope.error.errMgs = "Invalid Employee ID or Password";
                            }
                            else if ($scope.giveAccessMicr == "Y") {
                                $scope.error.errMgs = "Oops, something went wrong";
                            }
                            else {
                                $scope.error.errMgs = "Invalid Email ID or Password";
                            }
                        }
                    }
                });
        } else {
            $scope.flagErrorMsg = true;
            $scope.error.errMgs = "Please enter the password";
            // if ($scope.isClient('jcb')) {
            //     $scope.error.errMgs = "Please enter the password";
            // } else {
            //     $scope.error.errMgs = $scope.LANG_CONST.VAL_ENTR_VLD_EML_ID;
            // }
        }
    };

    $scope.login = function () {
        if ($scope.isEmailVerified) {
            $scope.submitLogin();
        } else {
            $scope.verifyEmail();
        }
    }
    var url = window.location.href;
    //below match function provides alias in first index of urlAlias variable
    //$scope.orgAlias = url.match(new RegExp("://" + "(.*)" + '-demo.myenovation')); //for uat
    $scope.orgAlias = url.match(new RegExp("://" + "(.*)" + '.myenovation')); //for Prod
    //$scope.orgAlias = url.match(new RegExp("://aihub." + "(.*)" + '.com')); //for DEV
    var portalurl = window.location.hostname;
    //console.log(portalurl);
    $scope.verifyEmail = function () {
        //console.log($scope.loginDet.username);
        if ($scope.loginDet.username != '') {
            $scope.flagSpinner = true;
            var req = {
                username: $scope.loginDet.username,
                source: 'portal'
            }
            if ($scope.getOrgAliesName() && $scope.getOrgAliesName() != '') {
                req.orgAlies = $scope.getOrgAliesName();
            }
            loginRegService.httpPost(req, 'checkloginemail')
                .then(function (response) {
                    //console.log("--------------Check Login Response----------------");
                    //console.log(response);
                    $scope.flagSpinner = false;
                    if (response.result) {
                        var orgurl = response.portalLink; //new URL(response.portalLink);
                        $scope.orgDet.orgId = (response.orgId && response.orgId != 0) ? response.orgId : 0;
                        var orghost = ((orgurl != null && orgurl != '') ? orgurl.host : "");
                        //console.log("org url=" + orghost);
                        if (checkDomain && portalurl != orghost) {
                            $scope.flagErrorMsg = true;
                            if ($scope.isClient('jcb')) {
                                $scope.error.errMgs = "Invalid employee id. Please enter correct employee id";
                            } else {
                                $scope.error.errMgs = $scope.LANG_CONST.VAL_ENTR_VLD_EML_ID;
                            }
                            $scope.isEmailVerified = false;
                        } else {
                            $scope.isEmailVerified = true;
                        }

                    } else {
                        $scope.flagErrorMsg = true;
                        if (response.statusCode == 100) {
                            if ($scope.isClient('jcb')) {
                                $scope.error.errMgs = " Invalid employee id, Please enter the correct employee id";
                            } else {
                                $scope.error.errMgs = response.reason;
                            }
                        } else {
                            if ($scope.isClient('jcb')) {
                                $scope.error.errMgs = "Invalid employee id, Please enter correct employee id";
                            } else {
                                $scope.error.errMgs = $scope.LANG_CONST.VAL_ENTR_VLD_EML_ID;
                            }
                        }
                        $scope.isEmailVerified = false;
                    }
                });
        } else {
            $scope.flagErrorMsg = true;
            if ($scope.isClient('jcb')) {
                $scope.error.errMgs = "Please enter employee id";
            } else {
                $scope.error.errMgs = $scope.LANG_CONST.VAL_ENTR_EML_ID;
            }
        }
    }

    $scope.changeEmail = function () {
        $scope.flagErrorMsg = true;
        $scope.error.errMgs = '';
        $scope.error.remainingLoginAttempts = '';
        $scope.isEmailVerified = false;
    }
    $scope.openFeedback = function () {
        $scope.feedback = {
            emailId: '',
            feedback: '',
        }
        if ($scope.orgList != null) {
            $scope.feedback = {
                organization: $scope.orgList[0].name
            }
            $scope.flagOrg = true;
        }
        $scope.queryForm.$setPristine();
        $("#FeedbackModal")
            .modal({
                backdrop: 'static',
                keyboard: false
            });
    }
    $scope.submitFeedback = function (form) {
        if (form.$invalid) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            return;
        }
        var data = {
            "feedbackType": {
                "feedbackTypeId": 1,
                "feedbackType": "Query"
            },
            "feedback": $scope.feedback.feedback,
            "sourceType": "PORTAL",
            "userName": $scope.feedback.emailId,
            "orgName": $scope.feedback.organization
        }
        //console.log(data)
        loginRegService.httpPost(data, "test/saveLoginFeedback")
            .then(function (response) {
                $scope.srNumber = response.srNumber;
                $("#FeedbackModal")
                    .modal('hide');
                if (response.result) {
                    $("#statusMessageModal")
                        .modal('show');
                } else {
                    snackbar.create('Error occurred while query submitting. Please try again', 5000, "error");
                }
            });
    }

}]);

app.controller("registerCtrl", ['$scope', 'loginRegService', '$window', 'snackbar', '$location', '$http', '$sce', '$q', '$filter', function ($scope, loginRegService, $window, snackbar, $location, $http, $sce, $q, $filter) {
    //console.log('Enter Registration page');

    $scope.loading = false;
    $scope.mobileRegex = "/^[0-9]{10,10}$/;"
    $scope.reg = {
        name: '',
        email: '',
        productId: 2,
        contactNumber: '',
        designation: '',
        location: '',
        orgName: '',
        subscripId: 1,
        country: '',
        registrationSource: ''
    };

    $scope.openScheduleModal = function () {
        $("#connectUsModal")
            .modal({
                backdrop: 'static',
                keyboard: false
            });
    }

    $scope.eml_add = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    $scope.submitLoader = false;
    $scope.userDet = {};
    $scope.submitSubscribe = function (form) {
        //console.log(form);
        $scope.submitLoader = true;
        if (form.invalid) {
            Object.keys(form.controls).forEach(key => {
                form.controls[key].markAsDirty();
            });
            this.submitLoader = false;
            return;
        }
        this.submitLoader = false;
        //console.log($scope.userDet);
    }
    $scope.getCountry = function () {
        loginRegService.httpGet('getcounterylist')
            .then(function (response) {
                //console.log(response);
                $scope.countries = response.counteryList;
            });
    }
    // $scope.getCountry();
    $scope.addCountry = function () {
        $scope.setCountry = true;
    }
    $scope.setCountryName = function (country) {
        $scope.setCountry = false;
        $scope.reg.country = country.countryName;
    }
    $scope.goRegister = function () {
        $window.location.href = "Registration.html";
    }
    $scope.emailVerify = true;
    $scope.submitRegisterForm = function (isValid, res) {
        if (isValid) {
            var reg = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!abc.com)(?!xyz.com)(?!pqr.com)(?!rediffmail.com)(?!live.com)(?!outlook.com)(?!me.com)(?!msn.com)(?!ymail.com)([\w-]+\.)+[\w-]{2,4})?$/;
            if (reg.test(res.email)) {
                $scope.emailVerify = true;
            } else {
                $scope.emailVerify = false;
                return false;
            }
            var data = angular.copy(res);
            if (data.password == data.confPassword) {
                delete data.confPassword;
            } else {
                return false;
            }
            //console.log(data);
            $scope.registerSpinner = false;
            $scope.submitFormData = data;
            $scope.submitFormData.country = "India";
            $scope.submitFormData.registrationSource = 6;
            $scope.registrationDetails = res;
            $("#confirmRegModal")
                .modal({
                    backdrop: 'static',
                    keyboard: false
                });
        } else {
            snackbar.create("Please fill mandatory fields", 5000, "error");
        }
    }

    $scope.submitRegDet = function () {
        $scope.registerSpinner = true;
        $scope.submitFormData.password = "abc";
        loginRegService.httpPost($scope.submitFormData, 'registration')
            .then(function (response) {
                //console.log(response);
                $scope.registerSpinner = false;
                $("#confirmRegModal")
                    .modal('hide');
                if (response.result) {
                    $('#myModal')
                        .modal('show');
                    if ($scope.registrationDetails) {
                        //console.log($scope.registrationDetails);
                        var data = {
                            email: $scope.registrationDetails.email,
                            name: $scope.registrationDetails.name,
                            body: ' Thank you for registration. Our team  will connect you shortly'
                        }
                        //console.log(data);
                        // $http.post('/api/send-email', { })
                        // .then(function (response) {
                        // })
                        // .catch(function (error) {
                        //     console.error(error);
                        // });
                        $window.location.href = "https://calendly.com/myenovation/30min";
                    } else {
                        snackbar.create("Please fill mandatory fields", 5000, "error");
                    }

                } else {
                    if (response.resendEmail) {
                        if (response.resendEmail) {
                            $('#reasonMsg')
                                .text(response.reason);
                            $('#reasonModal')
                                .modal('show');
                        } else {
                            $('#reasonMsg')
                                .text(response.reason);
                            $('#reasonModal')
                                .modal('show');
                        }
                    } else {
                        snackbar.create(response.reason, 5000, "error");
                    }
                }
            });
    }

    $scope.resendEmailVerify = true;
    $scope.resend = function (email) {
        //console.log(email)
        var reg = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!abc.com)(?!xyz.com)(?!pqr.com)(?!rediffmail.com)(?!live.com)(?!outlook.com)(?!me.com)(?!msn.com)(?!ymail.com)([\w-]+\.)+[\w-]{2,4})?$/;
        if (reg.test(email)) {
            $scope.resendEmailVerify = true;
        } else {
            $scope.resendEmailVerify = false;
            return false;
        }
        var data = {
            email: email
        }
        loginRegService.httpPost(data, 'resendemail')
            .then(function (response) {
                //console.log(response);
                $scope.loading = false;
                if (response.result) {
                    $('#resendModal')
                        .modal('hide');
                    $('#resendModal1')
                        .modal('show');
                    snackbar.create(response.reason, 5000, "success");
                    $scope.goHome();
                } else {
                    snackbar.create(response.reason, 5000, "error");
                }
            });

    }

    $scope.getRegistrationSourceList = function () {
        loginRegService.httpGet("test/getRegistrationSourceList")
            .then(function (response) {
                //console.log("----------registrationSourceList List--------------");
                //console.log(response);
                if (response.result)
                    $scope.registrationSourceList = response.regSource;
            });
    }

    $scope.goHome = function () {
        $window.location.href = "login.html";
    }
    // $scope.getRegistrationSourceList();

    /*-------------------------Webinar Start-----------------------------------------*/
    $scope.loading = false;
    $scope.mobileRegex = "/^[0-9]{10,10}$/;"
    $scope.webreg = {
        name: '',
        orgName: '',
        designation: '',
        contactNumber: '',
        email: '',
        topicOfWebinar: '',
        timeDuration: '',
        noOfParticipants: '',
        type: 'webinar',
        password: '12345678',
        registrationSource: 6,
        orgDomain: "GT",
        country: "India"
    };

    $scope.emailVerify = true;
    $scope.submitwebinarRegisterForm = function (isValid, res) {
        if (isValid) {
            // var webreg = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!abc.com)(?!xyz.com)(?!pqr.com)(?!rediffmail.com)(?!live.com)(?!outlook.com)(?!me.com)(?!msn.com)(?!ymail.com)([\w-]+\.)+[\w-]{2,4})?$/;
            // if (webreg.test(res.email)) {
            //     $scope.emailVerify = true;
            // } else {
            //     $scope.emailVerify = false;
            //     return false;
            // }
            var data = angular.copy(res);
            $scope.webinarregisterSpinner = false;
            $scope.submitFormData = data;
            $("#confirmRegModal1").modal('show');
        } else {
            snackbar.create("Please fill mandatory fields", 5000, "error");
        }
    }

    $scope.submitwebRegDet = function () {
        //console.log("webinar Registration", $scope.submitFormData);
        $scope.webinarregisterSpinner = true;
        loginRegService.httpPost($scope.submitFormData, 'registration')
            .then(function (response) {
                //console.log(response);
                $scope.webinarregisterSpinner = false;
                $("#confirmRegModal1")
                    .modal('hide');
                if (response.result) {
                    if (response.result) {
                        $('#myModal')
                            .modal('show');
                        $scope.webreg = {};
                    }
                } else {
                    snackbar.create(response.reason, 5000, "error");
                }
            });
    }

    $scope.gowebinarHome = function () {
        $window.location.href = "webinar.html";
    }

    /*-------------------------ACMA - Webinar Registration Start-----------------------------------------*/
    $scope.loading = false;
    $scope.mobileRegex = "/^[0-9]{10,10}$/;"
    $scope.webAcmareg = {
        firstName: '',
        lastName: '',
        mobileNo: '',
        emailId: '',
        organisation: ''
    };


    $scope.submitACMARegisterForm = function (isValid, res) {
        if (isValid) {
            var data = angular.copy(res);
            $scope.submitFormData = data;
            $scope.acmawebinarregisterSpinner = false;
            //console.log("Acma Registration Response", $scope.submitFormData);
            // return;
            loginRegService.eventHttpPost($scope.submitFormData, 'saveAcmaSponsorshipRegis').then(function (response) {
                //console.log("Acma Reg Resopse", response);
                $scope.acmawebinarregisterSpinner = false;
                if (response.result) {
                    $scope.webAcmareg = {};
                    $scope.webACMAregForm = false;
                    $scope.BtnCreate = false;
                    $scope.fileHref = 'dist/docs/Webinarsponsorshipform.docx';
                    location.href = $scope.fileHref;
                } else {
                    snackbar.create("Error occurred.Please try again", 5000, "error");
                }
            });
        } else {
            snackbar.create("Please fill mandatory fields", 5000, "error");
        }
    }

    /*------------------------------------------------------------------------*/

    /*-------------------------------------------------------------------*/
    $scope.webinarList = [{
        "id": 1,
        "topic": "INSSAN-EIC Webinar - Suggestion Management Scheme at Tata Steel",
        "date": "Fri 1st May 2020, at 3PM",
        "webinardate": "2020-05-01",
        "time": "1.30hr",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_4uA7L-4qQkKWj4T6xbrk3g",
        "speaker": [{
            "id": 0,
            "spaekerName": "Pankaj Kumar",
            "designation": "Head Training, Capability Development, HRM @Tata Steel",
            "profile": "dist/clientimg/Pankaj_Kumar.png",
        }, {
            "id": 1,
            "spaekerName": "Arindam Ghosh",
            "designation": "Head Training, Capability Development, HRM @Tata Steel",
            "profile": "dist/clientimg/arindam_Ghosh.jpg",
        }]
    },
    // {
    //     "id": 2,
    //     "topic": "INSSAN-WIC Webinar - Introduction to Six Sigma",
    //     "date": "Sat 2nd May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-02",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_cJwAtMEPRbeV6V_h-SEWGw",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dr. Abhay Kulkarni",
    //         "designation": "Director @IICMR-MBA MCA Institute",
    //         "profile": "dist/clientimg/abhay_kulkarani.png",
    //     }]
    // }, {
    //     "id": 87519027705,
    //     "topic": "ACoE Training by ACMA on - Ways to keep employees motivated in turbulent times",
    //     "date": "Sun 5th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-05",
    //     "webinardetail": "Paid Webinar",
    //     "webinarId": "87519027705",
    //     "cost": "INR 1,180/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_yTF5kezMRmG1nk4BEZ49EQ",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=27",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Dinesh Vedpathak",
    //         "designation": "CEO, Skilling & Training, ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg",
    //     }]
    // }, {
    //     "id": 84742363601,
    //     "topic": "ACoE Training by ACMA on - Metal 3D Printing Simulation: How Simufact Additive, changing way for Prototyping and Production",
    //     "date": "Thu 7th May 2020, at 3PM",
    //     "webinardate": "2020-05-07",
    //     "time": "1.30hr",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_c60zklUjRiuKBhX5YD8dyg",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=29",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Santosh Nagaraju",
    //         "designation": "Technical Specialist, MSC Software Corporation",
    //         "profile": "dist/clientimg/santhoshNagaraju.png",
    //     }]
    // }, {
    //     "id": 86292474566,
    //     "topic": "ACoE Training by ACMA on - Quality improvements through Shainin DOE technique",
    //     "date": "Fri 8th May 2020, at 3PM",
    //     "webinardate": "2020-05-08",
    //     "webinarId": "86292474566",
    //     "time": "1.30hr",
    //     "webinardetail": "Paid Webinar",
    //     "cost": "INR 1,180/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_nELOsNOgTmKIinZE4WHDDA",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=28",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Ms. Tanu Ahuja",
    //         "designation": "Counselor, ACMA",
    //         "profile": "dist/clientimg/tanu.png",
    //     }]
    // },
    {
        "id": 19,
        "topic": "Webinar on TPM for MSME",
        "date": "Sat 9th May 2020, at 3PM",
        "webinardate": "2020-05-09",
        "time": "1.30hr",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_OB15b--GQpqZJDWe4H3hXA",
        "speaker": [{
            "id": 0,
            "spaekerName": "Prem Gajpal",
            "designation": "Director Operation @Advik Hi-Tech",
            "profile": "dist/clientimg/pritam.jpeg",
        }]
    },
    //{
    //     "id": 85907804976,
    //     "topic": "ACoE Training by ACMA on - Principles of Quality Management",
    //     "date": "Tue 12th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinarId": "85907804976",
    //     "webinardate": "2020-05-12",
    //     "webinardetail": "Paid Webinar",
    //     "cost": "INR 1,180/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_lZILg-o1SE-hC9YRXSFRBg",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=31",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. V K Sharma",
    //         "designation": "Head Cluster Programs, ACMA",
    //         "profile": "dist/clientimg/DSC_9222.JPG",
    //     }]
    // }, {
    //     "id": 3,
    //     "topic": "How to Capture Thousands of Employee Ideas & Suggestions",
    //     "date": "Wed 13th May 2020, at 9:30PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-13",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://attendee.gotowebinar.com/register/6326406694396014864",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Gregory P. Smith",
    //         "designation": "President Chart Your Course International Inc.",
    //         "profile": "dist/clientimg/jreegory.jpg",
    //     }, {
    //         "id": 1,
    //         "spaekerName": "Raj Dubal",
    //         "designation": "CEO, Greentin Solutions Pvt Ltd",
    //         "profile": "dist/clientimg/Raj.JPG",
    //     }]
    // }, {
    //     "id": 83933080024,
    //     "topic": "ACoE Training by ACMA on - Welding & Brazing Simulation: Thermal Joining made easy by Simufact Welding",
    //     "date": "Thu 14th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     //  "webinarId":"83933080024",
    //     "webinardate": "2020-05-14",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_Q_JLkPE3TtSDWLwLMeWsJw",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=32",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Sandip Munnurkar",
    //         "designation": "Technical Specialist, MSC Software Corporation",
    //         "profile": "dist/clientimg/sandipMannurkr.png",
    //     }]
    // }, {
    //     "id": 89145303900,
    //     "topic": "ACoE Training by ACMA on - Ways to stabilize New Product Quality at initial production",
    //     "date": "Fri 15th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinarId": "89145303900",
    //     "webinardate": "2020-05-15",
    //     "webinardetail": "Paid Webinar",
    //     "cost": "INR 1,180/-",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=33",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_o9XK2YpcTb6DSE2Q1gIaIw",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Vishal Saxena",
    //         "designation": "Counselor ACMA & Technical Head, ACMA Centre of Excellence",
    //         "profile": "dist/clientimg/Vishal.jpg",
    //     }]
    // },
    // {
    //     "id": 16,
    //     "topic": "Wellness During Corona Lock Down",
    //     "date": "Sun 17th May 2020, at 11AM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-17",
    //     "webinardetail": "Free Webinar",
    //     "cost": "",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_uc5UbZkNRDuMsPdTNRaVWw",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dr.Vidydhar Kumbhar",
    //         "designation": "(MD Ayurved)",
    //         "profile": "",
    //     }, {
    //         "id": 1,
    //         "spaekerName": "Dr.Pushkar Khair",
    //         "designation": "(MBBS,DNB) ",
    //         "profile": "",
    //     }]
    // }, {
    //     "id": 88348644451,
    //     "topic": "ACoE Training by ACMA on - Electric Vehicle - At a glance to major component - Powertrain",
    //     "date": "Tue 19th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-19",
    //     "startsAt": "2020-05-19T16:00:00.000",
    //     "webinarId": "88348644451",
    //     "webinardetail": "Paid Webinar",
    //     "cost": "INR 1,180/-",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=34",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_Y57-HEwYTjOBY6OqbSxnyA",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Raunak Chaudhry",
    //         "designation": "EV Motor & Controller Designer, Autobot Engineers",
    //         "profile": "",
    //     }]
    // },
    // {
    //     "id": 20,
    //     "topic": "ACoE Training by ACMA on - Recommendation for Lubricants for Various Industrial applications by HPCL",
    //     "date": "Wed 20th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-20",
    //     "startsAt": "2020-05-20T16:00:00.000",
    //     "webinardetail": "Free Webinar",
    //     "cost": "",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_pkcarhphTjmkmdCk3Yu9Zw",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=36",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": " Mr. Ashwani Kumar Agarwal",
    //         "designation": "DGM Technical Services, HPCL",
    //         "profile": "",
    //     }, {
    //         "id": 1,
    //         "spaekerName": "Mr. Abhijit Sarkar",
    //         "designation": "DGM Technical Services, HPCL",
    //         "profile": "",
    //     }]
    // }, {
    //     "id": 86987552961,
    //     "topic": "ACoE Training by ACMA on - Methods for Inventory less production with New Methods of Shop floor Layouts",
    //     "date": "Fri 22nd May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-22",
    //     "webinarId": "86987552961",
    //     "startsAt": "2020-05-22T16:00:00.000",
    //     "webinardetail": "Paid Webinar",
    //     "cost": "INR 1,180/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_zBF5-fVxSgSLcxXVqKmE_w",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=35",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Dinesh Vedpathak",
    //         "designation": "CEO, Skilling & Training, ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg",
    //     }]
    // }, {
    //     "id": 86406927865,
    //     "topic": "ACoE Training by ACMA on - Mathematics of Productivity and Synchronisation of supply chain",
    //     "date": "Tus 26th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-26",
    //     "webinarId": "86406927865",
    //     "startsAt": "2020-05-26T16:00:00.000",
    //     "webinardetail": "Paid Webinar",
    //     "cost": "INR 1,180/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_h-_duCnpR-u12YW3iXCGBQ",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=37",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Girish Govande",
    //         "designation": "Head Supply Chain Management, ACMA",
    //         "profile": "dist/clientimg/girish.jpeg",
    //     }]
    // }, 
    {
        "id": 20,
        "topic": "Digital Series - Paperless Audit/Inspection - myeNovation",
        "date": "Thu 28th May 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-05-28",
        "startsAt": "2020-05-28T16:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_-uDMO5AeQFiktOWSJVqgjw",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=40",
        "speaker": [{
            "id": 0,
            "spaekerName": "Raj Dubal",
            "designation": "CEO, Greentin Solutions Pvt Ltd",
            "profile": "dist/clientimg/Raj.JPG",
        }, {
            "id": 1,
            "spaekerName": "Sachin Shinde",
            "designation": "Head - Global Delivery & Business Development at Greentin Solutions",
            "profile": "dist/clientimg/sachin.png",
        }]
    },
    // {
    //     "id": 84319899393,
    //     "topic": "ACoE Training by ACMA on - Planning and Capacity Building for Automotive component makers",
    //     "date": "Fri 29th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-29",
    //     "webinarId": "84319899393",
    //     "startsAt": "2020-05-29T16:00:00.000",
    //     "webinardetail": "Paid Webinar",
    //     "cost": "INR 1,180/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_s6YNwNaASs-7KmBNK74QYw",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=38",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Sushil Sharma",
    //         "designation": "Head ACMA-UNIDO Programs",
    //         "profile": "dist/clientimg/sushilSharma.png",
    //     }]
    // },
    // {
    //     "id": 21,
    //     "topic": "Application of Dimensional Variation Analysis Tool",
    //     "date": "Sat 30th May 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-05-30",
    //     "startsAt": "2020-05-30T16:00:00.000",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_tZS8MojdRUuBhbUMS-Gzrg",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=41",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Rajendra Deshmukh",
    //         "designation": "Principal Consultant @iSquare, Pune",
    //         "profile": "dist/clientimg/rajendra.jpg"
    //     }, {
    //         "id": 1,
    //         "spaekerName": "Mr. Indrajeet Patil",
    //         "designation": "C.E.O @Technorithm Engineering",
    //         "profile": "dist/clientimg/indrajeet.jpg"
    //     }]
    // }, 
    {
        "id": 23,
        "topic": "The Seven Wastes",
        "date": "Sun 31st May 2020, at 11AM",
        "time": "1.30hr",
        "webinardate": "2020-05-31",
        "startsAt": "2020-05-31T12:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_zzP9kR8CTrmFbymZTJMIfA",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=42",
        "speaker": [{
            "id": 0,
            "spaekerName": "Hemant Apastamb",
            "designation": "Head Production (Plant Head - Rieter India Pvt. Ltd., Pune)",
            "profile": "dist/clientimg/hemant.png",
        }]
    }, {
        "id": 4,
        "topic": "Suggestion Scheme - Scientific Methodology for Effective Implementation For Driving Results",
        "date": "Wed 8th April 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-04-08",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://zoom.us/webinar/register/WN_o_Z1QuCASTmTJ_JGL8WjoA",
        "speaker": [{
            "id": 0,
            "spaekerName": "Sudhir Date",
            "designation": "Founder Member of INSSAN and Member at HQ, INSSAN",
            "profile": "dist/clientimg/SudhirDate.jpeg",
        }]
    }, {
        "id": 5,
        "topic": "Digital Transformation - Suggestion Scheme, Kaizen, Continuous Improvement",
        "date": "Thu 9th April 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-04-09",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://zoom.us/webinar/register/WN_35z-HSThQHyReCVYAlBiPA",
        "speaker": [{
            "id": 0,
            "spaekerName": "Raj Dubal",
            "designation": "CEO, Greentin Solutions Pvt Ltd",
            "profile": "dist/clientimg/Raj.JPG",
        }]
    },
    // {
    //     "id": 6,
    //     "topic": "Methods for Inventory-less Production",
    //     "date": "Fri 10th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-10",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_978MvDZIQg2Pb6XjRgkVPw",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg",
    //     }]
    // }, 
    {
        "id": 7,
        "topic": "Suggestion Scheme - Process, Roles and Responsibilities - Supervisor, Evaluator and Implementer",
        "date": "Mon 13th April 2020, at 3PM ",
        "time": "1.30hr",
        "webinardate": "2020-04-13",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://zoom.us/webinar/register/WN_5Un3PIYGTsi_RGVVYRR4-w",
        "speaker": [{
            "id": 0,
            "spaekerName": "Jaiprakash Zende",
            "designation": "Founder Member of INSSAN and Member at HQ, INSSAN",
            "profile": "dist/clientimg/jayprakash.jpg",
        }, {
            "id": 1,
            "spaekerName": "Sachin Shinde",
            "designation": "Head - Global Delivery & Business Development at Greentin Solutions",
            "profile": "dist/clientimg/sachin.png",
        }]
    },
    // {
    //     "id": 8,
    //     "topic": "ACoE Webinar on - Preparedness for restart after lockdown of Covid-19",
    //     "date": "Mon 13th April 2020, at 4:45PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-13",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_DA8jwZsTSLqI1jaSn0ppGg",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=15",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg"
    //     }]
    // }, {
    //     "id": 9,
    //     "topic": "NPD Quality Control to Achieve Stable Initial Product Quality",
    //     "date": "Tue 14th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-14",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_s7H0jeVzRvO12V6beOmhTw",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Vishal Saxena",
    //         "designation": "NPD Counsellor, ACMA",
    //         "profile": "dist/clientimg/Vishal.jpg",
    //     }]
    // }, {
    //     "id": 10,
    //     "topic": "ACoE Webinar on - Ways to operate within available resources",
    //     "date": "Thu 16th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-16",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_QyzGIpQFQAi2gmjzwUBrvA",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=16",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg"
    //     }]
    // }, {
    //     "id": 11,
    //     "topic": "ACoE Webinar For Only Rs - 600/- Methods for Inventory less production – Part 2",
    //     "date": "Fri 17th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-17",
    //     "webinardetail": "Paid Webinar",
    //     "cost": "INR 600/-",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_Xy05W4zXTrmnqJy96GBPRg",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=14",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg"
    //     }]
    // }, {
    //     "id": 12,
    //     "topic": "ACoE Webinar on - Ways to manage supply chain in adverse conditions",
    //     "date": "Mon 20 April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-20",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_NTa-ZV0pRKOLH00kqlhkMQ",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=17",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Girish Govande",
    //         "designation": "HEAD SUPPLY CHAIN ENGAGEMENT @ACMA",
    //         "profile": "dist/clientimg/girish.jpeg",
    //     }]
    // }, {
    //     "id": 13,
    //     "topic": "Electric Vehicle- At a Glance to Major Components- Li-Battery and BMS",
    //     "date": "Wed 22nd April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-22",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_cTgiNZ0jSUeBUKMcSSn8ZQ",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=18",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Sunil Trikha - Panelist",
    //         "designation": "",
    //         "profile": "dist/clientimg/SunilTrikha.png",
    //     }, {
    //         "id": 1,
    //         "spaekerName": "Ashwini Tiwary",
    //         "designation": "Founder & CMO @Autobot India Pvt. Ltd",
    //         "profile": "dist/clientimg/ashwini.jpg",
    //     }]
    // }, {
    //     "id": 14,
    //     "topic": "ACoE Webinar on - Driving New product development in express mode",
    //     "date": "Fri 24th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-24",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_QEysHqnQTDy2fB2cu7mr2Q",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=19",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Vishal Saxena",
    //         "designation": "NPD Counsellor, ACMA",
    //         "profile": "dist/clientimg/Vishal.jpg",
    //     }]
    // }, {
    //     "id": 15,
    //     "topic": "ACoE Webinar on - Preparedness for restart after lockdown of Covid-19",
    //     "date": "Mon 27th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-27",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_Tu5cnMENSJuZnyeURJRo3A",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=20",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg"
    //     }]
    // }, {
    //     "id": 16,
    //     "topic": "Introduction to 3D experience platform",
    //     "date": "Tue 28th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-28",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_IyT9F-9ARHSrl-ZSy-cXnA",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=21",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Rupesh Khopade",
    //         "designation": "Regional Technical Sales Manager @Dassault Systems",
    //         "profile": "",
    //     }]
    // }, {
    //     "id": 17,
    //     "topic": "A curtain raiser on various new programs offered by ACMA to help component manufacturers become profitable rapidly, in post-lockdown market",
    //     "date": "Wed 29th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-29",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_R8TTUfoTThevYZFr7_aOQg",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=22",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg"
    //     }, {
    //         "id": 1,
    //         "spaekerName": "V K Sharma",
    //         "designation": "Head Cluster Programs, ACMA",
    //         "profile": "dist/clientimg/DSC_9222.JPG"
    //     }, {
    //         "id": 0,
    //         "spaekerName": "Sunil Mutha",
    //         "designation": "Deputy executive Director",
    //         "profile": "dist/clientimg/DSC_9187.JPG"
    //     }]
    // }, {
    //     "id": 18,
    //     "topic": "ACoE Webinar on - How to motivate teams and leaders to mitigate tough times",
    //     "date": "Thu 30th April 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-04-30",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://zoom.us/webinar/register/WN_EI3fpSWZSJS9nUEnqoX_2g",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg"
    //     }]
    // },
    // {
    //     "id": 25,
    //     "topic": "ACMA Centre of Excellence - Avoid Product recalls by stopping defects at Source",
    //     "date": "Wed 3rd June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-03",
    //     "startsAt": "2020-06-03T16:00:00.000",
    //     // "webinardetail": "Paid Webinar",
    //     "cost": "ACMA Members : INR 1200/-",
    //     "costNonacma": "Non ACMA Members :  INR 1320/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_o_DrkF0QQWa0Oe5y797eCg",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=43",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg"
    //     }]
    // }, 
    {
        "id": 19,
        "topic": "Innovate - How to Capture Thousands of Employee Ideas & Suggestions",
        "date": "Thu 4th June 2020, at 5PM",
        "time": "1.30hr",
        "webinardate": "2020-06-04",
        "startsAt": "2020-06-04T18:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_af2VMfNkR0iq7yc5xQp9og",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=39",
        "speaker": [{
            "id": 0,
            "spaekerName": "Gregory P. Smith",
            "designation": "President Chart Your Course International Inc.",
            "profile": "dist/clientimg/jreegory.jpg",
        }, {
            "id": 1,
            "spaekerName": "Raj Dubal",
            "designation": "CEO, Greentin Solutions Pvt Ltd",
            "profile": "dist/clientimg/Raj.JPG",
        }]
    },
    // {
    //     "id": 30,
    //     "topic": "ACMA Centre of Excellence - Resilience for Auto Component Industry –“When the going gets tough, the Tough gets going“ ",
    //     "date": "Fri 5th June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-05",
    //     "startsAt": "2020-06-05T16:00:00.000",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_AiZqo_pnSQ-EeF8s-TBigA",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=48",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. J M RadhaKrishna",
    //         "designation": "HRD &Organization Consultant,SEQUA GGMBH",
    //         "profile": "dist/clientimg/jm.png",
    //     }]

    // }, {
    //     "id": 22,
    //     "topic": "Virtual Townhall Forum - Sharing Practices for Managing COVID-19 Crisis",
    //     "date": "Sat 6th June 2020, at 3PM",
    //     "time": "2.30hr",
    //     "webinardate": "2020-06-06",
    //     "startsAt": "2020-06-06T15:00:00.000",
    //     "webinardetail": "Town hall",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_w2ax-V_GSk6jip0xcR1_VQ",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "This is Virtual Town Hall one should attend for understanding best Practices undertaken by various companies for Managing COVID-19 Crisis."
    //     }]
    // }, 
    {
        "id": 26,
        "topic": "Free Webinar By INSSAN - Be Positive/ Power of Positive Thinking",
        "date": "Mon 8th June 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-06-08",
        "startsAt": "2020-06-08T16:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_bQUPOgPlQUCLWkMlkBFlZg",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=58",
        "speaker": [{
            "id": 0,
            "spaekerName": "Jaiprakash Zende",
            "designation": "Member of Council and Founder Member @INSSAN - Indian National Suggestion Schemes' Association",
            "profile": "dist/clientimg/jayprakash.jpg"
        }]
    },
    // {
    //     "id": 26,
    //     "topic": "ACMA Centre of Excellence - Cost Reduction through Waste Management Techniques",
    //     "date": "Tue 9th June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-09",
    //     "startsAt": "2020-06-09T16:00:00.000",
    //     // "webinardetail": "Paid Webinar",
    //     "cost": "ACMA Members : INR 1200/-",
    //     "costNonacma": "Non ACMA Members :  INR 1320/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_wtV2OmyhTLaanzESixicQQ",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=44",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Aniket Khasnis",
    //         "designation": "Sr. Counselor, ACMA @ACMA",
    //         "profile": "dist/clientimg/ankiet.png"
    //     }]
    // }, 
    // {
    //     "id": 27,
    //     "topic": "ACMA Centre of Excellence - Efficient Project Management Techniques for New Product Development",
    //     "date": "Sat 13th June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-13",
    //     "startsAt": "2020-06-13T16:00:00.000",
    //     // "webinardetail": "Paid Webinar",
    //     "cost": "ACMA Members : INR 1200/-",
    //     "costNonacma": "Non ACMA Members :  INR 1320/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_y-eQ2_3uSlu23TtkLwWP_Q",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=45",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Vishal Saxena",
    //         "designation": "Counselor ACMA & Technical Head, ACMA Centre of Excellence",
    //         "profile": "dist/clientimg/Vishal.jpg"
    //     }]
    // }, 
    {
        "id": 38,
        "topic": "Leveraging TEI for Business results & 100% engagement of workforce",
        "date": "Fri 12th June 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-06-12",
        "startsAt": "2020-06-12T16:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_diV9tfVKQWyhI1ewQ0ZqvA",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=60",
        "speaker": [{
            "id": 0,
            "spaekerName": "G Ramesh",
            "designation": "Assistant Manager – TQC (Kaizen) @TVS Motor Company Ltd., Hosur",
            "profile": "dist/clientimg/RameshG.png"
        }]
    },
    {
        "id": 37,
        "topic": "Webinar By INSSAN - Enable Digital Transformation in your Organisation",
        "date": "Sat 13th June 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-06-13",
        "startsAt": "2020-06-13T16:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_4slfJYQ8QfCB4BsYjhD4qg",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=61",
        "speaker": [{
            "id": 0,
            "spaekerName": "Jai Kumar Soni",
            "designation": "Project I4.0 & Automation @Shriram Pistons & Rings Limited ",
            "profile": "dist/clientimg/jaiKumarSoni.jpg"
        }]
    },

    // {
    //     "id": 31,
    //     "topic": "ACMA Centre of Excellence - Session 1 - Roadmap to Sustainability – Industry 4.0 And Session 2 - Seeding Innovation in the Organizations",
    //     "date": "Mon 15th June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-15",
    //     "startsAt": "2020-06-15T16:00:00.000",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_smVyqVLJSK-wZA1GN7OL-w",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=49",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Tarun Sharma",
    //         "designation": "COO, NRV DesignX Pvt Ltd",
    //         "profile": "dist/clientimg/tarun.jpg"
    //     }, {
    //         "id": 1,
    //         "spaekerName": "Mr. Girish Govande",
    //         "designation": "Head Supply Chain Management, ACMA",
    //         "profile": "dist/clientimg/girish.jpeg",
    //     }]
    // },
    {
        "id": 38,
        "topic": "Free Webinar By INSSAN - Be Creative / Enrich Your Life with Creativity ",
        "date": "Tue 16th June 2020, at 6PM",
        "time": "1.30hr",
        "webinardate": "2020-06-16",
        "startsAt": "2020-06-16T19:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_XaDLGQFfQo60soqKAUT0IQ",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=62",
        "speaker": [{
            "id": 0,
            "spaekerName": "Jaiprakash Zende",
            "designation": "Founder and Council Member @INSSAN - Indian National Suggestion Schemes' Association",
            "profile": "dist/clientimg/jayprakash.jpg"
        }]
    }, {
        "id": 39,
        "topic": "Cloud based and Digital solution for Suggestion Schemes/ Kaizen/Continuous Improvement",
        "date": "Fri 19th June 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-06-19",
        "startsAt": "2020-06-19T16:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_MSJmi0xbSiWMoYF0GiK8-Q",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=63",
        "speaker": [{
            "id": 0,
            "spaekerName": "Raj Dubal",
            "designation": "CEO, Greentin Solutions Pvt Ltd",
            "profile": "dist/clientimg/Raj.JPG",
        }]
    },
    // {
    //     "id": 28,
    //     "topic": "ACMA Centre of Excellence - Vendor assessment: Assessing the roots and nerves of the automotive industry.",
    //     "date": "Sat 20th June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-20",
    //     "startsAt": "2020-06-20T16:00:00.000",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_UV2N4ZoHTB2e5whChxoPHQ",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=59",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Miren Lodha",
    //         "designation": "Director @CRISIL Research",
    //         "profile": "dist/clientimg/miren.jpg"
    //     }]
    // }, 
    {
        "id": 40,
        "topic": "Free Webinar By INSSAN - How to Generate Good Ideas",
        "date": "Mon 22nd June 2020, at 6PM",
        "time": "1.30hr",
        "webinardate": "2020-06-22",
        "startsAt": "2020-06-22T19:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_7qaoYRkNQLixsteS6L4dQg",
        "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=64",
        "speaker": [{
            "id": 0,
            "spaekerName": "Jaiprakash Zende",
            "designation": "Founder and Council Member @INSSAN - Indian National Suggestion Schemes' Association",
            "profile": "dist/clientimg/jayprakash.jpg"
        }]
    },
    // {
    //     "id": 28,
    //     "topic": "ACMA Centre of Excellence - Cost and Design Optimization using Ansys Tools",
    //     "date": "Tue 16th June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-16",
    //     "startsAt": "2020-06-16T16:00:00.000",
    //     // "webinardetail": "Paid Webinar",
    //     "cost": "ACMA Members : INR 1200/-",
    //     "costNonacma": "Non ACMA Members :  INR 1320/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN__pi4Fto7TZ-pMDCNXN56hQ",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=46",
    //     "speaker": [{
    //         "id": 1,
    //         "spaekerName": "Mr. Sai Pavan",
    //         "designation": "Entuple Technologies",
    //         "profile": ""
    //     }]
    // }, {
    //     "id": 29,
    //     "topic": "ACMA Centre of Excellence - Techniques to achieve Zero Customer complaints",
    //     "date": "Thu 18th June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-18",
    //     "startsAt": "2020-06-18T16:00:00.000",
    //     // "webinardetail": "Paid Webinar",
    //     "cost": "ACMA Members : INR 1200/-",
    //     "costNonacma": "Non ACMA Members :  INR 1320/-",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_EJvKz_arSUa_5kt3XnEoOg",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=47",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dinesh Vedpathak",
    //         "designation": "CEO, Skilling and Training ACMA",
    //         "profile": "dist/clientimg/Dinesh.jpg"
    //     }]
    // },
    // {
    //     "id": 32,
    //     "topic": "ACMA Centre of Excellence - Session 1 - Let’s Grow together And Session 2 - Role of Leadership, Inspiration & Partnerships in Current crisis for professionals & Entrepreneurs",
    //     "date": "Tue 23rd June 2020, at 11AM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-23",
    //     "startsAt": "2020-06-23T11:00:00.000",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_2bNQcGSiQ0SF1DcwHLemUQ",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=50",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Jaideep Singh Rathore",
    //         "designation": "BPCS Petro",
    //         "profile": "dist/clientimg/jaideep.jpeg"
    //     }, {
    //         "id": 1,
    //         "spaekerName": "Mr. Rama Shankar Pandey",
    //         "designation": "Managing Director, Hella India Lighting Limited",
    //         "profile": "dist/clientimg/ramashankar.jpg"
    //     }]
    // },
    // {
    //     "id": 33,
    //     "topic": "ACMA Centre of Excellence -Session 1- I am Manufacturing 4.0 And Session 2-Collaborative Design on Cloud",
    //     "date": "Thu 25th June 2020, at 3PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-25",
    //     "startsAt": "2020-06-25T16:00:00.000",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_oQ7zzRN4TpmMiHJJdtzspw",
    //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=51",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Mr. Gaurav Sarup",
    //         "designation": "MD, Marshall Machines Limited",
    //         "profile": "dist/clientimg/gaurav.png"
    //     }, {
    //         "id": 1,
    //         "spaekerName": "Mr. Vivek Sirohi",
    //         "designation": "Technical Support Manager, EDS Technologies",
    //         "profile": "dist/clientimg/vivek.jpg"
    //     }]
    // }, 
    {
        "id": 24,
        "topic": "Technical Paper Contest - Employee Engagement : Impact, Challenges & Way Forward Covid-19",
        "date": "Sat 27th June 2020, at 11AM",
        "time": "2.30hr",
        "webinardate": "2020-06-27",
        "startsAt": "2020-06-27T12:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_0bhnMszWRhCDxOpncJsqaA",
        "speaker": [{
            "id": 0,
            "spaekerName": "Judge - Jaiprakash Zende",
            "designation": "Founder Member of INSSAN and Member at HQ, INSSAN",
            "profile": "dist/clientimg/jayprakash.jpg",
        }, {
            "id": 1,
            "spaekerName": "Judge - Mr. Prakash Avachat",
            "designation": "Ex General Manager Business Excellence Services CVBU Pune Tata Motors Ltd.",
            "profile": "dist/clientimg/prakash.jpg",
        }]
    },
    // {
    //     "id": 25,
    //     "topic": "Free Webinar By INSSAN - Ergonomics during Work From Home",
    //     "date": "Mon 29th June 2020, at 6.30PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-29",
    //     "startsAt": "2020-06-29T06:30:00.000",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_3sJjLARyStOD-a1ACe-7jg",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Dr. Leena Auty",
    //         "designation": "Physiotherapist @Dr Leena,s Advanced Physiotherapy Centre.",
    //         "profile": "dist/clientimg/leenaAuty.jpg",
    //     }]
    // },
    // {
    //     "id": 26,
    //     "topic": "Why I failed in First Attempt? ",
    //     "date": "Mon 29th June 2020, at 9PM",
    //     "time": "1.30hr",
    //     "webinardate": "2020-06-29",
    //     "startsAt": "2020-06-29T09:00:00.000",
    //     "webinardetail": "Free Webinar",
    //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_rjRed0OYTzemL46H_iXbcQ",
    //     "speaker": [{
    //         "id": 0,
    //         "spaekerName": "Nikhil Pingale Sir ",
    //         "designation": "IPS",
    //         "profile": "dist/clientimg/NikhilPingale.jpg",
    //     }]
    // },
    {
        "id": 27,
        "topic": "Innovate - How to Capture Thousands of Employee Ideas & Suggestions",
        "date": "Tue 7th July 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-07-07",
        "startsAt": "2020-07-07T15:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_G2rCZNz2T3G4H8gQ9YPZXw",
        "feedbackLink": "https://greentinsolutions.myenovation.com/mv/index.html?id1=1&id2=67",
        "speaker": [{
            "id": 0,
            "spaekerName": "Raj Dubal",
            "designation": "CEO @Greentin Solutions Pvt Ltd",
            "profile": "dist/clientimg/Raj.JPG",
        }, {
            "id": 1,
            "spaekerName": "Umesh Bapat",
            "designation": "President of Indian National Suggestion Schemes' Association",
            "profile": "dist/clientimg/umesh.png",
        }]
    }, {
        "id": 28,
        "topic": "Digital Series - Paper less Audit/Inspection - myeNovaiton",
        "date": "Mon 20th July 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-07-20",
        "startsAt": "2020-07-20T16:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_tdNDqnwoSN2X0wrRQNEVFw",
        "feedbackLink": "https://greentinsolutions.myenovation.com/mv/index.html?id1=1&id2=66",
        "speaker": [{
            "id": 0,
            "spaekerName": "Raj Dubal",
            "designation": "CEO @Greentin Solutions Pvt Ltd",
            "profile": "dist/clientimg/Raj.JPG",
        }, {
            "id": 1,
            "spaekerName": "Sachin Shinde",
            "designation": "Head - Global Delivery & Business Development at Greentin Solutions",
            "profile": "dist/clientimg/sachin.png",
        }]
    }, {
        "id": 29,
        "topic": "INSSAN - WIC - Panel Discussion on - Opportunities and Challenges of HR in Present Recovery & post COVID19 Resurgence Era",
        "date": "Sat 1st Aug 2020, at 4PM",
        "time": "1.30hr",
        "webinardate": "2020-08-01",
        "startsAt": "2020-08-01T17:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://attendee.gotowebinar.com/register/333399821844781067",
        "speaker": [{
            "id": 0,
            "spaekerName": "Dr. Abhay Kulkarni",
            "designation": "Director IICMR",
            "profile": "dist/clientimg/abhay_kulkarani.png",
        }, {
            "id": 2,
            "spaekerName": "Nora Bhatia",
            "designation": "Vice President - HR Mahindra Accelo",
            "profile": "dist/clientimg/noraBhatia.jpg"
        }, {
            "id": 3,
            "spaekerName": "Monali Ringe",
            "designation": "Sr. Manager HR Excellence, Rieter India Pvt.Ltd",
            "profile": "dist/clientimg/monaliRinge.jpg"
        }, {
            "id": 4,
            "spaekerName": "Rajesh Kamath",
            "designation": "Founder- Chanakya Consulting Insights & Co-Founder- MTHR Global",
            "profile": "dist/clientimg/rajeshKamath.jpg"
        }, {
            "id": 5,
            "spaekerName": "Rajan Sinha",
            "designation": "CEO - Mantrana Consulting Pvt Ltd",
            "profile": "dist/clientimg/rajanSinha.jpg"
        }]
    }, {
        "id": 30,
        "topic": "6S: 5S + Safety - Online training session",
        "date": "Fri 14th Aug 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-08-14",
        "startsAt": "2020-08-14T16:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://attendee.gotowebinar.com/register/5475794814481630733",
        "speaker": [{
            "id": 0,
            "spaekerName": "Ashok Sharma",
            "designation": "Director AEC Pvt Ltd & Innovationext",
            "profile": "dist/clientimg/ashokSharma.jpg",
        }]
    },
    {
        "id": 31,
        "topic": "INSSAN Webinar on Behaviour - based safety (BBS)",
        "date": "Sat 29th Aug 2020, at 3PM",
        "time": "1.30hr",
        "webinardate": "2020-08-29",
        "startsAt": "2020-08-29T16:00:00.000",
        "webinardetail": "Free Webinar",
        "Registrationlink": "https://register.gotowebinar.com/register/1877113048311066892",
        "speaker": [{
            "id": 0,
            "spaekerName": "Mangesh Brahme",
            "designation": "Radiological Safety Officer, Approved Statutory Safety Auditor, Gov of India",
            "profile": "dist/clientimg/maheshBrahme.png",
        }]
    }
        // {
        //     "id": 34,
        //     "topic": "ACMA Centre of Excellence - Paid Certification course (Session 1) - Techniques of Leveled Production",
        //     "date": "Sat 27th June 2020, at 3PM",
        //     "time": "1.30hr",
        //     "webinardate": "2020-06-27",
        //     "startsAt": "2020-06-27T16:00:00.000",
        //     "webinardetail": "Paid Certification",
        //     "cost": "ACMA Members : INR 4000/-",
        //     "costNonacma": "Non ACMA Members : INR 4400/-",
        //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_-qTIiErWTwiNZskdDPHlug",
        //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=52",
        //     "speaker": [{
        //         "id": 0,
        //         "spaekerName": "Mr. Girish Govande",
        //         "designation": "Head Supply Chain Management, ACMA",
        //         "profile": "dist/clientimg/girish.jpeg",
        //     }]

        // }, {
        //     "id": 35,
        //     "topic": "ACMA Centre of Excellence - Paid Certification course (Session 1) - Communication and Presentation skills",
        //     "date": "Tue 30th June 2020, at 3PM",
        //     "time": "1.30hr",
        //     "webinardate": "2020-06-30",
        //     "startsAt": "2020-06-30T16:00:00.000",
        //     "webinardetail": "Paid Certification",
        //     "cost": "ACMA Members : INR 4000/-",
        //     "costNonacma": "Non ACMA Members : INR 4400/-",
        //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_58-XoZ_kRRaesQK0juypYw",
        //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=53",
        //     "speaker": [{
        //         "id": 0,
        //         "spaekerName": "Mr. V K Sharma",
        //         "designation": "Head Cluster Programs, ACMA",
        //         "profile": "dist/clientimg/DSC_9222.JPG",
        //     }]

        // }, {
        //     "id": 36,
        //     "topic": "ACMA Centre of Excellence - Paid Certification course (Session 2) - Techniques of Leveled Production",
        //     "date": "Sat 4th July 2020, at 3PM",
        //     "time": "1.30hr",
        //     "webinardate": "2020-07-04",
        //     "startsAt": "2020-07-04T16:00:00.000",
        //     "webinardetail": "Paid Certification",
        //     "cost": "ACMA Members : INR 4000/-",
        //     "costNonacma": "Non ACMA Members : INR 4400/-",
        //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_LGP9hEVwRXqnf7UAwBP8EA",
        //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=54",
        //     "speaker": [{
        //         "id": 0,
        //         "spaekerName": "Mr. Girish Govande",
        //         "designation": "Head Supply Chain Management, ACMA",
        //         "profile": "dist/clientimg/girish.jpeg",
        //     }]

        // }, {
        //     "id": 36,
        //     "topic": "ACMA Centre of Excellence - Paid Certification course (Session 2) - Communication and Presentation skills",
        //     "date": "Tue 7th July 2020, at 3PM",
        //     "time": "1.30hr",
        //     "webinardate": "2020-07-07",
        //     "startsAt": "2020-07-07T16:00:00.000",
        //     "webinardetail": "Paid Certification",
        //     "cost": "ACMA Members : INR 4000/-",
        //     "costNonacma": "Non ACMA Members : INR 4400/-",
        //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_YJ3aNQUsSoG9rJK-Ri-eXg",
        //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=55",
        //     "speaker": [{
        //         "id": 0,
        //         "spaekerName": "Mr. V K Sharma",
        //         "designation": "Head Cluster Programs, ACMA",
        //         "profile": "dist/clientimg/DSC_9222.JPG",
        //     }]

        // }, {
        //     "id": 37,
        //     "topic": "ACMA Centre of Excellence - Paid Certification course (Session 3) - Techniques of Leveled Production",
        //     "date": "Sat 11th July 2020, at 3PM",
        //     "time": "1.30hr",
        //     "webinardate": "2020-07-11",
        //     "startsAt": "2020-07-11T16:00:00.000",
        //     "webinardetail": "Paid Certification",
        //     "cost": "ACMA Members : INR 4000/-",
        //     "costNonacma": "Non ACMA Members : INR 4400/-",
        //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_zcy8uHWYSWOaaCZkyKWQfw",
        //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=56",
        //     "speaker": [{
        //         "id": 0,
        //         "spaekerName": "Mr. Girish Govande",
        //         "designation": "Head Supply Chain Management, ACMA",
        //         "profile": "dist/clientimg/girish.jpeg",
        //     }]

        // }, {
        //     "id": 38,
        //     "topic": "ACMA Centre of Excellence - Paid Certification course (Session 3) - Communication and Presentation skills",
        //     "date": "Tue 14th July 2020, at 3PM",
        //     "time": "1.30hr",
        //     "webinardate": "2020-07-14",
        //     "startsAt": "2020-07-14T16:00:00.000",
        //     "webinardetail": "Paid Certification",
        //     "cost": "ACMA Members : INR 4000/-",
        //     "costNonacma": "Non ACMA Members : INR 4400/-",
        //     "Registrationlink": "https://us02web.zoom.us/webinar/register/WN_9AFfs4FUQKSpj1LRO-NwTQ",
        //     "feedbackLink": "https://acma.myenovation.com/mv/index.html?id1=10&id2=57",
        //     "speaker": [{
        //         "id": 0,
        //         "spaekerName": "Mr. V K Sharma",
        //         "designation": "Head Cluster Programs, ACMA",
        //         "profile": "dist/clientimg/DSC_9222.JPG",
        //     }]

        // }
    ];
    //console.log("Webinar List", $scope.webinarList);

    $scope.duplicateList = $scope.webinarList;
    $scope.mainTab = 1;
    $scope.setMainTab = function (tabId) {
        $scope.mainTab = tabId;
        if ($scope.mainTab == 1) {
            $scope.getupcomingList();
        } else if ($scope.mainTab == 2) {
            $scope.getrecordedList();
        } else if ($scope.mainTab == 3) {
            $scope.getPastList();
        }
    };

    $scope.isSetMainTab = function (tabId) {
        return $scope.mainTab === tabId;
    };

    // $scope.pastList = [];
    // $scope.upcomingList = [];
    // $scope.recordedList = [];

    // $scope.sampleFunc = function (webDate) {
    //     const currDate = new Date();
    //     currDate.setDate(currDate.getDate() - 1);
    //     return new Date(webDate) > currDate;
    // };

    // for (let i = 0; i < $scope.webinarList.length; i++) {
    //     const obj = $scope.webinarList[i];
    //     $scope.sampleFunc(obj.webinardate) ? $scope.upcomingList.push(obj) : $scope.pastList.push(obj);
    //     if (obj.webinardetail == 'Paid Webinar') {
    //         $scope.sampleFunc(obj.webinardate) ? '' : $scope.recordedList.push(obj);
    //     }
    // }

    //console.log("upcoming list", $scope.upcomingList);
    //console.log("past List", $scope.pastList);

    // $scope.getupcomingList = function () {
    //     $scope.webinarList = $scope.upcomingList;
    //     return $scope.webinarList;
    // }
    // $scope.getupcomingList();

    // $scope.getPastList = function () {
    //     $scope.pastList = $filter('orderBy')($scope.pastList, 'webinardate', true);
    //     $scope.webinarList = $scope.pastList;
    //     return $scope.pastList;
    // }

    // $scope.getrecordedList = function () {
    //     $scope.recordedList = $filter('orderBy')($scope.recordedList, 'webinardate', true);
    //     $scope.webinarList = $scope.recordedList;
    //     return $scope.webinarList;
    // }

    /*-----------------17-07-2020---------*/
    $scope.getwebinarList = function () {
        $scope.webinarList = $filter('orderBy')($scope.webinarList, 'webinardate', true);
        //console.log("Webinar List", $scope.webinarList);
    }
    $scope.getwebinarList();
    /*---19-05-2020---*/
    $scope.isFeedbackActive = function (obj) {
        return new Date() >= new Date(obj.startsAt);
    }

    $scope.setActivecertificate = function () {
        $scope.todaydate = new Date();
        for (var i = 0; i < $scope.webinarList.length; i++) {
            if ($scope.isFeedbackActive($scope.webinarList[i])) {
                $scope.webinarList[i].certficateEnable = true;
            } else {
                $scope.webinarList[i].certficateEnable = false;
            }
        }
    }
    $scope.setActivecertificate();

    /*----------------------------Export Certificate Start-------------------------------------------*/
    $scope.webinarDet = {};
    $scope.acmaDetModal = function (data) {
        //console.log("Acma Data", data);
        $scope.webinarDet = data;
        $scope.webinarDet.email = '';
        $scope.webinarForm.$setPristine();
        $("#webinarModal").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    $scope.clearModal = function () {
        $scope.webinarDet = {};
    }

    $scope.generateWebinarPDF = function (val) {
        var pdfInMM = 250; // width of A4 in mm
        var pageCenter = pdfInMM / 2;
        var doc = new jsPDF('l', 'mm', [600, 460], true);
        doc.setDrawColor(118, 161, 252);
        doc.setFontType("bold");
        doc.setFontSize(22);
        doc.setFont("roboto");
        doc.setTextColor(45, 179, 220);
        var imgData = new Image();
        var sakshamLogo = new Image();
        var logo = new Image();
        var certificateText = new Image();
        var frame = new Image();
        var signature = new Image();
        var webinarText = new Image();
        imgData.src = 'dist/certificateImg/bluestrip.png';
        logo.src = 'dist/certificateImg/acmaLogo.png';
        sakshamLogo.src = 'dist/certificateImg/sakshamLogo.png'
        certificateText.src = 'dist/certificateImg/certificateText.png'
        signature.src = "dist/certificateImg/SIGNATURES.png"
        frame.src = "dist/certificateImg/FRAME.png"
        webinarText.src = "dist/certificateImg/TEXT 1.png";
        doc.addImage(imgData, 'JPEG', 0, 0, 0, 40, '', 'FAST');
        doc.addImage(logo, 'JPEG', 10, 15, 40, 0, '', 'FAST');
        doc.addImage(sakshamLogo, 'JPEG', 160, 10, 40, 0, '', 'FAST');
        doc.addImage(webinarText, 'JPEG', 30, 50, 150, 5, '', 'FAST');
        doc.addImage(certificateText, 'JPEG', 47, 58, 120, 15, '', 'FAST');
        var paragraph = val.webinarDetail.topic.toString();
        var firstName = (val.firstName) ? val.firstName : '';
        var lastName = (val.lastName) ? val.lastName : '';
        var userName = firstName + ' ' + lastName;
        userName = userName.toString();
        var date = $filter('date')(val.webinarDetail.webinarDate, 'dd MMM yyyy');
        date = date.toString();
        var lines = doc.splitTextToSize(paragraph, (pdfInMM - 95 - 30));
        var stringLength = paragraph.length;
        doc.setFontSize(14);
        doc.setFontType("normal");
        doc.setTextColor(0, 0, 0);
        doc.text("Presented to :", 30, 85, 'left');
        doc.setFontSize(16);
        doc.text(userName, 59, 85, 'left');
        doc.setLineDash([1, 1, 1, 1], 10);
        doc.setDrawColor(0, 0, 0);
        doc.line(190, 86, 58, 86);
        doc.setFontSize(14);
        doc.text("For attending webinar session on the topic of", 30, 95, 'left');
        doc.setFontSize(16);
        doc.text(lines[0], pageCenter, 95, 'left');
        doc.line(190, 96, 120, 96, 'F');
        doc.line(190, 105, 30, 105, 'F');
        var extraParagraph = paragraph.substring(lines[0].length, stringLength);
        var extraLines = doc.splitTextToSize(extraParagraph, (pdfInMM - 30 - 50));
        for (var i = 0; i < extraLines.length; i++) {
            var lineTop = 9 * i;
            doc.text(extraLines[i], 30, 104 + lineTop, 'left'); //see this line
            doc.line(190, 105 + lineTop, 30, 105 + lineTop, 'F');
        }
        var dateLineTop = (extraLines.length > 0) ? (9 * (extraLines.length - 1)) : 0;
        doc.setFontSize(14);
        doc.text("Date Of Webinar :", 30, 115 + dateLineTop, 'left');
        doc.setFontSize(16);
        doc.text(date, 70, 115 + dateLineTop, 'left');
        doc.line(190, 116 + dateLineTop, 68, 116 + dateLineTop);
        doc.addImage(frame, 'JPEG', 5, 5, 203, 154, '', 'FAST');
        doc.addImage(signature, 'JPEG', 15, 134, 180, 0, '', 'FAST');
        doc.save(userName + '_certificate.pdf');
    }

    $scope.responseType = "";
    $scope.submitWebinar = function (form) {
        if (form.$invalid) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            return;
        }
        $scope.statusMessage = '';
        var req = {
            "webinarId": $scope.webinarDet.webinarId,
            "email": $scope.webinarDet.email
        }
        loginRegService.eventHttpPost(req, 'validateUserCertificate')
            .then(function (response) {
                //console.log(response);
                if (response.result) {
                    $scope.webinarDet = {};
                    form.$setPristine();
                    var rec = response.webinarAttendee;
                    $("#webinarModal").modal('hide');
                    $scope.generateWebinarPDF(rec);
                } else {
                    $("#webinarModal").modal('hide');
                    if (response.statusCode == 100) {
                        $scope.statusMessage = response.reason;
                        $("#statusMessageModal").modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                    } else {
                        snackbar.create("Record not found", 5000, "error");
                    }
                }
            });
    }
    $scope.openBrochureModal = function () {
        $("#brochureModal")
            .modal({
                backdrop: 'static',
                keyboard: false
            });
    }
}]);
app.controller("emailVerifyCtrl", ['$scope', 'loginRegService', '$window', 'snackbar', '$location', function ($scope, loginRegService, $window, snackbar, $location) {
    //console.log('Email Verify page');
    $scope.notverify = false;
    $scope.token = getUrlParameterByName("token", window.location.href);
    $scope.openScheduleModal = function () {
        $("#connectUsModal")
            .modal({
                backdrop: 'static',
                keyboard: false
            });
    }

    $scope.eml_add = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    $scope.submitLoader = false;
    $scope.userDet = {};
    $scope.submitSubscribe = function (form) {
        //console.log(form);
        $scope.submitLoader = true;
        if (form.invalid) {
            Object.keys(form.controls).forEach(key => {
                form.controls[key].markAsDirty();
            });
            this.submitLoader = false;
            return;
        }
        this.submitLoader = false;
        //console.log($scope.userDet);
    }
    //console.log($scope.token);
    $scope.verifyEmail = function () {
        var data = {
            token: $scope.token //s.token
        }
        $scope.loading = true;
        loginRegService.httpPost(data, 'verifyemail')
            .then(function (response) {
                //console.log(response);
                $scope.loading = false;
                if (response.result) {
                    $scope.notverify = false;
                    $('#myModal')
                        .modal('show');
                } else {
                    $scope.notverify = true;
                    snackbar.create(response.reason, 5000, "error");
                }
            });
    }

    $scope.verifyEmail();

    $scope.goLogin = function () {
        $window.location.href = "login.html";
    }
}]);

app.controller("employeeVerifyCtrl", ['$scope', 'loginRegService', '$window', 'snackbar', '$location', function ($scope, loginRegService, $window, snackbar, $location) {
    //console.log('Email Verify page');
    $scope.notverify = false;
    $scope.flagInvalid = false;
    $scope.tokenDet
    $scope.token = getUrlParameterByName("token", window.location.href);
    $scope.setPassword = false;
    $scope.responseObj = {};
    $scope.orgLogoPath = 'dist/icons/myeNovationFooter.png';
    $scope.checkOrgLogo = function () {
        var url = window.location.href;
        //below match function provides alias in first index of urlAlias variable
        //var urlAlias = url.match(new RegExp("://" + "(.*)" + '-demo.myenovation')); //for uat
        var urlAlias = url.match(new RegExp("://" + "(.*)" + '.myenovation')); //for Prod
        //var urlAlias = url.match(new RegExp("://aihub." + "(.*)" + '.com')); //for DEV

        //console.log(urlAlias);
        if (urlAlias != null) {
            loginRegService.httpGet('getorglogo/' + urlAlias[1])
                .then(function (response) {
                    //console.log("-------------Check Org Logo Response-----------");
                    //console.log(response);
                    if (response.result) {
                        $scope.orgDet = response;
                        $scope.orgLogoPath = response.logoPath;
                    } else {
                        $scope.orgLogoPath = '';
                        $scope.orgDet = {};
                    }
                    //console.log(response);
                });
        }
    }
    //console.log($scope.token);
    $scope.checkOrgLogo();
    $scope.verifyEmail = function () {
        var data = {
            token: getUrlParameterByName("token", window.location.href) //$scope.token //s.token
        }
        $scope.loading = true;
        $scope.flagInvalid = false;
        // employeeverifyforforgotpassword
        loginRegService.httpPost(data, 'verifyPasswordResetToken')
            .then(function (response) {
                //console.log(response);
                $scope.loading = false;
                if (response.result) {
                    $scope.notverify = true;
                    // $('#myModal').modal('show');
                    $scope.currentEmail = response.email;
                    $scope.token = response.token;
                    $scope.setPassword = true;
                    $scope.passwordPolicy = response.passwordPolicy;
                    $scope.maxLifeTimeInDays = $scope.passwordPolicy.maxLifeTimeInDays;
                    $scope.minAlphabetic = $scope.passwordPolicy.minAlphabetic;
                    $scope.minNumeric = $scope.passwordPolicy.minNumeric;
                    $scope.minPasswdLength = $scope.passwordPolicy.minPasswdLength;
                    $scope.minSpecialChar = $scope.passwordPolicy.minSpecialChar;
                    $scope.isEnable = response.passwordPolicy.isEnable;

                } else {
                    // $scope.isEnable="N"
                    $scope.flagInvalid = true;
                    if (response.statusCode == 100) {
                        $scope.invalidMsg = response.reason;
                    } else {
                        $scope.invalidMsg = "Invalid link. Please resend the verification link.";
                    }
                    $scope.notverify = false;
                    //snackbar.create(response.reason, 5000, "error");
                }
            }).catch(function (error) {
                // $scope.invalidMsg = "Error occurred while verifying link. Please try again";
                //$scope.flagInvalid = true;
                // $scope.notverify = false;
            });
    }

    $scope.user = {};
    $scope.form = {};
    $scope.submitPasswordForJCB = function (form) {
        $scope.flagSubmitPassIndicator = true;
        var token = getUrlParameterByName("token", window.location.href);
        if (!token || angular.isUndefined(token)) {
            snackbar.create('Invalid token. Please check link', 5000, "error");
            $scope.flagSubmitPassIndicator = false;
            return;
        }
        if ($scope.user.password != $scope.user.passwordMatch) {
            snackbar.create("Password and confirm password not matching.", 5000, "error");
            $scope.flagSubmitPassIndicator = false;
            //console.log("in if submit pass");
            return;
        }
        var data = {
            // "emailId": $scope.currentEmail,
            "token": getUrlParameterByName("token", window.location.href), //$scope.token,
            "password": $scope.user.password,
            "requestType": "FORGOT_PASSWORD"
        };

        if (form.$invalid || $scope.checkPassPolicyStatic()) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            $scope.flagSubmitPassIndicator = false;
            return;
        }
        loginRegService.httpPost(data, 'resetEmployeePassword')
            .then(function (response) {
                $scope.flagSubmitPassIndicator = false;
                if (response.result) {
                    $scope.notverify = true;
                    $scope.responseObj = response;
                    snackbar.create('Password reset successfully', 5000, "success");
                    // setTimeout(function() {
                    //     if (response.portalLink != null)
                    //         window.location.href = response.portalLink + 'login.html';
                    //     else
                    //         window.location.href = 'login.html';
                    // }, 5000);
                    $('#pwdResetModal').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                } else {
                    $scope.notverify = false;
                    if (response.statusCode == 100) {
                        snackbar.create(response.reason, 5000, "error");
                    } else {
                        snackbar.create('Error occurred while reset password. Please try again ', 5000, "error");
                    }
                }
            });
    }
    $scope.submitPassword = function (form) {
        $scope.flagSubmitPassIndicator = true;
        var token = getUrlParameterByName("token", window.location.href);
        if (!token || angular.isUndefined(token)) {
            snackbar.create('Invalid token. Please check link', 5000, "error");
            $scope.flagSubmitPassIndicator = false;
            return;
        }
        if ($scope.user.password != $scope.user.passwordMatch) {
            snackbar.create("Password and confirm password not matching.", 5000, "error");
            $scope.flagSubmitPassIndicator = false;
            //console.log("in if submit pass");
            return;
        }
        var data = {
            // "emailId": $scope.currentEmail,
            "token": getUrlParameterByName("token", window.location.href), //$scope.token,
            "password": $scope.user.password,
            "requestType": "FORGOT_PASSWORD"
        };

        //console.log(data);
        if ($scope.isEnable == 'Y' && $scope.policyObj.lowerCaseValid == true && $scope.policyObj.lengthValid == true && $scope.policyObj.specialValid == true && $scope.policyObj.numberValid == true) {
            loginRegService.httpPost(data, 'resetEmployeePassword')
                .then(function (response) {
                    //console.log(response);
                    $scope.flagSubmitPassIndicator = false;
                    if (response.result) {
                        $scope.notverify = true;
                        $scope.responseObj = response;
                        // snackbar.create('Password reset successfully', 5000, "success");
                        // setTimeout(function() {
                        //     if (response.portalLink != null)
                        //         window.location.href = response.portalLink + 'login.html';
                        //     else
                        //         window.location.href = 'login.html';
                        // }, 5000);
                        $('#pwdResetModal').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                    } else {
                        $scope.notverify = false;
                        if (response.statusCode == 100) {
                            snackbar.create(response.reason, 5000, "error");
                        } else {
                            snackbar.create('Error occurred while reset password. Please try again ', 5000, "error");
                        }
                    }
                });
        } else if ($scope.isEnable == undefined || $scope.isEnable == null || $scope.isEnable == 'N') {
            if ($scope.isClient('jcb') && $scope.checkPassPolicyStatic()) {
                return
            }
            if (form.$invalid) {
                angular.forEach(form.$error.required, function (field) {
                    field.$setDirty();
                });
                $scope.flagSubmitPassIndicator = false;
                return;
            }
            loginRegService.httpPost(data, 'resetEmployeePassword')
                .then(function (response) {
                    //console.log(response);
                    $scope.flagSubmitPassIndicator = false;
                    if (response.result) {
                        $scope.notverify = true;
                        $scope.responseObj = response;
                        // snackbar.create('Password reset successfully', 5000, "success");
                        // setTimeout(function() {
                        //     if (response.portalLink != null)
                        //         window.location.href = response.portalLink + 'login.html';
                        //     else
                        //         window.location.href = 'login.html';
                        // }, 5000);
                        $('#pwdResetModal').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                    } else {
                        $scope.notverify = false;
                        if (response.statusCode == 100) {
                            snackbar.create(response.reason, 5000, "error");
                        } else {
                            snackbar.create('Error occurred while reset password. Please try again ', 5000, "error");
                        }
                    }
                });
        } else {
            $scope.flagSubmitPassIndicator = false;
            snackbar.create("Error occurred. Please try again.", 3000, "error");
            return;
        }

    }
    $scope.verifyEmail();
    $scope.setPass = function () {
        $('#myModal')
            .modal('hide');
    }
    $scope.checkPassPolicyStatic = function () {
        var value = $scope.user.password;
        const isValidLength = /^.{12,16}$/;
        const isNonWhiteSpace = /^\S*$/;
        const isContainsUppercase = /^(?=.*[A-Z]).*$/;
        const isContainsLowercase = /^(?=.*[a-z]).*$/;
        const isContainsNumber = /^(?=.*[0-9]).*$/;
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
        if (!isValidLength.test(value) || !isNonWhiteSpace.test(value) || !isContainsUppercase.test(value) || !isContainsLowercase.test(value) || !isContainsNumber.test(value) || !isContainsSymbol.test(value)) {
            return 'Password should include a minimum of 12 characters with at least one capital letter, one lowercase letter, one digit, and one special character.';
        }
    }
    $scope.emp = {};
    $scope.checkPassPolicy = function () {
        if ($scope.isEnable == 'Y') {
            $scope.flagPass = true;
        }
        //console.log($scope.flagPass);
        //console.log($scope.user.password);
        $scope.policyObj = {
            small: [],
            capital: [],
            num: [],
            special: [],

        }

        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        if ($scope.user.password.length <= 16) {
            for (var i = 0; i < $scope.user.password.length; i++) {
                if ($scope.user.password[i] >= 0 && $scope.user.password[i] <= 9) {
                    //console.log("number match=" + $scope.user.password[i]);
                    $scope.policyObj.num.push($scope.user.password[i]);

                } else if ($scope.user.password[i] >= 'a' && $scope.user.password[i] <= 'z') {
                    //console.log("lowerCaseLetters match=" + $scope.user.password[i]);
                    $scope.policyObj.small.push($scope.user.password[i])

                } else if ($scope.user.password[i] >= 'A' && $scope.user.password[i] <= 'Z') {
                    //console.log("upperCaseLetters match=" + $scope.user.password[i]);
                    $scope.policyObj.capital.push($scope.user.password[i]);

                } else {
                    //console.log("specialCaseLetters match=" + $scope.user.password[i]);
                    $scope.policyObj.special.push($scope.user.password[i])
                }
            }
        }
        //console.log("policyObj");
        //console.log($scope.policyObj);

        // Validate lowercase letters
        if (($scope.policyObj.small.length + $scope.policyObj.capital.length) >= $scope.minAlphabetic) {
            //console.log("inlowercase");

            $scope.policyObj.lowerCaseValid = true;
        } else {
            $scope.policyObj.lowerCaseValid = false;
        }

        // Validate numbers
        if ($scope.policyObj.num.length >= $scope.minNumeric) {
            $scope.policyObj.numberValid = true;
        } else {
            $scope.policyObj.numberValid = false;
        }
        // Validate spesial
        if ($scope.policyObj.special.length >= $scope.minSpecialChar) {
            $scope.policyObj.specialValid = true;
        } else {
            $scope.policyObj.specialValid = false;
        }
        // Validate length
        if ($scope.user.password.length >= $scope.minPasswdLength) {
            $scope.policyObj.lengthValid = true;
        } else {
            $scope.policyObj.lengthValid = false;
        }
    }

    $scope.isEmpty = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    $scope.goLoginBack = function () {
        if (!$scope.isEmpty($scope.responseObj) && $scope.responseObj.portalLink && $scope.responseObj.portalLink != null) {
            window.location.href = $scope.responseObj.portalLink + 'login.html';
        } else {
            window.location.href = 'login.html';
        }
    }
}]);
var compareTo = function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function (modelValue) {
                if ((typeof modelValue !== 'undefined') && modelValue !== '') {
                    return modelValue == scope.otherModelValue;
                }

            };
            scope.$watch("otherModelValue", function (modelValue) {
                if ((typeof modelValue !== 'undefined') && modelValue !== '') {
                    ngModel.$validate();
                }
            });
        }
    };
};

app.directive("compareTo", compareTo);

app.controller("forgotPassCtrl", ['$scope', 'loginRegService', 'snackbar', function ($scope, loginRegService, snackbar) {

    $scope.flagLinkSentSection = false;
    $scope.flagSendLinkIndicator = false;
    $scope.email = {}
    $scope.clearErr = function () {
        $scope.errMsg = '';
    }

    $scope.orgLogoPath = 'dist/icons/myeNovationFooter.png';
    $scope.checkOrgLogo = function () {
        var url = window.location.href;
        //below match function provides alias in first index of urlAlias variable
        //var urlAlias = url.match(new RegExp("://" + "(.*)" + '-demo.myenovation')); //for uat
        var urlAlias = url.match(new RegExp("://" + "(.*)" + '.myenovation')); //for Prod
        //var urlAlias = url.match(new RegExp("://aihub." + "(.*)" + '.com')); //for DEV

        //console.log(urlAlias);
        if (urlAlias != null) {
            loginRegService.httpGet('getorglogo/' + urlAlias[1])
                .then(function (response) {
                    //console.log("-------------Check Org Logo Response-----------");
                    //console.log(response);
                    if (response.result) {
                        $scope.orgDet = response;
                        $scope.orgLogoPath = response.logoPath;
                    } else {
                        $scope.orgLogoPath = '';
                        $scope.orgDet = {};
                    }
                    //console.log(response);
                });
        }
    }
    $scope.checkOrgLogo();
    $scope.sendLink1 = function () {
        if ($scope.email.emailId != null) {
            $scope.flagSendLinkIndicator = true;
            $scope.clearErr();
            loginRegService.httpGet('isemailverify/' + $scope.email.emailId)
                .then(function (response) {
                    //console.log("--------------------Send Link Response---------------");
                    //console.log(response);
                    $scope.flagSendLinkIndicator = false;
                    if (response.result) {
                        $scope.flagLinkSentSection = true;
                    } else {
                        if (response.statusCode == 100) {
                            $scope.errMsg = response.reason;
                        } else {
                            $scope.errMsg = "You haven't verified your email. Please verify it first.";
                        }
                    }
                });
        } else {
            $scope.errMsg = "Please enter email";
        }
    }
    $scope.sendLink = function (form, isValid) {
        if (isValid) {
            $scope.flagSendLinkIndicator = true;
            // loginRegService.httpGet('isemailverify/' + $scope.email.emailId)
            var req = {
                "email": $scope.email.emailId
            }
            loginRegService.httpPost(req, 'sendForgotPasswordEmail')
                .then(function (response) {
                    $scope.flagSendLinkIndicator = false;
                    if (response.result) {
                        $scope.flagLinkSentSection = true;
                    } else {
                        if (response.statusCode == 100) {
                            $scope.errMsg = response.reason;
                        } else {
                            $scope.errMsg = "You haven't verified your email. Please verify it first.";
                        }
                    }
                });
        } else {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
        }
    };
    $scope.sendMailToSuperAdmin = function (form, isValid) {
        if (isValid) {
            $scope.flagSendLinkIndicator = true;
            $scope.data = {
                "userCred": $scope.email.emailId,
                "type": $scope.email.type
            };
            loginRegService.httpPost($scope.data, "test/sendMailToSuperAdminForPasswordReset")
                .then(function (response) {
                    $scope.clearErr();
                    $scope.flagSendLinkIndicator = false;
                    if (response.result) {
                        $scope.flagLinkSentSection = true;
                    } else {
                        if (response.statusCode == 100) {
                            $scope.errMsg = response.reason;
                        } else {
                            $scope.errMsg = "You haven't verified your email. Please verify it first.";
                        }
                    }

                });
        } else {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
        }
    };
}]);
app.controller("generatePassCtrl", ['$scope', 'loginRegService', 'snackbar', function ($scope, loginRegService, snackbar) {
    $scope.generatePwdInput = {};
    $scope.pageVerifyFlag = false;
    $scope.generatePwdObj = {
        verifyEmpId: false,
        verifyOtp: false,
        generatePwd: false,
        tokenInvalid: false
    };
    $scope.orgLogoPath = 'dist/icons/myeNovationFooter.png';
    $scope.checkOrgLogo = function () {
        var url = window.location.href;
        //below match function provides alias in first index of urlAlias variable
        //var urlAlias = url.match(new RegExp("://" + "(.*)" + '-demo.myenovation')); //for uat
        var urlAlias = url.match(new RegExp("://" + "(.*)" + '.myenovation')); //for Prod
        //var urlAlias = url.match(new RegExp("://aihub." + "(.*)" + '.com')); //for DEV

        //console.log(urlAlias);
        if (urlAlias != null) {
            loginRegService.httpGet('getorglogo/' + urlAlias[1])
                .then(function (response) {
                    //console.log("-------------Check Org Logo Response-----------");
                    //console.log(response);
                    if (response.result) {
                        $scope.orgDet = response;
                        $scope.orgLogoPath = response.logoPath;
                    } else {
                        $scope.orgLogoPath = '';
                        $scope.orgDet = {};
                    }
                    //console.log(response);
                });
        }
    }
    $scope.flagPageVerifyIndicator = false;
    $scope.verifyPageLink = function () {
        var token = getUrlParameterByName("token", window.location.href);
        if (!token || angular.isUndefined(token)) {
            snackbar.create('Invalid token. Please check link', 5000, "error");
            $scope.generatePwdObj.tokenInvalid = true;
            $scope.flagPageVerifyIndicator = false;
            return;
        }
        var data = {
            "token": getUrlParameterByName("token", window.location.href), //$scope.token,
        };
        loginRegService.httpPost(data, 'validateToken')
            .then(function (response) {
                $scope.flagPageVerifyIndicator = false;
                if (response.result) {
                    // snackbar.create('Employee ID verified successfully', 3000, "success");
                    $scope.pageVerifyFlag = true;
                    $scope.generatePwdInput = {};
                    $scope.generatePwdObj = {
                        verifyEmpId: true,
                        verifyOtp: false,
                        generatePwd: false,
                        tokenInvalid: false
                    };
                } else {
                    if (response.statusCode == 100) {
                        $scope.generatePwdObj.tokenInvalid = true;
                        snackbar.create(response.reason, 5000, "error");
                    } else {
                        $scope.generatePwdObj.tokenInvalid = true;
                        snackbar.create('Error occurred while verify page. Please try again.', 5000, "error");
                    }
                }
            })
    }
    $scope.checkOrgLogo();
    $scope.verifyPageLink();
    var token = getUrlParameterByName("token", window.location.href);
    if (!token || angular.isUndefined(token)) {
        // $scope.generatePwdObj = {
        //     verifyEmpId: false,
        //     verifyOtp: false,
        //     generatePwd: false
        // };
    }
    $scope.verifyEmployeeId = function (form) {
        //console.log(form);
        $scope.flagSubmitVerifyIndicator = true;
        var token = getUrlParameterByName("token", window.location.href);
        if (!token || angular.isUndefined(token)) {
            snackbar.create('Invalid token. Please check link', 5000, "error");
            $scope.flagSubmitVerifyIndicator = false;
            return;
        }
        if (form.$invalid) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            $scope.flagSubmitVerifyIndicator = false;
            return;
        }
        var data = {
            "token": getUrlParameterByName("token", window.location.href), //$scope.token,
            "cmpyEmpId": $scope.generatePwdInput.empId
        };
        loginRegService.httpPost(data, 'verifyCompanyEmpNumber')
            .then(function (response) {
                $scope.flagSubmitVerifyIndicator = false;
                if (response.result) {
                    snackbar.create('Employee ID verified successfully', 3000, "success");
                    $scope.generatePwdInput = {};
                    $scope.generatePwdObj = {
                        verifyEmpId: false,
                        verifyOtp: true,
                        generatePwd: false
                    };
                    // $scope.setTimerStart(response.data.otpExpiry);
                } else {
                    if (response.statusCode == 100) {
                        snackbar.create(response.reason, 5000, "error");
                    } else {
                        snackbar.create('Error occurred while verifying employee id. Please try again.', 5000, "error");
                    }
                }
            })
    }
    $scope.resendOtp = function () {
        var token = getUrlParameterByName("token", window.location.href);
        if (!token || angular.isUndefined(token)) {
            snackbar.create('Invalid token. Please check link', 5000, "error");
            return;
        }
        var data = {
            "token": getUrlParameterByName("token", window.location.href)
        };
        loginRegService.httpPost(data, 'resendVerificationCode')
            .then(function (response) {
                if (response.result) {
                    snackbar.create('Verification code send successfully. Please check your registered email.', 5000, "success");
                    $scope.generatePwdInput = {};
                    $scope.form.verifyCodeForm.$setPristine();
                    $scope.form.verifyCodeForm.$setUntouched();
                    $scope.generatePwdObj = {
                        verifyEmpId: false,
                        verifyOtp: true,
                        generatePwd: false
                    };
                    // $scope.setTimerStart(response.data.otpExpiry);
                } else {
                    if (response.statusCode == 100) {
                        snackbar.create(response.reason, 5000, "error");
                    } else {
                        snackbar.create('Error occurred while resend code. Please try again.', 5000, "error");
                    }
                }
            })
    }
    $scope.verficationCode = function (form) {
        //console.log(form);
        $scope.flagSubmitVerifyIndicator = true;
        var token = getUrlParameterByName("token", window.location.href);
        if (!token || angular.isUndefined(token)) {
            snackbar.create('Invalid token. Please check link', 5000, "error");
            $scope.flagSubmitVerifyIndicator = false;
            return;
        }
        if (form.$invalid) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            $scope.flagSubmitVerifyIndicator = false;
            return;
        }
        var data = {
            "token": getUrlParameterByName("token", window.location.href), //$scope.token,
            "otp": $scope.generatePwdInput.otp
        };
        loginRegService.httpPost(data, 'validateVerificationCode')
            .then(function (response) {
                $scope.flagSubmitVerifyIndicator = false;
                if (response.result) {
                    snackbar.create('Code verified successfully.', 3000, "success");
                    $scope.generatePwdInput = {};
                    $scope.generatePwdObj = {
                        verifyEmpId: false,
                        verifyOtp: false,
                        generatePwd: true
                    };
                    $scope.setTimerStart(response.data.otpExpiry);
                } else {
                    if (response.statusCode == 100) {
                        snackbar.create(response.reason, 5000, "error");
                    } else {
                        snackbar.create('Error occurred while verifying code. Please try again.', 5000, "error");
                    }
                }
            })
    }
    $scope.checkPassPolicy = function () {
        var value = $scope.generatePwdInput.newPassword;
        const isValidLength = /^.{12,16}$/;
        const isNonWhiteSpace = /^\S*$/;
        const isContainsUppercase = /^(?=.*[A-Z]).*$/;
        const isContainsLowercase = /^(?=.*[a-z]).*$/;
        const isContainsNumber = /^(?=.*[0-9]).*$/;
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
        if (!isValidLength.test(value) || !isNonWhiteSpace.test(value) || !isContainsUppercase.test(value) || !isContainsLowercase.test(value) || !isContainsNumber.test(value) || !isContainsSymbol.test(value)) {
            return 'Password should include a minimum of 12 characters with at least one capital letter, one lowercase letter, one digit, and one special character.';
        }
    }
    $scope.responseObj = {};
    $scope.form = {};
    $scope.generatePassword = function (form) {
        //console.log(form);
        $scope.flagSubmitPassIndicator = true;
        var token = getUrlParameterByName("token", window.location.href);
        if (!token || angular.isUndefined(token)) {
            snackbar.create('Invalid token. Please check link', 5000, "error");
            $scope.flagSubmitPassIndicator = false;
            return;
        }
        if (form.$invalid || $scope.checkPassPolicy()) {
            angular.forEach(form.$error.required, function (field) {
                field.$setDirty();
            });
            $scope.flagSubmitPassIndicator = false;
            return;
        }
        var data = {
            "token": getUrlParameterByName("token", window.location.href), //$scope.token,
            "password": $scope.generatePwdInput.passwordMatch
        };
        loginRegService.httpPost(data, 'resetEmployeePassword')
            .then(function (response) {
                $scope.flagSubmitPassIndicator = false;
                if (response.result) {
                    $scope.responseObj = response;
                    snackbar.create('Password generated successfully', 5000, "success");
                    $scope.generatePwdInput = {};
                    $scope.form.generatePwdForm.$setPristine();
                    $scope.form.generatePwdForm.$setUntouched();
                    $('#pwdGenerateModal').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    // setTimeout(function() {
                    //     if (response.portalLink != null)
                    //         window.location.href = response.portalLink + 'login.html';
                    //     else
                    //         window.location.href = 'login.html';
                    // }, 2000);
                } else {
                    if (response.statusCode == 100) {
                        snackbar.create(response.reason, 5000, "error");
                    } else {
                        snackbar.create('Error occurred while generating password. Please try again.', 5000, "error");
                    }
                }
            })
    }
    $scope.isEmpty = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    $scope.goLoginBack = function () {
        if (!$scope.isEmpty($scope.responseObj) && $scope.responseObj.portalLink && $scope.responseObj.portalLink != null) {
            window.location.href = $scope.responseObj.portalLink + 'login.html';
        } else {
            window.location.href = 'login.html';
        }
    }
    $scope.setTimerStart = function (expiryTime) {
        // var date = new Date(expiryTime);
        // var timeleft = date.getMinutes();
        //console.log(date.getMinutes());
        // // document.getElementById("countdowntimer").textContent = '00:00';
        // // var timeleft = 600;
        // var downloadTimer = setInterval(function() {
        //     timeleft--;
        //     // $scope.generatePwdObj.remainingTime = $scope.formatTime(timeleft);
        //     document.getElementById("countdowntimer").textContent = $scope.formatTime(timeleft);
        //     if (timeleft <= 0) {
        //         clearInterval(downloadTimer);
        //         $scope.generatePwdObj = {
        //             verifyEmpId: false,
        //             verifyOtp: true,
        //             generatePwd: false
        //         };
        //     }
        // }, 1000);
    }
    $scope.formatTime = function (time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
    }

}]).directive("compareToPwd", function () {
    return {
        require: "ngModel",
        scope: {
            repeatPassword1: "=compareToPwd"
        },
        link: function (scope, element, attributes, paramval) {
            paramval.$validators.compareToPwd = function (val) {
                return val == scope.repeatPassword1;
            };
            scope.$watch("repeatPassword1", function () {
                paramval.$validate();
            });
        }
    };
});

app.controller("extSurveyCtrl", ['$scope', 'loginRegService', '$window', function ($scope, loginRegService, $window) {
    // $scope.windowHeight = $(window)
    //     .innerHeight();
    // var w = angular.element($window);
    // $scope.getWindowDimensions = function () {
    //     return {
    //         'h': $(window)
    //             .innerHeight(),
    //         'w': $(window)
    //             .innerWidth()
    //     };
    // };
    // $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
    //     $scope.windowHeight = newValue.h;
    //     $scope.setExtQuesHeightStyle = function () {
    //         return {
    //             'height': (newValue.h - 285) + 'px',
    //         };
    //     };
    // });
    $scope.token = getUrlParameterByName("token", window.location.href);
    $scope.setPassword = false;
    //console.log($scope.token);
    $scope.getExtSurveyDetailsNew = function () {
        var data = {
            token: $scope.token //s.token
        }
        $scope.loading = true;
        $scope.flagInvalid = false;

        loginRegService.httpGet("externalsurvey/test/getTokenVerify/" + $scope.token)
            .then(function (response) {
                $scope.loading = false;
                if (response.result == true) {
                    $scope.userSrvId = response.userSrvId;
                    $scope.userSurveyDetails($scope.token);
                } else {
                    $scope.flagInvalid = true;
                    $scope.invalidMsg = "Invalid Token. Please resend the verification link.";

                }
            });


    }

    //console.log("Survey Controller Loaded....")
    $scope.question = {};
    $scope.extSurveyDetails = {};
    $scope.userSurveyDetails = function (data) {
        loginRegService.httpGet("externalsurvey/test/getExternalSurveyDetails/" + $scope.token)
            .then(function (response) {
                //console.log(response);
                $scope.loading = false;
                if (response.result) {
                    $scope.extSurveyDetails.id = response.extSurveyDetails.id;
                    $scope.extSurveyDet = response.extSurveyDetails;
                    $scope.question = response.extSurveyDetails.surveyQuestions;
                    //console.log($scope.question);
                    $scope.question.answeredCount = 0;
                } else {
                    $scope.flagInvalid = true;
                    if (response.statusCode == 100) {
                        $scope.invalidMsg = response.reason;
                    } else {
                        $scope.invalidMsg = "Invalid Token. Please resend the verification link.";
                    }
                    $scope.notverify = false;
                    //snackbar.create(response.reason, 5000, "error");
                }
            });
    }

    $scope.setAnswer = function () {
        var answeredCount = 0;
        for (var i = 0; i < $scope.question.length; i++) {
            if ($scope.question[i].choiceType.choiceId == 3) {
                if ($scope.question[i].inputText && $scope.question[i].inputText != null && !angular.isUndefined($scope.question[i].inputText) && $scope.question[i].inputText.trim().length != 0) {
                    answeredCount++;
                    // break;
                }
            } else {
                for (var j = 0; j < $scope.question[i].surveyOptions.length; j++) {
                    if ($scope.question[i].surveyOptions[j].userCheck == 1 || $scope.question[i].surveyOptions[j].userCheck == true) {
                        answeredCount++;
                        // break;
                    }
                }
            }
        }
        $scope.question.answeredCount = answeredCount;
    }



    $scope.userAnswerSave = function () {
        // $("#myModal").modal('show');
        //console.log("-----------Submit Answer------------");
        //console.log($scope.question);
        $scope.data = [];
        for (var i = 0; i < $scope.question.length; i++) {
            if ($scope.question[i].choiceType.choiceId == 1) {
                //Radio
                for (var j = 0; j < $scope.question[i].surveyOptions.length; j++) {
                    if ($scope.question[i].surveyOptions[j].userCheck == 1 || $scope.question[i].surveyOptions[j].userCheck == true) {
                        $scope.data.push({
                            "extSurveyId": $scope.extSurveyDetails.id,
                            "userSurveyAnswer": {
                                "id": parseInt($scope.userSrvId)
                            },
                            "surveyQuestion": {
                                "id": $scope.question[i].id
                            },
                            "surveyQueOpt": {
                                "id": $scope.question[i].surveyOptions[j].id
                            },
                            "statusId": 4,
                            "isAnswerd": 1
                        });
                    }
                }
            } else if ($scope.question[i].choiceType.choiceId == 2) {
                // Checkbox
                for (var j = 0; j < $scope.question[i].surveyOptions.length; j++) {
                    if ($scope.question[i].surveyOptions[j].userCheck == 1 || $scope.question[i].surveyOptions[j].userCheck == true) {
                        $scope.data.push({
                            "extSurveyId": $scope.extSurveyDetails.id,
                            "userSurveyAnswer": {
                                "id": parseInt($scope.userSrvId)
                            },
                            "surveyQuestion": {
                                "id": $scope.question[i].id
                            },
                            "surveyQueOpt": {
                                "id": $scope.question[i].surveyOptions[j].id
                            },
                            "statusId": 4,
                            "isAnswerd": 1
                        });
                    }
                }
            } else if ($scope.question[i].choiceType.choiceId == 3) {
                //Text
                if ($scope.question[i].inputText && $scope.question[i].inputText != null && !angular.isUndefined($scope.question[i].inputText) && $scope.question[i].inputText.trim().length != 0) {
                    $scope.data.push({
                        "extSurveyId": $scope.extSurveyDetails.id,
                        "userSurveyAnswer": {
                            "id": parseInt($scope.userSrvId)
                        },
                        "surveyQuestion": {
                            "id": $scope.question[i].id
                        },
                        "statusId": 4,
                        "isAnswerd": 1,
                        "optText": $scope.question[i].inputText
                    });
                }
            } else if ($scope.question[i].choiceType.choiceId == 5) {
                //Rating
                for (var j = 0; j < $scope.question[i].surveyOptions.length; j++) {
                    if ($scope.question[i].surveyOptions[j].userCheck == 1 || $scope.question[i].surveyOptions[j].userCheck == true) {
                        $scope.data.push({
                            "extSurveyId": $scope.extSurveyDetails.id,
                            "userSurveyAnswer": {
                                "id": parseInt($scope.userSrvId)
                            },
                            "surveyQuestion": {
                                "id": $scope.question[i].id
                            },
                            "surveyQueOpt": {
                                "id": $scope.question[i].surveyOptions[j].id
                            },
                            "statusId": 4,
                            "isAnswerd": 1,
                            "ratings": $scope.question[i].surveyOptions[j].ratings
                        });
                    }
                }
            }
            else if ($scope.question[i].choiceType.choiceId == 6) {
                //Radio
                for (var j = 0; j < $scope.question[i].surveyOptions.length; j++) {
                    if ($scope.question[i].surveyOptions[j].userCheck == 1 || $scope.question[i].surveyOptions[j].userCheck == true) {
                        $scope.data.push({
                            "extSurveyId": $scope.extSurveyDetails.id,
                            "userSurveyAnswer": {
                                "id": parseInt($scope.userSrvId)
                            },
                            "surveyQuestion": {
                                "id": $scope.question[i].id
                            },
                            "surveyQueOpt": {
                                "id": $scope.question[i].surveyOptions[j].id
                            },
                            "statusId": 4,
                            "isAnswerd": 1
                        });
                    }
                }
            }
        }
        //console.log($scope.data);
        if ($scope.data != null && $scope.data.length > 0) {
            loginRegService.httpPost($scope.data, "externalsurvey/test/createExtSurveyAnswers")
                .then(function (response) {
                    //console.log(response);
                    if (response.result == true) {
                        // snackbar.create("Answer saved successfully.", 4000, "success");
                        $scope.flagSubmit = true;
                        $scope.flagInvalid = true;

                    } else {

                    }
                });
        }
    }
    $scope.getExtSurveyDetailsNew();
}]);
// for unsubscribe email controller
app.controller("notifyCtrl", ['$scope', '$rootScope', 'loginRegService', 'snackbar', '$window', function ($scope, $rootScope, loginRegService, snackbar, $window) {
    $scope.token = getUrlParameterByName("token", window.location.href);
    // $scope.empDet = $rootScope.empDetails.emailId;
    //console.log($scope.empDet)
    document.getElementById("msgforunsubscription").style.display = 'none'
    $scope.getUnsubscribeDetailsNew = function () {
        $scope.loading = true;
        $scope.flagInvalid = false;
        loginRegService.httpGet("test/isTokenValid/" + $scope.token)
            .then(function (response) {
                $scope.loading = false;
                if (response.result) {
                    document.getElementById("contentforunsubscribe").style.display = 'block'
                    $scope.userSrvId = response.reason;
                    // $scope.getNotificationDetail();
                } else {
                    $scope.flagInvalid = true;
                    $scope.userMsg = response.reason;
                    document.getElementById("contentforunsubscribe").style.display = 'none'
                    document.getElementById("msgforunsubscription").style.display = 'block'
                    //console.log($scope.userSrvId);

                    // $scope.invalidMsg = "Invalid Token. Please resend the verification link.";

                }
            });
    }
    //console.log($rootScope.empDetails);

    $scope.getNotificationDetail = function () {
        $scope.flagSubmitPassIndicator = true;
        loginRegService.httpGet('test/unsubscribeDashboardNotification/' + $scope.token)
            .then(function (response) {
                $scope.flagSubmitPassIndicator = false;
                if (response.result) {
                    $scope.responseObj = response;
                    $scope.userMsg = "You have been Unsubscribed successfully"
                    document.getElementById("contentforunsubscribe").style.display = 'none'
                    document.getElementById("msgforunsubscription").style.display = 'block'
                } else {
                    if (response.statusCode == 100) {
                        snackbar.create(response.reason, 5000, "error");
                    } else {
                        snackbar.create('Error occurred while unsubscribing. Please try again.', 5000, "error");
                    }
                }
            })

    }
    $scope.getUnsubscribeDetailsNew();
}]);
app.controller("homeCtrl", ['$scope', 'loginRegService', function ($scope, loginRegService) {

    var data = JSON.parse(localStorage.getItem("userDet"));
    if (data != null && data.productOrgConfigDet.isSetupCompleted == 0) {
        window.location.href = 'setup-config/index.html';
    } else if (data != null && data.productOrgConfigDet.isSetupCompleted == 1) {
        window.location.href = 'template.html';
    }

    $scope.execVerifyEmail = function () {
        var data = { "token": "EFYwUs9cXdlubv4jodalli" }
        loginRegService.httpPost(data, "verifyemail").then(function (response) {
            //console.log(response);
            if (response.result == true) {
                // snackbar.create("Answer saved successfully.", 4000, "success");
                $scope.flagSubmit = true;
                $scope.flagInvalid = true;

            }
        });
    }
    $scope.execVerifyEmail();

    /*-------------Webinar Start------------------*/
    // $scope.newwebinarDet = function(webinarDate) {
    //     var webinarreleaseDate = new Date(webinarDate);
    //     var currentDate = new Date();
    //     return currentDate < webinarreleaseDate;
    // }

    /*--------------------------------------------*/
    $scope.slideflag = function (type) {
        //console.log(type);
        var target = document.getElementById(type);
        target.parentNode.scrollTop = target.offsetTop;
    }

}]);
(function () {
    'use strict';

    angular
        .module('loginRegApp.login')
        .directive('ratingStars', ratingStars);

    /*
     * Directive
     */
    ratingStars.$inject = [];

    function ratingStars() {
        var directive = {
            require: '?ngModel',
            restrict: 'E',
            template: '' +
                '<div ng-class="{ hover: vm.mutable, mutable: vm.mutable }">' +
                '<span ng-if="vm.ratingsPosition === \'left\'" class="ratings-left">({{vm.ratings}})</span>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (num) {
                    return '<span class="singleStar"><i ng-mouseover="vm.mouseover(' + num + ')" ' +
                        'ng-mouseout="vm.mouseout()" ' +
                        'ng-click="vm.click()" ' +
                        'ng-class="vm.getClass(' + num + ')" ng-if="' + num + ' <= vm.ratings"' +
                        'class="star hover material-icons"></i><span class="count" ng-if="' + num + ' <= vm.ratings">' + num + ' </span></span>';
                })
                    .join('') +
                '<span ng-if="vm.ratingsPosition === \'right\'" class="ratings-right">({{vm.ratings}})</span>' +
                '</div>',

            scope: {
                ratings: '<',
                averageRating: '<',
                ratingsPosition: '@'
            },
            link: link,
            controller: angular.noop,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function link(scope, element, attrs, ngModel) {
            var vm = scope.vm;
            var myRating = null;
            // Bind data
            vm.mutable = false;

            // Bind functions
            vm.getClass = getClass;
            vm.mouseover = mouseover;
            vm.mouseout = mouseout;
            vm.click = click;

            // Initialise
            init();

            /*
             * Private functions
             */
            function init() {
                vm.mutable = !!ngModel;

                if (ngModel) {
                    ngModel.$render = function () {
                        myRating = ngModel.$viewValue;
                    };
                }
            }

            /*
             * Public functions
             */
            function getClass(num) {
                return {
                    on: vm.averageRating >= num || myRating >= num,
                    'on-half': vm.averageRating > myRating && vm.averageRating < num && vm.averageRating >= num - .75,
                    my: myRating >= num
                };
            }

            function mouseover(rating) {
                if (ngModel) {
                    myRating = rating;
                }
            }

            function mouseout() {
                if (ngModel) {
                    myRating = ngModel.$viewValue;
                }
            }

            function click() {
                if (ngModel) {
                    ngModel.$setViewValue(myRating);
                }
            }
        }
    }
})();

/* Author - Sanket B.
Date - 05-02-2024
Objective - New Controller added for myeNovation Version Saperation (Free, Basic, Advance & Trail) */
app.controller('versionCtrl', ['$scope', 'loginRegService', 'snackbar', '$window', function ($scope, loginRegService, snackbar, $window) {

    /*Author - Sanket B.
    Date - 05-02 - 2024
    Objective - Function to fetch subscription plans when the controller initializes */
    $scope.fetchSubscriptionPlans = function () {
        loginRegService.httpGet('test/getSubscriptionPlans').then(function (response) {
            //console.log(response);
            if (response.result) {
                $scope.subscriptionData = response.dataList;
            }
        });
    };
    $scope.fetchSubscriptionPlans();

    /* Author - Sanket B.
    Date - 05-02-2024
    Objective - Function to start registration with a selected subscription plan & Defining an Object to store subscription plan details */
    $scope.subscriptionPlan = {};
    $scope.startRegistrationWithPlan = function (subscriptionPlanDetails) {
        $scope.subscriptionPlan = subscriptionPlanDetails;
        $scope.loading = false;
        $("#planRegistration").modal({
            backdrop: 'static',
            keyboard: false
        });
    };

    /* Author - Sanket B.
    Date - 12-02-2024
    Objective - Redirects the user to the website index page. */
    $scope.goHome = function () {
        $window.location.href = "index.html";
    };

    /* Author - Sanket B.
    Date - 12-02-2024
    Objective - User registration sign-up process & Indicates if the form data is valid. */
    $scope.emailVerify = true;
    $scope.userRegisterSignUp = function (isValid, res) {
        if (isValid) {
            var reg = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!abc.com)(?!xyz.com)(?!pqr.com)(?!rediffmail.com)(?!live.com)(?!outlook.com)(?!me.com)(?!msn.com)(?!ymail.com)([\w-]+\.)+[\w-]{2,4})?$/;
            if (reg.test(res.email)) {
                $scope.emailVerify = true;
            } else {
                $scope.emailVerify = false;
                return false;
            }
            var data = angular.copy(res);
            //console.log(data);
            $scope.registerSpinner = false;
            $scope.submitRegisterFormData = data;
            $scope.submitRegisterFormData.country = "India";
            $scope.submitRegisterFormData.registrationSource = 6;
            $scope.submitRegisterFormData.subscriptionTypeId = $scope.subscriptionPlan.subscriptionTypeId;
            $scope.submitRegisterFormData.subscriptionType = $scope.subscriptionPlan.subscriptionName;
            $scope.registrationDetails = res;

            $("#confirmRegisterModal").modal({
                backdrop: 'static',
                keyboard: false
            });
        } else {
            snackbar.create("Please fill mandatory fields", 5000, "error");
        }

    };

    /* Author - Sanket B.
    Date - 12-02-2024
    Objective - User confirmation for registration sign-up. */
    $scope.userConfirmRegisterSignUp = function () {
        $scope.registerSpinner = true;
        $scope.submitRegisterFormData.password = "abc";
        loginRegService.httpPost($scope.submitRegisterFormData, 'registration').then(function (response) {
            $scope.registerSpinner = false;
            $("#confirmRegisterModal").modal('hide');
            if (response.result) {
                $('#successRegistration').modal('show');
                if ($scope.registrationDetails) {
                    var data = {
                        email: $scope.registrationDetails.email,
                        name: $scope.registrationDetails.name,
                        body: ' Thank you for registration. Our team will connect you shortly'
                    };
                    //console.log(data);
                } else {
                    snackbar.create("Please fill mandatory fields", 5000, "error");
                }
            }
        }).catch(function (error) {
            snackbar.create("An error occurred during registration. Please try again.", 5000, "error");
        });
    };


}])