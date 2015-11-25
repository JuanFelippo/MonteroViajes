'use strict';

var app = angular.module('xenon-app', [
	'datatables',
	'ngCookies',
    'ngRoute',
	'ui.router',
	'ui.bootstrap',

	'oc.lazyLoad',

	'xenon.controllers',
	'xenon.directives',
	'xenon.factory',
	'xenon.services',
	// Added in v1.3
	'FBAngular'
	//'ngInputDate'
]);

/*var options = {};
options.api = {};
options.api.base_url = "http://localhost:3001";
*/

/*app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});*/

var options = {};
options.api = {};
options.api.base_url = "http://127.0.0.1:3000";

app.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, ASSETS,$httpProvider){
    //$httpProvider.interceptors.push('TokenInterceptor');
	$urlRouterProvider.otherwise( function($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("app.home");
        });
	$stateProvider.
		// Main Layout Structure
		state('app', {
			abstract: true,
			url: '/app',
			//access: { requiredAuthentication: true },
			templateUrl: appHelper.templatePath('layout/app-body'),
			controller: function($rootScope){
				$rootScope.isLoginPage        = false;
				$rootScope.isLightLoginPage   = false;
				$rootScope.isLockscreenPage   = false;
				$rootScope.isMainPage         = true;
			}
		}).
		// Dashboards
		state('app.home', {
			url: '/dashboard-variant-1',
			templateUrl: appHelper.templatePath('dashboards/variant-1'),
			//controller: 'HomeCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
						ASSETS.extra.toastr,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.contract', {
			abstract: true,
			url: '/contract',
			template: '<ui-view/>'
        }).
		state('app.contract.list', {
			url: '/list',
			templateUrl: appHelper.templatePath('contract.list'),
			controller: 'ContractList',
            resolve: {
				 // deps: function($ocLazyLoad){
				 // 	return $ocLazyLoad.load([
				 // 		ASSETS.tables.datatables,
				 // 	]);
				 // },
				contractData: function(ContractService){
                  return ContractService.findAll();
                }
			}
		}).
		state('app.contract.create', {
			url: '/create',
			templateUrl: appHelper.templatePath('contract.create'),
			controller: 'ContractCreate',
			resolve: {
                dropzone: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.dropzone,
					]);
				},
               relatedData: function(ContractService){
                  return ContractService.relatedData();
               }
            }
		}).
		state('app.contract.edit', {
			url: '/:id',
			templateUrl: appHelper.templatePath('contract.edit'),
			controller: 'ContractEdit',
			resolve: {
				 // deps: function($ocLazyLoad){
				 // 	return $ocLazyLoad.load([
				 // 		ASSETS.tables.datatables,
				 // 	]);
				 // },
			   relatedData: function(ContractService){
                  return ContractService.relatedData();
               },
               contractData: function($stateParams,ContractService){
                  return ContractService.read($stateParams.id);
               }
            }
		}).
		state('app.contract.update', {
			url: '/:id',
			templateUrl: appHelper.templatePath('contract.create'),
			controller: function($scope, $stateParams) {
				$scope.id = $stateParams.id;
            }
		}).
	    // Logins and Lockscreen
		state('login', {
			url: '/login',
			templateUrl: appHelper.templatePath('login'),
			controller: 'LoginCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
						ASSETS.extra.toastr,
					]);
				},
			}
		}).
		state('logout', {
			url: '/logout',
			templateUrl: appHelper.templatePath('logout'),
			controller: 'LogoutCtrl',
			onEnter: ['$state', 'AuthenticationService', function($state, AuthenticationService){ 
               AuthenticationService.logOut();
               $state.go('login');
            }]
		}).
		state('lockscreen', {
			url: '/lockscreen',
			templateUrl: appHelper.templatePath('lockscreen'),
			controller: 'LockscreenCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
						ASSETS.extra.toastr,
					]);
				},
			}
		});
});

app.run(function($rootScope, $location, $window, AuthenticationService, $state)
{
	// Page Loading Overlay
	public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

	jQuery(window).load(function()
	{
		public_vars.$pageLoadingOverlay.addClass('loaded');
	})
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
    //	console.log("changing state"+fromState.name+" to state "+toState.name+" is isLoggedIn "+AuthenticationService.isLoggedIn());
      	if (toState.name === 'login' ){
           // doe she/he try to go to login? - let him/her go
            return;
		}

		if(AuthenticationService.isLoggedIn()){
		   // is logged in? - can go anyhwere
		   return;
		}

		event.preventDefault();
		$state.go('login');
    });
});
// app.run(function()
// {
// 	// Page Loading Overlay
// 	public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

// 	jQuery(window).load(function()
// 	{
// 		public_vars.$pageLoadingOverlay.addClass('loaded');
// 	})
// });

