(function () {
  'use strict';

  describe('Tboxes Route Tests', function () {
    // Initialize global variables
    var $scope,
      TboxesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TboxesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TboxesService = _TboxesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tboxes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tboxes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('tboxes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/tboxes/client/views/list-tboxes.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TboxesController,
          mockTbox;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tboxes.view');
          $templateCache.put('modules/tboxes/client/views/view-tbox.client.view.html', '');

          // create mock tbox
          mockTbox = new TboxesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Tbox about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TboxesController = $controller('TboxesController as vm', {
            $scope: $scope,
            tboxResolve: mockTbox
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tboxId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tboxResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tboxId: 1
          })).toEqual('/tboxes/1');
        }));

        it('should attach an tbox to the controller scope', function () {
          expect($scope.vm.tbox._id).toBe(mockTbox._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tboxes/client/views/view-tbox.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TboxesController,
          mockTbox;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tboxes.create');
          $templateCache.put('modules/tboxes/client/views/form-tbox.client.view.html', '');

          // create mock tbox
          mockTbox = new TboxesService();

          // Initialize Controller
          TboxesController = $controller('TboxesController as vm', {
            $scope: $scope,
            tboxResolve: mockTbox
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tboxResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tboxes/create');
        }));

        it('should attach an tbox to the controller scope', function () {
          expect($scope.vm.tbox._id).toBe(mockTbox._id);
          expect($scope.vm.tbox._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tboxes/client/views/form-tbox.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TboxesController,
          mockTbox;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tboxes.edit');
          $templateCache.put('modules/tboxes/client/views/form-tbox.client.view.html', '');

          // create mock tbox
          mockTbox = new TboxesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Tbox about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TboxesController = $controller('TboxesController as vm', {
            $scope: $scope,
            tboxResolve: mockTbox
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tboxId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tboxResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tboxId: 1
          })).toEqual('/tboxes/1/edit');
        }));

        it('should attach an tbox to the controller scope', function () {
          expect($scope.vm.tbox._id).toBe(mockTbox._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tboxes/client/views/form-tbox.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('tboxes.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('tboxes/');
          $rootScope.$digest();

          expect($location.path()).toBe('/tboxes');
          expect($state.current.templateUrl).toBe('modules/tboxes/client/views/list-tboxes.client.view.html');
        }));
      });

    });
  });
}());
