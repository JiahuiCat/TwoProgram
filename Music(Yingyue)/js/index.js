$(function(){

	var maskWidth = parseInt(maskStyle.width);

	// 音乐进度条移动
	function moveMask(e){
		var x=e.offsetX;
		console.log('x===',x);
		var left = x - maskWidth / 2;
	}
	
})