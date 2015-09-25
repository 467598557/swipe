 /**
* e 为初始化该插件传进的参数
* e.startIndex 默认在第几屏（默认从0开始）
* e.swipeTime 滑动一次时间 (毫秒级别)
* e.continues false/true 是否以无限滑动方式(滑倒最后一页，继续下滑时翻到第一页)
* e.swipeWhenSwiping false/true 在一页滑动过程中，是否可以连续滑动
* e.onSwipeStart 滑动开始回调函数,返回true/false,true会继续触发滑动，false停止该动作
* e.onSwipeEnd 滑动结束触发函数
* e.swipeLimitedSize 设置判定用户竖向滑动的移动像素大小(默认为100像素)
* e.floowSwipe 页面是否跟随手指滑动产生滑动效果
*/
function Swipe(e) {
	var that = this;
	var swipeBody, children, swipeBodyStyle, startPos, endPos, movePos, timer,
		UP = 1,
		DOWN = -1,
		SWIPE_LIMITED_SIZE = 100,
		DEFAULT_SWIPE_TIME = 400;
	var handler = {
		currentIndex: function() {
			var currentIndex = that.currentIndex;
			return that.e.continues ? currentIndex - 1 : currentIndex;
		},
		next: function() {
			quickSwipe(that.currentIndex);
			swipeTo(that.currentIndex + 1);
		},
		prev: function() {
			quickSwipe(that.currentIndex);
			swipeTo(that.currentIndex - 1);
		},
		swipeTo: function(index) {
			if(typeof index !== "number" || index <= 0 || index > that.e.defaultEndIndex) {
				return false;
			}

			quickSwipe(that.currentIndex);
			swipeTo(index);
		}
	};
	
	var Helper = {
		setTransitionYMove: function(dist, time) {
			swipeBodyStyle.webkitTransitionDuration =
			swipeBodyStyle.MozTransitionDuration =
			swipeBodyStyle.msTransitionDuration =
			swipeBodyStyle.OTransitionDuration =
			swipeBodyStyle.transitionDuration = time + 'ms';
			
			swipeBodyStyle.webkitTransform = 'translate(0, ' + dist+')' + 'translateZ(0)';
			swipeBodyStyle.msTransform =
			swipeBodyStyle.MozTransform =
			swipeBodyStyle.OTransform = 'translateY(' + dist+')';
		},
		resetIndex: function() {
			if(!that.e.continues) {
				return false;
			};

			switch(that.currentIndex) {
				case that.childrenLength-1:
					that.currentIndex = that.e.defaultStartIndex;
					that.isResetIndex = true;
				break;
				case 0:
					that.currentIndex = that.e.defaultEndIndex;
					that.isResetIndex = true;
				break;
				default:
					that.isResetIndex = false;
			}
			
			return that.isResetIndex;
		},
		getEventPos: function(e, isTouchEnd) {
			if(that.touch) {
				return {
					x: isTouchEnd ? (e.changedTouches[0].pageX || e.changedTouches[0].clientX) : (e.touches[0].pageX || e.touches[0].pageY),
					y: isTouchEnd ? (e.changedTouches[0].pageY || e.changedTouches[0].clientY) : (e.touches[0].pageY || e.touches[0].clientY)
				};
			}

			return {
				x: e.pageX || e.clientX,
				y: e.pageY || e.clientY
			}
		},
		animate: {
			run: function(from, to, speed, callback) {
			    if (!speed) {
		      		swipeBodyStyle.top = to + '%';
			      return;
			    }

			    var start = +new Date;
			    timer = setInterval(function() {
		     	 	var timeElap = +new Date - start;
	     		 	if (timeElap > speed) {
			        	swipeBodyStyle.top = to + '%';
			        	callback && callback();

			        	clearInterval(timer);
			        	return;
			      	}

		     		swipeBodyStyle.top = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + '%';
			    }, 4);
		  	},
			stop: function() {
				clearInterval(timer);

				return this;
			}
		},
		eventHandlers: {
			bindInitedEvent: function() {
				if(that.transitions) {
					swipeBody.addEventListener('webkitTransitionEnd', Helper.eventHandlers.swipeEnd, false);
					swipeBody.addEventListener('msTransitionEnd', Helper.eventHandlers.swipeEnd, false);
					swipeBody.addEventListener('oTransitionEnd', Helper.eventHandlers.swipeEnd, false);
					swipeBody.addEventListener('otransitionend', Helper.eventHandlers.swipeEnd, false);
					swipeBody.addEventListener('transitionend', Helper.eventHandlers.swipeEnd, false);
				}	
				if(that.touch) {
					that.e.dom.addEventListener("touchstart", Helper.eventHandlers.touchStart, false);
				} else {
					that.e.dom.addEventListener("mousedown", Helper.eventHandlers.touchStart, false);
				}
			},
			bindOtherEvents: function() {
				if(that.touch) {
					that.e.dom.addEventListener("touchmove", Helper.eventHandlers.touchMove, false);
					that.e.dom.addEventListener("touchend", Helper.eventHandlers.touchEnd, false);
				} else {
					that.e.dom.addEventListener("mousemove", Helper.eventHandlers.touchMove, false);
					that.e.dom.addEventListener("mouseup", Helper.eventHandlers.touchEnd, false);
				}
			},
			unbindOtherEvents: function() {
				if(that.touch) {
					that.e.dom.removeEventListener("touchmove", Helper.eventHandlers.touchMove, false);
					that.e.dom.removeEventListener("touchend", Helper.eventHandlers.touchEnd, false);
				} else {
					that.e.dom.removeEventListener("mousemove", Helper.eventHandlers.touchMove, false);
					that.e.dom.removeEventListener("mouseup", Helper.eventHandlers.touchEnd, false);
				}
			},
			swipeEnd: function(e) {
				var target = e.target;
				if(target && target != swipeBody) {
					return false;
				}
				that.swiping = false;
				Helper.resetIndex();
				if(that.e.continues && that.isResetIndex) {
					if(that.transitions) {
						Helper.setTransitionYMove(-that.currentIndex*100+"%", 0);
					} else {
						swipeBodyStyle.top = -that.currentIndex*100+"%";
					}
				}

				that.e.onSwipeEnd && that.e.onSwipeEnd.call(children[that.currentIndex]);
			},
			touchStart: function(e) {
			    startPos = Helper.getEventPos(e);	
			    startPos.time = +new Date();

			    Helper.eventHandlers.bindOtherEvents();
			},
			touchMove: function(e) {
				e.preventDefault && e.preventDefault();
				if(!that.e.floowSwipe) {
					movePos = {
						time: 0
					};
					return true;
				}
				movePos = Helper.getEventPos(e);	
				movePos.time = +new Date();
			    
			    var distPosY = "calc("+(-that.currentIndex*100+"% + "+(movePos.y-startPos.y))+"px)";
			    // 同步拖动过程
			    if(that.transitions) {
			    	Helper.setTransitionYMove(distPosY, 0);
			    } else {
					Helper.animate.stop().run(-that.currentIndex*100, distPosY, 0);
			    }
			},
			touchEnd: function(e) {
				endPos = Helper.getEventPos(e, true);
		     	if(Math.abs(endPos.y - startPos.y) < that.swipeLimitedSize) {
		     		// 还原设置
		     		if(that.transitions) {
		     			Helper.setTransitionYMove((-that.currentIndex*100)+"%", that.e.swipeTime / 2);
		     		} else {
		     			Helper.animate.stop().run(parseFloat(swipeBodyStyle.top), -that.currentIndex*100, 0);
		     		}
		     		return;
		     	}
		     	Helper.eventHandlers.swipeHandler(endPos.y > startPos.y ? DOWN : UP);
		     	Helper.eventHandlers.unbindOtherEvents();
			},
			swipeHandler: function(offsetIndex) {
				if(that.swipeHandlerExecing) {
					return;
				}
				that.swipeHandlerExecing = true;
				if(!that.swiping) {
					if(that.e.onSwipeStart && !that.e.onSwipeStart()) {
						that.swipeHandlerExecing = false;
						return;
					}
				} else {
					if(!that.e.swipeWhenSwiping) {
						that.swipeHandlerExecing = false;
						return;
					}
					quickSwipe(that.currentIndex, function() {
						swipeTo(that.currentIndex + offsetIndex);
						that.swipeHandlerExecing = false;
					});
					return;
				}

				swipeTo(that.currentIndex + offsetIndex);
				that.swipeHandlerExecing = false;
			}
		}
	};
	function initParam() {
		!e && (e = {});
		if(!e.dom) {
			throw new Error("缺少参数！");
		}
		
		var dom = e.dom;
		swipeBody = dom.getElementsByClassName("swipeBody")[0];
		children = swipeBody.children;
		swipeBodyStyle = swipeBody.style;
		e.startIndex = e.startIndex ? e.startIndex-1 : 0;
		e.defaultStartIndex = 0;
		e.defaultEndIndex = children.length-1;
		e.swipeTime = e.swipeTime || DEFAULT_SWIPE_TIME;
		that.e = e;
		that.currentIndex = 0;
		that.swiping = false;
		that.transitions = false;
		that.swipeLimitedSize = e.swipeLimitedSize || SWIPE_LIMITED_SIZE;
		that.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		// check transitions
		(function(undefined) {
			var checkTransitionArray = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
			var checkTransitionDom = document.createElement("div");
			for(var i=0, len=checkTransitionArray.length; i<len; i++) {
				if(checkTransitionDom.style[checkTransitionArray[i]] !== undefined) {
					that.transitions = true;
					break;
				}
			}
		})();
	};
	
	function init() {
		initParam();
		/*初始化无限滑动部分*/
		if(that.e.continues && children.length > 2) {
			var last = children[children.length - 1];
			var first = children[0];
			swipeBody.appendChild(first.cloneNode(true));
			swipeBody.insertBefore(last.cloneNode(true), first);
			children = swipeBody.children;
			that.e.defaultStartIndex += 1;
			that.e.startIndex += 1;
			that.e.defaultEndIndex += 1;
		}
		that.childrenLength = children.length;

		Helper.eventHandlers.bindInitedEvent();
	};
	function swipeTo(index) {
		if(index < 0 || (!that.e.continues && index >= that.childrenLength)) {
			return;
		}
		var prevIndex = that.currentIndex;
		that.currentIndex = index;
		that.swiping = true;
		var moveCostTime = that.e.floowSwipe ? (movePos.time - startPos.time): 0;
		var time = that.e.swipeTime - moveCostTime;
		time = time < that.e.swipeTime/3 ? that.e.swipeTime/3 : time;
		if(that.transitions) {
			Helper.setTransitionYMove(-index*100+"%", time);
		} else {
			Helper.animate.stop().run((parseFloat(swipeBodyStyle.top) || 0), -index*100, time, Helper.eventHandlers.swipeEnd);
		}
	};
	function quickSwipe(index, callback) {
		if(index < 0 || (!that.e.continues && index >= that.childrenLength)) {
			return;
		}
		
		that.currentIndex = index;
		Helper.resetIndex();
		if(that.transitions) {
			Helper.setTransitionYMove(-that.currentIndex*100+"%", 0);
		} else {
			Helper.animate.stop().run((parseFloat(swipeBodyStyle.top) || 0), -that.currentIndex*100, 0);
		}
		
		that.swiping = false;
		// 防止浏览器针对脚本优化产生的bug
		setTimeout(function() {
			callback && callback();
		}, 0);	
	};

	init();
	quickSwipe(that.e.startIndex);
	
	return handler;
}
