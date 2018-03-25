(function(window) {
    var Counter = {
        init: function(data) {
            this.track = [];
            this.timestamp = Date.parse(new Date());
            this.enable = true;
            this.url = window.location.pathname.split('/').pop().split('.')[0] || 'index';
            this.canvas = initCanvas(data);
            initSwitch();
            monitor_init();
        },
        start: function(ev) {
            this.origin = [ev.x, ev.y];
            this.seed = setInterval(addMove, 200);
            Hammer.on(document.body, 'mousemove', relocate);
            pd.ontap(addTap);
            var can = Counter.canvas;

            function relocate(e) {
                Counter.x = e.x;
                if (e.y > can.headerH && e.y < (can.footerH + can.contentH)) {
                    e.y -= can.scroller.y;
                };
                Counter.y = e.y;
            }

            function addTap(e) {
                if (!Counter.enable) return;
                if (e.center.y > can.headerH && e.center.y < (can.footerH + can.contentH)) {
                    e.center.y -= can.scroller.y;
                };
                if (e.target.getAttribute('evnt') == 'Counter-switch') return;

                var arr = JSON.parse(localStorage.getItem(Counter.url + '_tap')) || [],
                    time = Date.parse(new Date()) - Counter.timestamp;
                var mark = e.target.getAttribute('monitor');
                if (mark) mark = mark.split('-');
                else mark = [null, null];
                arr.push({
                    case: Counter.timestamp,
                    time: time,
                    x: e.center.x,
                    y: e.center.y,
                    task: mark[0],
                    step: mark[1],
                });

                localStorage[Counter.url + '_tap'] = JSON.stringify(arr);
            }

            function addMove() {
                if (!Counter.enable || !Counter.x || !Counter.y) return;

                var time = Date.parse(new Date()) - Counter.timestamp;
                Counter.track.push({
                    case: Counter.timestamp,
                    time: time,
                    x: Counter.x,
                    y: Counter.y,
                });
            }
        },
        save: function() {
            var arr = JSON.parse(localStorage.getItem(Counter.url + '_move')) || [];
            Counter.track.splice(0, 5);
            Counter.track.splice(Counter.track.length - 6, 5);
            arr = arr.concat(Counter.track);
            localStorage[Counter.url + '_move'] = JSON.stringify(arr);
        },
        infraredChart: function(option) {
            Hammer.merge(option, {
                threhold: 0.5,
                decay: 48,
                opacity: 0.8,
                type: 'tap'
            });

            var track = JSON.parse(localStorage[this.url + '_' + option.type]);
            var can = Counter.canvas;
            can.scroller.scrollTo(0, 0);
            document.body.appendChild(can.ele);
            this.renderCanvas(function() {
                var arr = [],
                    max = 0,
                    a, b, m, i, weight,
                    decay = option.decay;
                can.ctx.globalAlpha = option.opacity;
                for (var y = 0; y <= can.height - 1; y++) {
                    for (var x = 0; x <= can.width - 1; x++) {
                        arr.push([x, y, 0]);
                    }
                }

                for (i = 0; i <= track.length - 1; i++) {
                    a = track[i].x;
                    b = track[i].y;
                    setWeight([a, b], decay);
                }

                for (m = 0; m <= arr.length - 1; m++) {
                    weight = arr[m][2] / (max * option.threhold);
                    if (weight < 0.25) {
                        can.ctx.fillStyle = 'rgba(0,' + Math.floor(255 * 2 * weight) + ',' + Math.floor(255 * (1 - weight * 2)) + ',' + weight * 4 + ')';
                    } else if (weight < 0.5) {
                        can.ctx.fillStyle = 'rgba(0,' + Math.floor(255 * 2 * weight) + ',' + Math.floor(255 * (1 - weight * 2)) + ',1)';
                    } else {
                        can.ctx.fillStyle = 'rgba(' + Math.floor(255 * (weight * 2 - 1)) + ',' + Math.floor(255 * (1 - weight) * 2) + ',0,1)';
                    }
                    can.ctx.fillRect(arr[m][0], arr[m][1], 1, 1);
                }

                function setWeight(center, decay) {
                    var dis, m;
                    for (m = 0; m <= arr.length - 1; m++) {
                        if (Math.abs(center[0] - arr[m][0]) > decay) continue;
                        if (Math.abs(center[1] - arr[m][1]) > decay) continue;
                        dis = abs(center, arr[m]);
                        if (dis > decay || isNaN(dis)) continue;
                        dis = decay - dis;
                        arr[m][2] += dis;
                        max = (arr[m][2] > max) ? arr[m][2] : max;
                    }
                }
            });
        },
        renderCanvas: function(callback) {
            var can = Counter.canvas;
            if (can.header) {
                domtoimage.toJpeg(can.header, {
                    quality: 0.95,
                    bgcolor: '#eeeeee',
                    height: can.headerH,
                    width: can.width,
                }).then(function(dataUrl) {
                    var img = new Image();
                    img.onload = function() {
                        can.ctx.drawImage(img, 0, 0);
                    };
                    img.src = dataUrl;
                });
            }

            domtoimage.toJpeg(can.content, {
                quality: 0.95,
                bgcolor: '#eeeeee',
                height: can.contentH,
                width: can.width,
            }).then(function(dataUrl) {
                var img = new Image();
                img.onload = function() {
                    can.ctx.drawImage(img, 0, can.headerH);
                    callback();
                };
                img.src = dataUrl;
            });

            if (can.footer) {
                domtoimage.toJpeg(can.footer, {
                    quality: 0.95,
                    bgcolor: '#eeeeee',
                    height: can.footerH,
                    width: can.width,
                }).then(function(dataUrl) {
                    var img = new Image();
                    img.onload = function() {
                        can.ctx.drawImage(img, 0, can.headerH + can.contentH);
                    };
                    img.src = dataUrl;
                });
            }
        },
        stop: function() {
            clearInterval(Counter.seed);
            Counter.save();
            Counter.infraredChart({
                type: 'tap'
            });
        },
    };

    function initSwitch() {
        var btnTxt = "<button id='Counter-switch' evnt='Counter-switch'>" +
            "<i class='fa fa-video-camera'></i>" +
            "<i class='fa fa-stop-circle-o'></i>" +
            "</button>";
        document.body.appendChild(pd.toHTML(btnTxt));
        Hammer.on(pd.id('Counter-switch'), 'click', function(ev) {
            var target = (ev.target.tagName == 'I') ? ev.target.parentNode : ev.target;
            var state = (target.getAttribute('state') == 'start') ? 'stop' : 'start';
            if (state == 'start') Counter.start(ev);
            else Counter.stop();
            target.setAttribute('state', state);
        });
    }

    function abs(start, end) {
        var _res = Math.pow(Math.pow((start[0] - end[0]), 2) + Math.pow((start[1] - end[1]), 2), 0.5);
        return Math.floor(_res);
    }


    function initCanvas(data) {
        var canvas = document.createElement('canvas'),
            contex = canvas.getContext('2d');
        canvas.id = 'static-canvas';
        Hammer.assign(data, {
            headerH: (data.header) ? data.header.clientHeight : 0,
            footerH: (data.footer) ? data.footer.clientHeight : 0,
            contentH: data.scroller.scroller.clientHeight,
            width: document.body.clientWidth,
            ele: canvas,
            ctx: contex
        });
        data.height = data.contentH + data.headerH + data.footerH;
        data.ele.height = data.height;
        data.ele.width = data.width;
        return data;
    }

    function monitor_init() {
        var monitors = pd.findAll('*[monitor]'),
            taskObj = {},
            mark;
        for (var i = monitors.length - 1; i >= 0; i--) {
            mark = monitors[i].getAttribute('monitor').split('-');
            task = parseInt(mark[0]);
            step = parseInt(mark[1]);
            if (!taskObj[mark[0]]) taskObj[mark[0]] = {};
            taskObj[mark[0]][mark[1]] = mark[1];
        }
        for (var item in taskObj) {
            taskObj[item] = Object.keys(taskObj[item]).length;
        }
        localStorage[Counter.url + '_monitor'] = JSON.stringify(taskObj);
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = Counter;
    } else if (typeof define == 'function' && define.amd) {
        define(function() {
            return Counter;
        });
    } else {
        window.Counter = Counter;
    }
})(window);
