Array.prototype.getClosestTo = function (val) {
    if (this[val] !== undefined) {
        return val;
    } else {
        var upper = val;
        var upperMatched = false;
        var lower = val;
        var lowerMatched = false;

        while(upper < this.length) {
            if (this[++upper] !== undefined) {
                upperMatched = true;
                break;
            };
        };

        while(lower > -1) {
            if (this[--lower] !== undefined) {
                lowerMatched = true;
                break;
            };
        };

        if (upperMatched && lowerMatched) {
            return upper - val < val - lower ? upper : lower;
        } else if (upperMatched) {
            return upper;
        } else if (lowerMatched) {
            return lower;
        };
    };

    return -1;
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};

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
	this.getAnimationDuration = function(element){
		var cssDuration = getComputedStyle(element, null).animationDuration ||  getComputedStyle(element, null).WebkitAnimationDuration;
		var duration = parseFloat(cssDuration.replace('s','')) * 1000;
		return duration;
	};
	this.setToPercentage = function(element, percentage){
		var duration = this.getAnimationDuration(element);
		var delay = -(duration * percentage) / 1000;
		
	};
	this.setToDelay = function(element, delay){
		var initialDisplay = element[0].style.display;
		element[0].style.display='none';
		element.css({
			"-webkit-animation-delay": delay
		});
		element[0].offsetHeight; // no need to store this anywhere, the reference is enough
		element[0].style.display=initialDisplay;
	};
	this.drag = function(element, event){
		if(this.enabled){
			if(this.pos.init.x == 0){
				this.pos.init.x = event.x;
			}

			this.pos.current.x = event.x;

			var delay = 4 * ((this.pos.current.x - this.pos.init.x)/250);
			if(delay >= 4){
				delay = 3.999;
			}

			if(delay < 0){
				delay = 0;
			}

			delay = -delay;
		}else{
			delay = 0;
		}
		this.setToDelay(element,delay+'s');
	};

	return this;
	
}]);

slide.directive('slideIt', ['$timeout', '$window', function ($timeout, $window) {
	return {
		restrict: 'A',
		scope : {
			cssDelay : '=slideDelay'
		},
		controller: 'SlideItService',
		link : function (scope, iElement, iAttrs, SlideItService) {
			iElement[0].draggable = 'true';
			scope.duration = SlideItService.getAnimationDuration(iElement[0]);
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