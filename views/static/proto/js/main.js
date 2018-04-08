require(["Hammer"], function(Hammer) {
    require(["base", "iscroll"], function(base, IScroll) {
        var contentHeight, scrollTop,
            scroller = base.find('content'),
            pages = scroller.getElementsByClassName('page'),
            covers = document.getElementsByClassName('cover'),
            header = base.find('header'),
            homeBtn = document.getElementsByClassName('homeBtn')[0],
            images = scroller.getElementsByTagName('img'),
            cover, pg1, pg2, pg3, pg4;;
        Hammer.on(window, 'resize', inital);

        var scrl = new IScroll(scroller, {
            scrollbars: true,
            mouseWheel: true,
            probeType: 3,
            speedRatioY: 0.3,
        });
        scrl.on('scroll', parallax);
        inital();

        function inital() {
            contentHeight = scroller.clientHeight;
            for (var i = covers.length - 1; i >= 0; i--) {
                covers[i].style.height = contentHeight * 0.7 + 'px';
            }
            cover = contentHeight * 0.7;
            pg1 = cover + pages[0].clientHeight;
            pg2 = pg1 + cover + pages[1].clientHeight;
            pg3 = pg2 + cover + pages[2].clientHeight;
            pg4 = pg3 + cover + pages[3].clientHeight;
            scrl.refresh();
        }

        //视差滚动的方法
        function parallax(delta) {
            scrollTop = -scrl.y;
            if (scrollTop < pg1) {
                covers[0].scrollTop = scrollTop * 0.4;
            } else if (scrollTop < pg2) {
                covers[1].scrollTop = (scrollTop - pg1) * 0.4;
            } else if (scrollTop < pg3) {
                covers[2].scrollTop = (scrollTop - pg2) * 0.4;
            } else if (scrollTop < pg4) {
                covers[3].scrollTop = (scrollTop - pg3) * 0.4;
            }
        }
        var header = base.find('header'),
            headHdl = new Hammer.Manager(header, {
                recognizers: [
                    [Hammer.Tap]
                ]
            });
        headHdl.on('tap', function(ev) {
            var target = ev.target;
            switch (target.getAttribute('name')) {
                case 'download':
                    window.location.href = "陈峥_简历.pdf";
                    break;
                case 'index':
                    window.location.href = "index.html";
                    break;
                case 'project':
                    window.location.href = "porfolio.html";
                    break;
                default:
                    return;
            }
        });
    });
});
