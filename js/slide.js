var slide = angular.module('directive.slideIt', []);
slide.controller('SlideItService', ['$scope',function ($scope) {
	this.pos = {
		init : {
			x : 0,
			y : 0
		},
		current : {
			x : 0 ,
			y : 0
		}
	};
	this.enabled = false;
	this.dragRange = 0;
	this.animationDuration = 0;
	this.init = function(elements, dragRange){
		this.animationDuration = this.getAnimationDuration(elements[0]);
		this.dragRange = dragRange;
	};
	this.getAnimationDuration = function(element){
		var cssDuration = getComputedStyle(element, null).animationDuration ||  getComputedStyle(element, null).WebkitAnimationDuration;
		var duration = parseFloat(cssDuration.replace('s',''));
		return duration;
	};
	this.getDelayDragged = function(element, event){

		var delay = 0;

		if(this.enabled){
			if(this.pos.init.x == 0){
				this.pos.init.x = event.x;
			}

			this.pos.current.x = event.x;

			var delay =  this.animationDuration * ((this.pos.current.x - this.pos.init.x)/this.dragRange);
			if(delay >= this.animationDuration){
				delay = this.animationDuration-0.001; //Avoid go initial position
			}else if(delay < 0){
				delay = 0;
			}

			delay = -delay; //Negative delay go to percentage of animation wanted
		}

		return delay;
	};
	this.setToDelay = function(elements, delay){
		var initialDisplay = elements[0].style.display;
		elements[0].style.display='none';
		elements.css({
			"-webkit-animation-delay": delay + 's'
		});
		elements[0].offsetHeight; // no need to store this anywhere, the reference is enough
		elements[0].style.display=initialDisplay;
	};
	this.drag = function(elements, event){
		var delay = this.getDelayDragged(elements[0], event);
		this.setToDelay(elements,delay);
	};

	return this;
	
}]);

slide.directive('slideIt', ['$timeout', '$window', function ($timeout, $window) {
	return {
		restrict: 'A',
		scope : {
			dragRange : '=slideItRange'
		},
		controller: 'SlideItService',
		link : function (scope, iElement, iAttrs, SlideItService) {
			iElement[0].draggable = 'true';
			SlideItService.init(iElement, scope.dragRange);
			iElement[0].onmousedown = function(e){
				SlideItService.enabled = true;
				SlideItService.drag(iElement, e);
			};
			angular.element(window).on('mousemove', function(e){
               	if(SlideItService.enabled){
					SlideItService.drag(iElement, e);
				}
             });
			angular.element(window).on('mouseup', function(e){
               	SlideItService.enabled = false;
				SlideItService.drag(iElement, e);
             });
			iElement[0].ondragstart = function(e){
				return false;
			};
		}
	};
}])