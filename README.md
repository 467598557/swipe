# swipe
## 一个支持竖向滑动的js插件，不依赖于其他库的轻量级滑动库
1.使用时需要new Swipe(e), 主要参数如下:
```javascript
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
```
2.马上就能上手，看如下使用案例
```javascript
var swiper = new Swipe({
            	continues: true, 
            	swipeTime: 1000,
            	swipeWhenSwiping: true,
            	onSwipeStart: function() {
            		console.log("start");
            		return true;
            	},
            	onSwipeEnd: function() {
            		console.log("end");
            	},
            	dom: document.getElementById("swipeWrapper")
            });
```
3.使用提示:
3.1.onSwipeStart返回true时，才会成功执行后面的滑动过程。
3.2.每次滑动后，都会执行onSwipeEnd函数，排除连续滑动，连续滑动，只会执行一次onSwipeEnd函数。
3.3.默认不开启手指滑动，页面跟随滑动的效果。
4.查看网址，学习创建该插件的过程。(做成一个能用的模块很容易，很容易模仿，但是创作的思路会提供宝贵的经验，尤其是对于初学者来说。)
[http://www.hui52.com/archives/977.html]
