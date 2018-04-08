require(["Hammer"], function(Hammer) {
    require(["base", 'iscroll'], function(base, IScroll) {
        var imgSet = {
            event: [
                '竹节活动助手以标准任务清单的形式管理活动',
                '解决各类活动人多、事杂、管理难的问题',
                '竹节活动助手',
                '管理关键节点和任务前置的关系',
                '竹节活动助手',
                '任务精确到分钟',
                '手势操作共享文件',
                '手势操作共享文件',
                '【结束】',
            ],
            mind: [
                '竹节脑图是基于web的移动端脑图工具',
                '方便手机端脑图管理和查看',
                '脑库',
                '将主流脑图迅速分享至社交媒体',
                '多种视图查看【结束】',
            ],
            buckle: [
                '儿童手推车卡扣，用户研究',
                '研究分为发散和设计两个阶段',
                '问卷及访谈法',
                '人体工程学分析法',
                '关键步骤审查法',
                '案例研究法',
                'FMEA法',
                '分析阶段形成设计指南及最终设计【结束】',
            ],
            lexus: [
                '品牌感受描述——拼贴法',
                '逐渐形成表达自身品牌的设计语言',
                '品牌继承',
            ],
            helicopter: [
                '认知——感知——联想法',
                '强化设计感受',
                '设计草图',
                '计算表面曲率连续，达到工程标准',
                '准备效果渲染',
                '再次审查设计目标及感受【结束】',
            ],
            formula: [
                '草图设计',
                '2D渲染',
                'Rollup整体组装',
                '环氧树脂工艺',
                '根据设计规范评分【结束】',
            ],
            ergo: [
                '轨道设计游戏，设备人机分析',
                '路线设计',
                '关键部件材质',
                '坐姿眼高',
                '射击枪最佳人机尺寸',
                '射击枪最佳人机尺寸',
                '把手最佳尺寸【结束】',
            ],
            sketch: [
                '彩铅，铅笔——A3',
                '马克笔，圆珠笔——A3',
                '水粉——A0',
                '手写板——A4',
                '圆珠笔——A3',
                '圆珠笔——A3【结束】',
            ],

        };
        var curPage = 1,
            left = 0,
            moveX = 0,
            total = 0,
            sliderInit = function(ele, tapFn) {
                var mngr = new Hammer.Manager(ele, {
                        recognizers: [
                            [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
                        ]
                    }),
                    total = ele.getElementsByTagName('data').length,
                    height = ele.clientHeight;
                mngr.curPage = 0;
                mngr.changePg = function(nxt) {
                    var ctrl = 1;
                    if (nxt) {
                        mngr.curPage++;
                        if (mngr.curPage >= (total - 1)) mngr.curPage = total - 1;
                    } else {
                        mngr.curPage--;
                        if (mngr.curPage < 0) mngr.curPage = 0;
                    }
                    ele.firstChild.style.transition = '0.2s transform ease';
                    ele.firstChild.style.transform = "translateY(" + (-mngr.curPage * height) + "px)";
                    setTimeout(function() {
                        ele.firstChild.style.transition = '';
                    }, 200);
                    var arr = ele.getElementsByTagName('data');
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i].id === ('image_' + mngr.curPage)) {
                            arr[i].setAttribute('cur', 'cur');
                        } else if (arr[i].id === ('image_' + (mngr.curPage - 1))) {
                            arr[i].setAttribute('cur', 'prev');
                        } else if (arr[i].id === ('image_' + (mngr.curPage + 1))) {
                            arr[i].setAttribute('cur', 'next');
                        } else {
                            arr[i].removeAttribute('cur');
                        }
                    }
                };

                mngr.on("panstart panup pandown panend", function(ev) {
                    switch (ev.type) {
                        case "panstart":
                            break;
                        case "panup":
                        case "pandown":
                            ele.firstChild.style.transform = "translateY(" + (-height * mngr.curPage + ev.deltaY) + "px)";
                            break;
                        case "panend":
                            if (ev.deltaY < 0) {
                                mngr.changePg(true);
                            } else {
                                mngr.changePg(false);
                            }
                            break;
                    }
                });
                var time = 0,
                    deltaT = 0;
                var wheelHandler = function(e) {
                    deltaT = e.timeStamp - time;
                    time = e.timeStamp;
                    if (deltaT < 50) return;
                    if ('deltaY' in e) {
                        wheelDeltaY = -e.deltaY;
                    } else if ('wheelDeltaY' in e) {
                        wheelDeltaY = e.wheelDeltaY;
                    } else if ('wheelDelta' in e) {
                        wheelDeltaY = e.wheelDelta;
                    } else if ('detail' in e) {
                        wheelDeltaY = -e.detail;
                    } else {
                        return;
                    }
                    if (wheelDeltaY < 0) {
                        mngr.changePg(true);
                    } else {
                        mngr.changePg(false);
                    }
                };
                Hammer.on(ele, 'wheel mousewheel DOMMouseScroll', wheelHandler);
                return mngr;
            };
        var scrl = new IScroll(base.find('content'), {
            scrollbars: true,
            mouseWheel: true,
            probeType: 3,
            speedRatioY: 0.3,
        });
        base.ontap(function(ev) {
            var target = ev.target;

            switch (target.getAttribute('name')) {
                case 'close':
                    var tst=base.id('imageView');
                    base.log.animOut(tst, tst, 'out-bottom', 120, function() {
                        tst.parentNode.removeChild(tst);
                    });
                    break;
                case 'download':
                    window.location.href = "陈峥_简历.pdf";
                    break;
                case 'index':
                    window.location.href = "index.html";
                    break;
                case 'project':
                    window.location.href = "porfolio.html";
                    break;
                case 'set':
                    var tags = [],
                        name = base.find('img', target).getAttribute('name'),
                        title = imgSet[name],
                        total = title.length;
                    for (var i = 1; i <= total; i++) {
                        tags.push('./images/' + name + '_' + i + '.jpg');
                    }
                    var str = "<div id='imageView' class='in-top'>" +
                        "<div id='selectImg' select='false'><div id='imgContainer'></div></div>" +
                        "<button name='close'><i class='fa fa-close'></i></button>" +
                        "</div>";
                    document.body.appendChild(base.toHTML(str));
                    var img,
                        height = base.id('selectImg').clientHeight,
                        width = base.id('selectImg').clientWidth,
                        screenRatio = height / width;
                    for (var i = 0; i <= tags.length - 1; i++) {
                        var parent = base.toHTML("<data style='height:" + height + "px' name='" + title[i] + "' id='image_" + i + "'>" +
                            "<img src=" + tags[i] + " draggable='false'>" + "</data>");
                        base.id('imgContainer').appendChild(parent);
                        img = base.id('image_' + i).getElementsByTagName('img')[0];
                        img.onload = function() {
                            var ratio = this.height / this.width;
                            if (ratio >= screenRatio) {
                                this.style.height = height - 56 + 'px';
                                this.style.width = 'auto';
                            } else {
                                this.style.width = '96%';
                                this.style.height = 'auto';
                            }
                        };
                    }
                    base.find('data', 'imgContainer').setAttribute('cur', 'cur');
                    var slider = sliderInit(base.id('selectImg'));
                    break;
                default:
                    return;
            }
        });
    });
});
