
angular.module('xenon.controllers',[]).
	controller('LoginCtrl', ['$scope','$rootScope','$state','AuthenticationService',function($scope, $rootScope, $state, AuthenticationService)
	{
		$rootScope.isLoginPage        = true;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = false;
		$scope.user = {};

	  $scope.register = function(){
	    AuthenticationService.register($scope.user).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      $state.go('home');
	    });
	  };

	  $scope.logIn = function(token){
	  	  AuthenticationService.saveToken(token);
          $state.go('app.home');
	    // AuthenticationService.logIn($scope.user).error(function(error){
	    //   $scope.error = error;
	    //   console.log("error when login");
	    //  // 	toastr.error("Ha ingresado una contraseña incorrecta, intente otra vez. Usuario y contraseña erroneos <strong>demo/demo</strong> :)", "login Invalido!", opts);
	    // }).then(function(){
	    // 	console.log("success when login");
	    //     $state.go('app.home');
	    // });
	  };
	}]).
	controller('LoginLightCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = true;
		$rootScope.isLightLoginPage   = true;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = false;
	}).
	controller('ContractList',['$scope','$rootScope','$state','contractData','DTOptionsBuilder',function($scope,$rootScope,$state,contractData,DTOptionsBuilder)
	{
		$scope.contracts = contractData.data.contracts;
		$scope.dtOptions = {
                dom: "<'row'<'col-sm-5'l><'col-sm-7'Tf>r>"+
					 "t"+
					 "<'row'<'col-xs-6'i><'col-xs-6'p>>",
				tableTools: {
					sSwfPath: "assets/js/datatables/tabletools/copy_csv_xls_pdf.swf"
				}
        };

		$scope.goContract = function($event,id){
			  console.log("agents "+JSON.stringify($scope.contracts.seller));
            console.log("destinations "+JSON.stringify($scope.contracts.destinations));
			$event.preventDefault();
			//$scope.contract.seller= [$scope.contract.seller];//+JSON.stringify($scope.contract));
            //$scope.contract.destinations = [$scope.contract.destinations];
          
            // ContractService.create($scope.contract).success(function(data){
            //      $state.go('app.contract.list');
            // });;
	        $state.go('app.contract.list',{'id':id});

		};
	}]).
	controller('ContractEdit',['$scope','$rootScope','$state','contractData','relatedData','ContractService',function($scope, $rootScope,$state,contractData,relatedData,ContractService)
	{
		$scope.date = new Date();
		$scope.contract = contractData.data.contract;
		$scope.destinations = relatedData.data.destinations; 
		$scope.agents = relatedData.data.agents;
		$scope.attachURL = options.api.base_url+"/"+$scope.contract.attachmentURL;

		$scope.contract.tutors[0].dob = new Date($scope.contract.tutors[0].dob);
		$scope.contract.tutors[1].dob = new Date($scope.contract.tutors[1].dob);
		$scope.contract.tripDate = new Date($scope.contract.tripDate);
		$scope.contract.signDate = new Date($scope.contract.signDate);

         //ng-repeat sellerh commissions number
        $scope.addSeller = function($event) {
           $event.preventDefault();
           // $scope.sellerQ++; 
           // $scope.sellerh = Array($scope.sellerQ);
           $scope.contract.commissions.push(null);
        };

        $scope.removeSeller = function($event,index) {

        	$event.preventDefault();
            //deletes seller on index
            $scope.contract.commissions.splice(index, 1);
        };

		$scope.goBack = function(){
              $state.go('app.contract.list');
		};
     
		$scope.edit = function($event){
			$event.preventDefault();
            console.log("tutors "+JSON.stringify($scope.contract)); 
            ContractService.update($scope.contract).success(function(data){
                  $state.go('app.contract.list');
            });;

		};
	}]).
	controller('ContractCreate',function($scope, $rootScope,$state,relatedData,ContractService)
	{
		$scope.date = new Date();
		$scope.destinations = relatedData.data.destinations; 
		$scope.agents = relatedData.data.agents; 
		$scope.centers = relatedData.data.centers; 
		$scope.sellerQ = 0;
		$scope.sellerh = [];

	    //contract data	
		$scope.contract = {};
		$scope.contract.commissions = [];
		$scope.contract.destination = [];
		$scope.contract.tutors = [];

		$scope.file;

        //ng-repeat sellerh commissions number
        $scope.addSeller = function($event) {
        	$event.preventDefault();
           $scope.sellerQ++; 
           $scope.sellerh = Array($scope.sellerQ);
        };

        $scope.removeSeller = function($event,index) {

        	$event.preventDefault();
        	$scope.sellerQ--;
            //deletes seller on index
            $scope.contract.commissions.splice(index, 1);
            $scope.sellerh = Array($scope.sellerQ);
        };

		$scope.create = function($event){
			//$event.preventDefault();
			
	        //= [$scope.contract.seller];//+JSON.stringify($scope.contract));
            //$scope.contract.destination = [$scope.contract.destinations];
            // console.log("destinations "+JSON.stringify($scope.contract.seller));
            console.log("destinations "+JSON.stringify($scope.contract.destination));
            console.log("tutors "+JSON.stringify($scope.contract.tutors));
            console.log("commissions "+JSON.stringify($scope.contract.commissions));
             console.log("file namne "+JSON.stringify($scope.file.name));
            
            ContractService.attach($scope.file).success(function(data){

                  console.log("attachmenturl "+data.path);
                  $scope.contract.attachmentURL = data.path;

                  ContractService.create($scope.contract).success(function(data){
                        $state.go('app.contract.list');
                  });

            });


           
		};
         
	}).
	controller('LogoutCtrl',['$scope', '$rootScope','AuthenticationService','$state', function($scope, $rootScope,AuthenticationService,$state)
	{
        $scope.logOut = function(){

		    AuthenticationService.logOut();
		    $state.go('logIn');
	    };
	}]).
	controller('LockscreenCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = false;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = true;
		$rootScope.isMainPage         = false;
	}).
	controller('MainCtrl', function($scope, $rootScope, $location, $layout, $layoutToggles, $pageLoadingBar, Fullscreen)
	{
		$rootScope.isLoginPage        = false;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = true;

		$rootScope.layoutOptions = {
			horizontalMenu: {
				isVisible		: false,
				isFixed			: true,
				minimal			: false,
				clickToExpand	: false,

				isMenuOpenMobile: false
			},
			sidebar: {
				isVisible		: true,
				isCollapsed		: false,
				toggleOthers	: true,
				isFixed			: true,
				isRight			: false,

				isMenuOpenMobile: false,

				// Added in v1.3
				//userProfile		: false
			},
			// chat: {
			// 	isOpen			: false,
			// },
			// settingsPane: {
			// 	isOpen			: false,
			// 	useAnimation	: true
			// },
			container: {
				isBoxed			: false
			},
			skins: {
				sidebarMenu		: '',
				horizontalMenu	: '',
				userInfoNavbar	: ''
			},
			pageTitles: true,
     		userInfoNavVisible	: true
		};

		$layout.loadOptionsFromCookies(); // remove this line if you don't want to support cookies that remember layout changes


		$scope.updatePsScrollbars = function()
		{
			var $scrollbars = jQuery(".ps-scrollbar:visible");

			$scrollbars.each(function(i, el)
			{
				if(typeof jQuery(el).data('perfectScrollbar') == 'undefined')
				{
					jQuery(el).perfectScrollbar();
				}
				else
				{
					jQuery(el).perfectScrollbar('update');
				}
			})
		};


		// Define Public Vars
		public_vars.$body = jQuery("body");


		// Init Layout Toggles
		$layoutToggles.initToggles();


		// Other methods
		$scope.setFocusOnSearchField = function()
		{
			public_vars.$body.find('.search-form input[name="s"]').focus();

			setTimeout(function(){ public_vars.$body.find('.search-form input[name="s"]').focus() }, 100 );
		};


		// Watch changes to replace checkboxes
		$scope.$watch(function()
		{
			cbr_replace();
		});

		// Watch sidebar status to remove the psScrollbar
		$rootScope.$watch('layoutOptions.sidebar.isCollapsed', function(newValue, oldValue)
		{
			if(newValue != oldValue)
			{
				if(newValue == true)
				{
					public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar('destroy')
				}
				else
				{
					public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar({wheelPropagation: public_vars.wheelPropagation});
				}
			}
		});


		// Page Loading Progress (remove/comment this line to disable it)
		$pageLoadingBar.init();

		$scope.showLoadingBar = showLoadingBar;
		$scope.hideLoadingBar = hideLoadingBar;


		// Set Scroll to 0 When page is changed
		$rootScope.$on('$stateChangeStart', function()
		{
			var obj = {pos: jQuery(window).scrollTop()};

			TweenLite.to(obj, .25, {pos: 0, ease:Power4.easeOut, onUpdate: function()
			{
				$(window).scrollTop(obj.pos);
			}});
		});


		// Full screen feature added in v1.3
		$scope.isFullscreenSupported = Fullscreen.isSupported();
		$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;

		$scope.goFullscreen = function()
		{
			if (Fullscreen.isEnabled())
				Fullscreen.cancel();
			else
				Fullscreen.all();

			$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;
		}

	}).
	controller('SidebarMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state, $layout)
	{

		// Menu Items
		var $sidebarMenuItems = $menuItems.instantiate();

		$scope.menuItems = $sidebarMenuItems.prepareSidebarMenu().getAll();

		// Set Active Menu Item
		$sidebarMenuItems.setActive( $location.path() );

		$rootScope.$on('$stateChangeSuccess', function()
		{
			$sidebarMenuItems.setActive($state.current.name);
		});

		// Trigger menu setup
		public_vars.$sidebarMenu = public_vars.$body.find('.sidebar-menu');
		$timeout(setup_sidebar_menu, 1);

		ps_init(); // perfect scrollbar for sidebar
	}).
	controller('HorizontalMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state)
	{
		var $horizontalMenuItems = $menuItems.instantiate();

		$scope.menuItems = $horizontalMenuItems.prepareHorizontalMenu().getAll();

		// Set Active Menu Item
		$horizontalMenuItems.setActive( $location.path() );

		$rootScope.$on('$stateChangeSuccess', function()
		{
			$horizontalMenuItems.setActive($state.current.name);

			$(".navbar.horizontal-menu .navbar-nav .hover").removeClass('hover'); // Close Submenus when item is selected
		});

		// Trigger menu setup
		$timeout(setup_horizontal_menu, 1);
	}).
	controller('SettingsPaneCtrl', function($rootScope)
	{
		// // Define Settings Pane Public Variable
		// public_vars.$settingsPane = public_vars.$body.find('.settings-pane');
		// public_vars.$settingsPaneIn = public_vars.$settingsPane.find('.settings-pane-inner');
	}).
	controller('UIModalsCtrl', function($scope, $rootScope, $modal, $sce)
	{
		// Open Simple Modal
		$scope.openModal = function(modal_id, modal_size, modal_backdrop)
		{
			$rootScope.currentModal = $modal.open({
				templateUrl: modal_id,
				size: modal_size,
				backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop
			});
		};

		// Loading AJAX Content
		$scope.openAjaxModal = function(modal_id, url_location)
		{
			$rootScope.currentModal = $modal.open({
				templateUrl: modal_id,
				resolve: {
					ajaxContent: function($http)
					{
						return $http.get(url_location).then(function(response){
							$rootScope.modalContent = $sce.trustAsHtml(response.data);
						}, function(response){
							$rootScope.modalContent = $sce.trustAsHtml('<div class="label label-danger">Cannot load ajax content! Please check the given url.</div>');
						});
					}
				}
			});

			$rootScope.modalContent = $sce.trustAsHtml('Modal content is loading...');
		}
	});