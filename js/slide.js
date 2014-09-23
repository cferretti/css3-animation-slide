var slide = angular.module('directive.slideIt', []);
slide.controller('SlideItCtrl', ['$scope',function ($scope) {
	$scope.pos = {
		init : {
			x : 0,
			y : 0
		},
		current : {
			x : 0 ,
			y : 0
		}
	};
	$scope.enabled = false;
	$scope.dragRange = 0;
	$scope.animationDuration = 0;
	$scope.init = function(elements, dragRange){
		$scope.animationDuration = $scope.getAnimationDuration(elements[0]);
		$scope.dragRange = dragRange;
	};
	$scope.getAnimationDuration = function(element){
		var cssDuration = getComputedStyle(element, null).animationDuration ||  getComputedStyle(element, null).WebkitAnimationDuration;
		var duration = parseFloat(cssDuration.replace('s',''));
		return duration;
	};
	$scope.getDelayDragged = function(element, event){

		var delay = 0;

		if($scope.enabled){
			if($scope.pos.init.x == 0){
				$scope.pos.init.x = event.x;
			}

			$scope.pos.current.x = event.x;

			var delay =  $scope.animationDuration * (($scope.pos.current.x - $scope.pos.init.x)/$scope.dragRange);
			if(delay >= $scope.animationDuration){
				delay = $scope.animationDuration-0.001; //Avoid go initial position
			}else if(delay < 0){
				delay = 0;
			}

			delay = -delay; //Negative delay go to percentage of animation wanted
		}

		return delay;
	};
	$scope.setToDelay = function(elements, delay){
		var initialDisplay = elements[0].style.display;
		elements[0].style.display='none';
		elements.css({
			"-webkit-animation-delay": delay + 's'
		});
		elements[0].offsetHeight; // no need to store $scope anywhere, the reference is enough
		elements[0].style.display=initialDisplay;
	};
	$scope.drag = function(elements, event){
		var delay = $scope.getDelayDragged(elements[0], event);
		$scope.setToDelay(elements,delay);
	};
}]);

slide.directive('slideIt', ['$timeout', '$window', function ($timeout, $window) {
	return {
		restrict: 'A',
		scope : {
			range : '=slideItRange'
		},
		controller: 'SlideItCtrl',
		link : function (scope, iElement, iAttrs) {
			iElement[0].draggable = 'true';
			scope.init(iElement, scope.range);
			iElement[0].onmousedown = function(e){
				scope.enabled = true;
				scope.drag(iElement, e);
			};
			angular.element(window).on('mousemove', function(e){
               	if(scope.enabled){
					scope.drag(iElement, e);
				}
             });
			angular.element(window).on('mouseup', function(e){
               	scope.enabled = false;
				scope.drag(iElement, e);
             });
			iElement[0].ondragstart = function(e){
				return false;
			};
		}
	};
}])