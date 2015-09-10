# swipe
## 一个支持竖向滑动的js插件，不依赖于其他库的轻量级滑动库
### 1.demo:
```
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