app.constant('ASSETS', {
	'core': {
		'bootstrap': appHelper.assetPath('js/bootstrap.min.js'), // Some plugins which do not support angular needs this

		'jQueryUI': [
			appHelper.assetPath('js/jquery-ui/jquery-ui.min.js'),
			appHelper.assetPath('js/jquery-ui/jquery-ui.structure.min.css'),
		],

		'moment': appHelper.assetPath('js/moment.min.js'),

		'googleMapsLoader': appHelper.assetPath('app/js/angular-google-maps/load-google-maps.js')
	},

	'charts': {

		'dxGlobalize': appHelper.assetPath('js/devexpress-web-14.1/js/globalize.min.js'),
		'dxCharts': appHelper.assetPath('js/devexpress-web-14.1/js/dx.chartjs.js'),
		'dxVMWorld': appHelper.assetPath('js/devexpress-web-14.1/js/vectormap-data/world.js'),
	},

	'xenonLib': {
		notes: appHelper.assetPath('js/xenon-notes.js'),
	},

	'maps': {

		'vectorMaps': [
			appHelper.assetPath('js/jvectormap/jquery-jvectormap-1.2.2.min.js'),
			appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-world-mill-en.js'),
			appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-it-mill-en.js'),
		],
	},

	'icons': {
		'meteocons': appHelper.assetPath('css/fonts/meteocons/css/meteocons.css'),
		'elusive': appHelper.assetPath('css/fonts/elusive/css/elusive.css'),
	},

	'tables': {
		'rwd': appHelper.assetPath('js/rwd-table/js/rwd-table.min.js'),

		'datatables': [
			appHelper.assetPath('js/datatables/dataTables.bootstrap.css'),
			appHelper.assetPath('js/datatables/datatables-angular.js'),
		],

	},

	'forms': {

		'select2': [
			appHelper.assetPath('js/select2/select2.css'),
			appHelper.assetPath('js/select2/select2-bootstrap.css'),

			appHelper.assetPath('js/select2/select2.min.js'),
		],

		'daterangepicker': [
			appHelper.assetPath('js/daterangepicker/daterangepicker-bs3.css'),
			appHelper.assetPath('js/daterangepicker/daterangepicker.js'),
		],

		'colorpicker': appHelper.assetPath('js/colorpicker/bootstrap-colorpicker.min.js'),

		'selectboxit': appHelper.assetPath('js/selectboxit/jquery.selectBoxIt.js'),

		'tagsinput': appHelper.assetPath('js/tagsinput/bootstrap-tagsinput.min.js'),

		'datepicker': appHelper.assetPath('js/datepicker/bootstrap-datepicker.js'),

		'timepicker': appHelper.assetPath('js/timepicker/bootstrap-timepicker.min.js'),

		'inputmask': appHelper.assetPath('js/inputmask/jquery.inputmask.bundle.js'),

		'formWizard': appHelper.assetPath('js/formwizard/jquery.bootstrap.wizard.min.js'),

		'jQueryValidate': appHelper.assetPath('js/jquery-validate/jquery.validate.min.js'),

		'dropzone': [
			appHelper.assetPath('js/dropzone/css/dropzone.css'),
			appHelper.assetPath('js/dropzone/dropzone.min.js'),
		],

		'typeahead': [
			appHelper.assetPath('js/typeahead.bundle.js'),
			appHelper.assetPath('js/handlebars.min.js'),
		],

		'multiSelect': [
			appHelper.assetPath('js/multiselect/css/multi-select.css'),
			appHelper.assetPath('js/multiselect/js/jquery.multi-select.js'),
		],

		'icheck': [
			appHelper.assetPath('js/icheck/skins/all.css'),
			appHelper.assetPath('js/icheck/icheck.min.js'),
		],

		'bootstrapWysihtml5': [
			appHelper.assetPath('js/wysihtml5/src/bootstrap-wysihtml5.css'),
			appHelper.assetPath('js/wysihtml5/wysihtml5-angular.js')
		],
	},

	'uikit': {
		'base': [
			appHelper.assetPath('js/uikit/uikit.css'),
			appHelper.assetPath('js/uikit/css/addons/uikit.almost-flat.addons.min.css'),
			appHelper.assetPath('js/uikit/js/uikit.min.js'),
		],

		'codemirror': [
			appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.js'),
			appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.css'),
		],

		'marked': appHelper.assetPath('js/uikit/vendor/marked.js'),
		'htmleditor': appHelper.assetPath('js/uikit/js/addons/htmleditor.min.js'),
		'nestable': appHelper.assetPath('js/uikit/js/addons/nestable.min.js'),
	},

	'extra': {
		'tocify': appHelper.assetPath('js/tocify/jquery.tocify.min.js'),

		'toastr': appHelper.assetPath('js/toastr/toastr.min.js'),

		'fullCalendar': [
			appHelper.assetPath('js/fullcalendar/fullcalendar.min.css'),
			appHelper.assetPath('js/fullcalendar/fullcalendar.min.js'),
		],

		'cropper': [
			appHelper.assetPath('js/cropper/cropper.min.js'),
			appHelper.assetPath('js/cropper/cropper.min.css'),
		]
	}
});