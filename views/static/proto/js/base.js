define(['Hammer'], function(Hammer) {
    var base = {
        dlgFrom: {},
        ontap: function(fn, ele) {
            ele = ele || document.body;
            var hm = new Hammer.Manager(ele, {
                recognizers: [
                    [Hammer.Tap]
                ]
            });
            hm.on('tap', function(ev) {
                var target = ev.target;
                var tag = target.tagName;
                if (tag == 'I') target = target.parentNode;
                if (tag == 'IMG') target = target.parentNode.parentNode;
                tag = target.tagName;
                switch (tag) {
                    case 'EM':
                    case 'PRE':
                    case 'LABEL':
                    case 'DT':
                    case 'DD':
                        target = target.parentNode;
                        break;
                }
                ev.target = target;
                fn.call(target, ev);
            });
        },
        // 通知
        toast: function(str) {
            var tst = document.createElement('toast');
            tst.innerHTML = str;
            tst.id = this.randId(4);;
            document.body.appendChild(tst);
            setTimeout(function() {
                base.log.animOut(tst, tst, 'out-opacity', 200, function(){
                    tst.parentNode.removeChild(tst);
                });
            }, 1500);
        },
        id: function(arg) {
            if (typeof(arg) === "string") {
                arg = document.getElementById(arg);
            }
            return arg;
        },
        find: function(str, ele) {
            if (typeof(ele) === "string") {
                ele = document.getElementById(ele);
            }
            var el = ele || document;
            return el.querySelector(str);
        },
        findAll: function(str, ele) {
            if (typeof(ele) === "string") {
                ele = document.getElementById(ele);
            }
            var el = ele || document;
            return el.querySelectorAll(str);
        },
        dataInit: function(input) {
            var data = document.getElementById(input);
            data = data ? JSON.parse(data.value) : {};
            this.clean(input);
            return data;
        },
        compose: function(model, viewId) {
            var view;
            if (this.id(viewId)) {
                view = this.id(viewId).value;
            } else {
                view = viewId;
            }
            var htmlStr = '';
            var isArray = function(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }
            if (isArray(model)) {
                for (var i = 0; i < model.length; i++) {
                    if (model[i]) {
                        htmlStr += view.temp(model[i]);
                    }
                }
            } else {
                htmlStr = view.temp(model);
            }
            return this.toHTML(htmlStr);
        },
        href: function(obj) {
            var href = (typeof(obj) == "string") ? obj : obj.getAttribute('href');
            var token = (userInit && userInit.token) ? ('&token=' + userInit.token) : '';
            var link = href.indexOf("?") == -1 ? '?' : '&';
            href += link + 'lang=' + sessionStorage.lang + token;
            window.location.href = href;
        },
        toHTML: function(text) {
            var i, a = document.createElement("div"),
                b = document.createDocumentFragment();
            a.innerHTML = text;
            while (i = a.firstChild) { b.appendChild(i); }
            return b;
        },
        clean: function(obj) {
            if (typeof(obj) === "string") { obj = this.id(obj); }
            if (obj && obj.parentNode) { obj.parentNode.removeChild(obj); }
        },
        chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        randId: function(n) {
            var res = "";
            for (var i = 0; i < n; i++) {
                var id = Math.ceil(Math.random() * 35);
                res += this.chars[id];
            }
            return res;
        },
        scroll: function(ele, tapFn) {
            var scrollHdl = new Hammer.Manager(ele, {
                    recognizers: [
                        [Hammer.Tap]
                    ]
                }),
                top = 0,
                moveY = 0,
                wheelDeltaY = 0,
                maxScrollH = ele.scrollHeight - ele.clientHeight;
            if (tapFn) scrollHdl.on('tap', tapFn);
            if (sessionStorage.isMobile == 'false') {
                scrollHdl.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
                scrollHdl.on("panstart panmove panend", onPan);
                var indi = createDefaultScrollbar('v', null, true);
                Hammer.on(ele, 'wheel mousewheel DOMMouseScroll', onScroll);
            } else {
                ele.style.overflow = 'auto';
            }

            function onPan(ev) {
                var canRan = true;
                switch (ev.type) {
                    case "panstart":
                        top = ele.scrollTop;
                        break;
                    case "panmove":
                        ele.scrollTop = top - ev.deltaY;
                        indi.style.top = ele.scrollTop / ele.scrollHeight * 100 + '%';
                        break;
                    case "panend":
                        canRan = true;
                        var distance = -ev.velocityY * 320,
                            delta;
                        var init = ele.scrollTop;
                        top = init + distance;
                        if (top > maxScrollH) distance = maxScrollH - init;
                        if (top < 0) distance = -init;
                        var start = 0,
                            during = 20;
                        var _run = function() {
                            start++;
                            delta = easeOut(start, init, distance, during);
                            ele.scrollTop = delta;
                            indi.style.top = delta / ele.scrollHeight * 100 + '%';
                        };
                        if (start < during && canRan) requestAnimationFrame(_run);
                        break;
                }
            }

            var scrolling = false;

            function onScroll(e) {
                if ('deltaY' in e) {
                    if (e.deltaMode === 1) {
                        wheelDeltaY = -e.deltaY * 20;
                    } else {
                        wheelDeltaY = -e.deltaY;
                    }
                } else if ('wheelDeltaY' in e) {
                    wheelDeltaY = e.wheelDeltaY / 120 * 20;
                } else if ('wheelDelta' in e) {
                    wheelDeltaY = e.wheelDelta / 120 * 20;
                } else if ('detail' in e) {
                    wheelDeltaY = -e.detail / 3 * 20;
                } else {
                    return;
                }
                ele.scrollTop -= wheelDeltaY;
                indi.parentNode.style.top = ele.scrollTop + 'px';
                indi.style.top = ele.scrollTop / ele.scrollHeight * 100 + '%';
            }

            function createDefaultScrollbar() {
                var scrollbar = document.createElement('div'),
                    indicator = document.createElement('div');
                scrollbar.style.cssText = 'position:absolute;z-index:9999';
                indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px;transition:opacity 0.8s ease';

                scrollbar.style.cssText += ';width:7px;height:100%;top:2px;right:1px';
                indicator.style.width = '100%';
                scrollbar.style.cssText += ';overflow:hidden';
                scrollbar.appendChild(indicator);
                indicator.style.height = ele.clientHeight / ele.scrollHeight * 100 + '%';
                ele.appendChild(scrollbar);
                return indicator;
            }

            function easeOut(t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            }
            return scrollHdl;
        },
        log: {
            heap: [document.getElementsByTagName('main')[0]],
            in : function(ele) {
                ele = (typeof(ele) == "string") ? document.getElementById(ele) : ele;
                var heap = this.heap;
                ele.style.display = 'block';
                heap.push(ele);
                var last = heap[heap.length - 2];
                if (this.onIn) this.onIn(ele, last);
            },
            pop: function() {
                var heap = this.heap;
                var outer = heap[heap.length - 1];
                var last = heap[heap.length - 2];
                var animObj = outer.children[0];
                if (outer.tagName == 'MODAL') animObj = outer;
                var clean = (animObj.getAttribute('clean') == 'true') ? true : false;
                var self = this;
                this.animOut(outer, animObj, animObj.getAttribute('out'), 120, function() {
                    heap.remove((heap.length - 1));
                    if (clean) outer.parentNode.removeChild(outer);
                    else outer.style.display = 'none';
                    if (self.onPop) self.onPop(outer, last);
                });
            },
            animOut: function(outer, animObj, anim, time, callback) {
                var clickable = true;
                if (clickable) {
                    clickable = false;
                    animObj.classList.add(anim);
                    setTimeout(function() {
                        animObj.classList.remove(anim);
                        if (callback) callback.call(outer);
                        clickable = true;
                    }, time);
                }
            },
        },
    };

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    String.prototype.temp = function(obj) { //填充数据
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    Array.prototype.remove = function(dx) { //数组删除元素
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i];
            }
        }
        this.length -= 1;
    };

    HTMLElement.prototype.addEvent = function(type, fn, capture) {
        if (window.addEventListener) {
            this.addEventListener(type, fn, capture);
        } else if (window.attachEvent) {
            this.attachEvent("on" + type, function(e) {
                fn.call(this, e);
            });
        }
    };

    sessionStorage.isMobile = (function() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        var bIsWC = sUserAgent.match(/MicroMessenger/i) == "micromessenger";
        var isMobile = false;
        isMobile = (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsWC);
        return isMobile;
    })();
    return base;
});
