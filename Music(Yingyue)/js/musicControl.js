window.onload = function() {

    function getId(id) {
        return document.getElementById(id);
    }

    function moveVolumeMask(e) {
        e.preventDefault();
        //获取手指相对于整个页面的横向坐标
        var pageY = e.touches[0].pageY;
        //mask移动的距离
        var y = pageY - offsetTop - volumeMaskHeight / 2;
        //mask最大移动的距离javascript:void (0)
        var maxY = volumeNotActiveHeight + volumeMaskHeight / 2 +　3;  
        //mask最小的移动距离
        var minY = 9;
        y = y >= maxY ? maxY : y <= minY ? minY : y;
  
        volumeMask.style.top = y + 'px';
        //改变激活进度条的宽度
        volumeActive.style.height = y - minY + 'px';
        //调节音量
        var percent = (y - minY) /volumeLayerHeight;

        audio.volume=percent;
    }
    //移动mask
    function moveMask(e) {
        //获取触摸相对于整个页面的横向坐标
        var pageX = e.touches[0].pageX;
        //mask移动的距离
        var x = pageX - offsetLeft;

        //mask最大移动的距离
        var maxX = progressParentWidth;
        //mask最小的移动距离
        var minX = 0;
        x = x >= maxX ? maxX : x <= minX ? minX : x;

        mask.style.left = x + 'px';
        //改变激活进度条的宽度
        colorLine.style.width = x + 'px';
        //设置当前播放时间
        audio.currentTime = x / progressParentWidth * audio.duration;
    }

    //监听音乐的实时变化
    function formatTime(selector, time) {
        var hours = Math.floor(time / 60 / 60 % 60);
        hours = hours >= 10 ? hours : '0' + hours;
        var minutes = Math.floor(time / 60 % 60);
        minutes = minutes >= 10 ? minutes : '0' + minutes;
        var seconds = Math.floor(time % 60);
        seconds = seconds >= 10 ? seconds : '0' + seconds;
        $(selector).text( minutes + ':' + seconds);
    }

    //列表顺序播放
    function played(toggle){
        //获取所有li
        var $lis=$('#list>li');
        //获取一个激活的li
        var $activeLi=$('#list>li.audio-active')[0];
        if ($activeLi) {
            //如果存在被激活的li
            //直接播放
            var index=$($activeLi).index();
            if (toggle == 'prev') {
                //上一首
                index = index == 0 ? $lis.length -1 : --index;
                togglePlay($lis, $activeLi, index); 
            }else if (toggle == 'next') {
                //下一首
                index = index == $lis.length - 1 ? 0 : ++index;
                togglePlay($lis, $activeLi, index); 
            }
        }
    }
    //列表顺序播放
    function togglePlay($lis, $activeLi, index){
        //下一个激活的li
        var $lastLi = $lis.eq(index);
        $lastLi.addClass('audio-active').siblings().removeClass('audio-active');
        //修改当前播放状态
        $($activeLi).data('play', false);
        $($activeLi).find('i').addClass('fa-play').removeClass('fa-pause');
        $lastLi.data('play', true);
        $lastLi.find('i').addClass('fa-pause').removeClass('fa-play');
        audio.src = $lastLi.data('url');

        audio.play();

        $('#play').find('i').addClass('fa-pause').removeClass('fa-play');
        playOne = true;
    }
    //单曲循环
    function simpleLoopPlay(toggle){
        //获取所有li
        var $lis = $('#list>li');
        //获取一个激活的li
        var $activeLi = $('#list>li.audio-active')[0];
        if ($activeLi) {
            //如果存在被激活的li
            //直接播放
            if (toggle) {
                audio.play();
                audio.load();
                $($activeLi).find('i').addClass('fa-pause').removeClass('fa-play');
            }else{
                //修改音频已加载状态
                isLoadAudio=true;
                var $fristLi=$lis.eq(0);
                console.log($fristLi);
                audio.src=$fristLi.data('url');
            }
        }
    }
    //随机播放
    function randomPlay(toggle){
        //获取所有li
        var $lis = $('#list>li');
        //获取一个激活的li
        var $activeLi = $('#list>li.audio-active')[0];
        //获取随机下标
        var randomIndex=Math.floor(Math.random()*$lis.length);
        //去掉自己选中的歌曲遍历其他同胞节点最长为3个歌曲
        //加载audio
        audio.src=$($lis).eq(randomIndex).data('url');
        if (toggle) {
            //寻找$lis中的randomIndex,添加Class,再移除其他的同胞节点Class
            $lis.eq(randomIndex).addClass('audio-active').siblings().removeClass('audio-active');
            $lis.eq(randomIndex).data('play',true).find('i').addClass('fa-pause').removeClass('fa-play');
            //如果当前激活的li和随机激活的li不一致
            if (!($lis.eq(randomIndex)[0] == $activeLi)) {
                $($activeLi).data('play',false).find('i').addClass('fa-play').removeClass('fa-pause');
            }
            audio.play();
            $('#play').find('i').addClass('fa-pause').removeClass('fa-play');
            isPlay = true;
        }else{
            //播放暂停按钮
            //修改音频已加载状态
            isLoadAudio = true;
            $lis.eq(randomIndex).addClass('audio-active');
        }

    }

   var audio = $('#audio')[0];
    var duration = audio.duration;
    //是否已经加载音频资源
    var isLoadAudio = false;
    var offsetLeft = getId('progress').offsetLeft;
    var mask = getId('mask');
    //获取mask的宽度
    var maskWidth = mask.clientWidth;
    //获取未激活进度的宽度
    var progressParent = getId('progressParent');
    var progressParentWidth = progressParent.clientWidth;

    audio.addEventListener( "canplaythrough",
    function() {
    　   //音频总时长
          console.log("duration = "+ audio.duration);
          duration = audio.duration;
    　   //audio.play();
    }, false );
    audio.load();

    //音频当前播放时长
    var progress = getId('progress');
    var layer = getId('layer');
    var mask = getId('mask');

    //保留开始触摸坐标
    var p = {
        x: 0,
        y: 0,
        l: 0,
        r: 0
    };
    layer.ontouchstart = function(e) {
        if (!isLoadAudio) {return;};
        moveMask(e);
    }

    layer.ontouchmove = function(e) {
        if (!isLoadAudio) {return;};
        moveMask(e);
    }

    //移动音量mask
    var volumeMask = getId('volumeMask');
    var volumeMaskHeight = parseInt(window.getComputedStyle(volumeMask).height);
    var $modifyVolume = $('#modifyVolume');
    var height = $modifyVolume.innerHeight();
    var $volumeLayer = $('#volumeLayer');
    var volumeLayerHeight = $volumeLayer.height();
    var musicControl = getId('musicControl');
    var offsetTop = musicControl.offsetTop - height + (height - volumeLayerHeight) / 2 + 30;
    var volumeNotActiveHeight = $('#volumeNotActive').height();
    var volumeActive = getId('volumeActive');
    var volumeLayer = getId('volumeLayer');
    volumeLayer.ontouchstart = function (e) {
        moveVolumeMask(e);
    }
    volumeLayer.ontouchmove = function (e) {
        moveVolumeMask(e);
    }

    // ================JQuery===============
    //点击时切换图片暂停
    var playOne=false;
    var playing=$('.playing-i');
    $('#play').on('click',function(){
       
        if (playOne) {
            //停止播放
            playing.removeClass('fa-pause').addClass('fa-play');
            playOne=false;
            audio.pause();

            $('#list').find('li.audio-active').find('i').removeClass('fa-pause').addClass('fa-play').end().data('play', false);

            //停止碟子旋转
            $('#photo').css({'animation-play-state': 'paused'});
        }else{
            //播放动画
            playing.removeClass('fa-play').addClass('fa-pause');
            playOne=true;
            //播放音乐
            // audio.play();
            $('#list').find('li.audio-active').find('i').removeClass('fa-play').addClass('fa-pause').end().data('play', true);
            //碟子旋转
            $('#photo').css({'animation-play-state': 'running'});
        }
    })
    //上一首prev
	$('#prev').on('click',function(){

        // 获取激活的li
        var $activeLi = $('#list>li.audio-active');
        if (!$activeLi[0]) {
            //如果当前没有激活li, 直接拦截
            return;
        }
        //=============获取当前播放模式(3种)
        //点击列表中的歌曲,才能执行后面的内容
        var mode=$('#playMode').data('mode');
         //exchange为顺序播放
        if (mode == 'exchange') {
            played('prev');
        }else if (mode == 'loop') {
            //单曲循环
            simpleLoopPlay('prev');
        }else if (mode == 'random') {
            //随机播放
            randomPlay('prev');
        }
        //修改选中歌曲歌手的图片
        var imgSrc = $('#list').find('li.audio-active').find('.auto-img').attr('src');
        $('#singerImg').find('.auto-img').attr('src', imgSrc);
    })
    //下一首
    $('#next').on('click',function(){
         // 获取激活的li
        var $activeLi = $('#list>li.audio-active');
        if (!$activeLi[0]) {
            //如果当前没有激活li, 直接拦截
            return;
        }
        //=============获取当前播放模式(3种)
        //点击列表中的歌曲,才能执行后面的内容
        var mode=$('#playMode').data('mode');
         //exchange为顺序播放
        if (mode == 'exchange') {
            played('next');
        }else if (mode == 'loop') {
            //单曲循环
            simpleLoopPlay('next')
        }else if (mode == 'random') {
            //随机播放
            randomPlay('next');
        }
        //修改选中歌曲歌手的图片
        var imgSrc = $('#list').find('li.audio-active').find('.auto-img').attr('src');
        $('#singerImg').find('.auto-img').attr('src', imgSrc);
    })

    //replay
    var replayOne=false;
    $('#replay').on('click',function(){
        // audio.load();
        if (replayOne) {
            //没有显示的时候
            $('.play-mode-more').css({'display':'none'});
            replayOne=false;
        }else{
            //点击是显示
            $('.play-mode-more').css({'display':'block'});
            replayOne=true;
        }
    })

    // YL
    var YLOne=false;
    $('#YL').on('click',function(){
        if (YLOne) {
            //音量的
            $('.adjust').css({'display':'none'});
            YLOne=false;
        }else{
            //音量显示
            $('.adjust').css({'display':'block'});
            YLOne=true;
        }
    })

    //列表点击选中这列表的歌曲名称
    var playA = $('#play');
    var $lis = $('#list>li');

    $lis.on('click', function () {
        isLoadAudio = true;
        if (!$(this).hasClass('audio-active')) {

            $(this).addClass('audio-active').siblings().removeClass('audio-active');
            //获取当前li自定义的data属性
            var url = $(this).data('url');
            audio.src = url;
            audio.play();
            $(this).find('i').removeClass('fa-play').addClass('fa-pause').end().siblings().find('i').removeClass('fa-pause').addClass('fa-play');
            $(this).data('play', true).siblings().data('play', false);
            playing.removeClass('fa-play').addClass('fa-pause');
            //转动碟子
            $('#photo').css({'animation-play-state': 'running'});
           //修改选中歌曲歌手的图片
            var imgSrc = $('#list').find('li.audio-active').find('.auto-img').attr('src');
            $('#singerImg').find('.auto-img').attr('src', imgSrc);

            isPlay = true;

        } else {
            //点击相同的li, 那么只做停止或者播放音乐
            var isPlaying = $(this).data('play');

            if (isPlaying) {
                //如果播放，那么停止
                audio.pause();
                $(this).find('i').removeClass('fa-pause').addClass('fa-play');
               playing.removeClass('fa-pause').addClass('fa-play');
                //停止转动碟子
                $('#photo').css({'animation-play-state': 'paused'});

                isPlay = false;
            } else {
                //如果停止，那么播放
                audio.play();
                $(this).find('i').removeClass('fa-play').addClass('fa-pause');
               playing.removeClass('fa-play').addClass('fa-pause');
                //转动碟子
                $('#photo').css({'animation-play-state': 'running'});
                isPlay = true;
            }
            $(this).data('play', !isPlaying);
        }
    })
    //=================================
    //切换写真面板
    $('#singerImg').on('click', function () {
        $('#photography').toggle(303);
    })

    //关闭写真面板
    $('#close').on('click', function () {
        $('#photography').toggle(303);
    })
// ==============================
	//监听音频播放实时变化事件
	audio.ontimeupdate = function () {
        //总时长
        var duration = this.duration;
        if (!isNaN(duration)) {
            //当前的播放时间
            var currentTime = this.currentTime;
            //获取当前时间和总时间的百分比
            var percent = currentTime / duration;
            var left = percent * parseInt(window.getComputedStyle(progress).width);
            var activeWidth = left;
            
            //设置激活进度条的宽度
            colorLine.style.width = activeWidth + 'px';
            //小滑块移动距离
            mask.style.left = activeWidth + 'px';
            //设置当前时间文本
            formatTime('#currentTime', currentTime);
        }
    }
    //监听音乐播放完成停止的时候执行
    audio.onpause=function(){
        //总时长
        var duration = this.duration;
        //获取播放结束是的音乐时间
        var currentTime = $('#currentTime').text();
        if (currentTime != duration) {
            return;
        }
        // var mode = $('#playMode').data('mode');
        // if (mode == 'exchange') {
        //     //列表顺序播放
        //     played('next');
        // } else if (mode == 'loop') {
        //     //单曲循环
        //     simpleLoopPlay('next');
        // } else if (mode == 'random') {
        //     //随机播放
        //     randomPlay('next');
        // }
        // var imgSrc = $('#list').find('li.audio-active').find('.auto-img').attr('src');
        // $('#singerImg').find('.auto-img').attr('src', imgSrc);  
    }
    //============================
    //切换播放模式
    $('.play-mode-more>div').on('click',function(){
        var currentIcon = $('#playMode').data('icon');
        var mode = $(this).data('mode');
        var icon = $(this).data('icon');
        $('#playMode').data('mode', mode).data('icon', icon).find('.play-mode-icon>i').removeClass(currentIcon).addClass(icon);
    
    })
}