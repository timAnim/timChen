(function(window) {
    var animEle = function(ele, anim, time) {
        var clName = ele.className;
        ele.className += ' ' + anim;
        setTimeout(function() {
            ele.className = clName;
        }, time);
    };
    var _dtDlgStr =
        "<mask evnt='mask' id='$id$' out='opacity'>" +
        "<dialog id='_dtPicker' state='hour' clean='$clean$'>" +
        "<div class='_dtIndicator'>" +
        "<a class='_indiH' evnt='indiH'>20</a>" +
        "<span>:</span>" +
        "<a class='_indiM' evnt='indiM'>20</a>" +
        "</div>" +
        "<div class='_dtPlate'>" +
        "<div class='_dtClock'>" +
        "<div class='_hHand'></div>" +
        "<div class='_mHand'></div>" +
        "<div class='_numContainer'></div>" +
        "</div>" +
        "</div>" +
        "<li class='_dtBtns'>" +
        "<button class='_dtNeg' type='neg' evnt='neg'>取消</button>" +
        "<button class='_dtPos' type='pos' evnt='pos'>确认</button>" +
        "</li>" +
        "</dialog>  " +
        "</mask>";
    var timePicker = function(init) {
        this.id = Predev.randId(4);
        this.clean = init.clean;
        // 初始值
        var _init = init.value;
        var now = new Date();
        this.slctT = (_init) ? _init.split(':') : [now.getHours(), now.getMinutes()];
        document.body.appendChild(Predev.compose(this, _dtDlgStr));
        this.outer = Predev.id(this.id);
        this.outer.style.display = 'none';
        this.state = 'hour';
        this.hhand = Predev.find('._hHand');
        this.mhand = Predev.find('._mHand');
        this.indiH = Predev.find('._indiH');
        this.indiM = Predev.find('._indiM');

        var self = this;
        Predev.ontap(function(ev) {
            self.evHandler.call(self, ev);
        }, self.outer);
        this.hourInit();
        this.setTime();
    };
    timePicker.prototype.show = function() {
        Predev.log.in(this.outer);
    };
    timePicker.prototype.out = function() {
        Predev.log.pop();
    }
    timePicker.prototype.evHandler = function(ev) {
        var target = ev.target;
        var name = target.getAttribute('evnt');
        var picker = Predev.find('dialog', this.outer);
        var self = this;
        if (!name) return;
        switch (name) {
            case 'pos':
                this.slctT[0] = parseInt(this.slctT[0], 10);
                this.slctT[1] = parseInt(this.slctT[1], 10);
                if (this.slctT[0] < 10) this.slctT[0] = '0' + this.slctT[0];
                if (this.slctT[1] < 10) this.slctT[1] = '0' + this.slctT[1];
                this.result = this.slctT[0] + ':' + this.slctT[1];
                this.out();
                break;
            case 'neg':
            case 'mask':
                this.out();
                break;
            case 'indiH':
                animEle(this.indiH, '_popAnim', 200);
                picker.setAttribute('state', 'hour');
                setTimeout(function() {
                    self.hourInit();
                    self.setTime();
                }, 600);
                break;
            case 'indiM':
                animEle(this.indiM, '_popAnim', 200);
                picker.setAttribute('state', 'minute');
                setTimeout(function() {
                    self.minuteInit();
                    self.setTime();
                }, 600);
                break;
            case 'time':
                if (this.state == 'hour') {
                    this.slctT[0] = parseInt(target.innerHTML, 10);
                } else {
                    target.setAttribute('selected', 'selected');
                    this.slctT[1] = parseInt(target.innerHTML, 10);
                }
                this.setTime();
                break;
        }

    };
    timePicker.prototype.setTime = function() {
        var hour = this.slctT[0];
        var min = this.slctT[1];
        this.indiH.innerHTML = (hour < 10) ? ('0' + hour) : hour;
        this.indiM.innerHTML = (min < 10) ? ('0' + min) : min;

        if (hour < 13 && hour != 0) {
            this.hhand.style.transform = 'rotate(' + hour * 30 + 'deg)';
            this.hhand.style.height = '104px';
        } else {
            this.hhand.style.transform = 'rotate(' + ((hour - 12) * 30 + 10) + 'deg)';
            this.hhand.style.height = '64px';
        }
        this.mhand.style.transform = 'rotate(' + min / 5 * 30 + 'deg)';

        var a = this.outer.getElementsByTagName('a'),
            s = this.state,
            v,
            i;
        for (i = a.length - 1; i >= 0; i--) {
            a[i].removeAttribute('selected');
            v = parseInt(a[i].innerHTML, 10);
            if ((s == 'hour' && v == hour) || (s == 'minute' && v == min)) {
                a[i].setAttribute('selected', 'selected');
            }
        }
    };
    timePicker.prototype.hourInit = function() {
        var numCon = Predev.find('._numContainer');
        this.state = 'hour';
        if (typeof(this.hourPlate) == 'undefined') {
            var newCon = document.createElement('div');
            newCon.className = '_numContainer';
            var r = 115.2;
            var x, y, i, j;
            for (i = 1; i <= 12; i++) {
                var hour = document.createElement('a');
                hour.setAttribute('evnt', 'time');
                hour.innerHTML = i;
                if (i == 0) {
                    x = 0;
                    y = 1;
                } else {
                    x = Math.sin(Math.PI / 6 * i);
                    y = Math.cos(Math.PI / 6 * i);
                }
                newCon.appendChild(hour);
                hour.style.left = x * r + r * 1.25 + 'px';
                hour.style.top = r * 1.25 - y * r + 'px';
            }
            r = r * 0.65;
            for (j = 13; j <= 24; j++) {
                var hour = document.createElement('a');
                hour.setAttribute('evnt', 'time');
                hour.innerHTML = j;
                if (j == 24) { hour.innerHTML = '00' };
                m = j - 12;
                m = m + 0.35;
                x = Math.sin(Math.PI / 6 * m);
                y = Math.cos(Math.PI / 6 * m);
                newCon.appendChild(hour);
                hour.style.left = x * r + r * 1.9237 + 'px';
                hour.style.top = r * 1.9237 - y * r + 'px';
                this.hourPlate = newCon;
            }
        }
        numCon.parentNode.replaceChild(this.hourPlate, numCon);
    };
    timePicker.prototype.minuteInit = function() {
        var numCon = Predev.find('._numContainer');
        this.state = 'minute';
        if (typeof(this.minPlate) == 'undefined') {
            var newCon = document.createElement('div');
            newCon.className = '_numContainer';

            var r = 115.2;
            var x, y, i, j;
            for (i = 11; i >= 0; i--) {
                var min = document.createElement('a');
                min.setAttribute('evnt', 'time');
                if (i * 5 < 10) {
                    min.innerHTML = '0' + i * 5;
                } else {
                    min.innerHTML = i * 5;
                }
                x = Math.sin(Math.PI / 6 * i);
                y = Math.cos(Math.PI / 6 * i);
                newCon.appendChild(min);
                min.style.left = x * r + r * 1.25 + 'px';
                min.style.top = r * 1.25 - y * r + 'px';
            }
            r = r * 0.875;
            for (i = 59; i >= 0; i--) {
                var min = document.createElement('a');
                min.setAttribute('evnt', 'time');
                if (i % 5 !== 0) {
                    min.innerHTML = i;
                    min.className = '_indiDot';
                    x = Math.sin(Math.PI / 30 * i);
                    y = Math.cos(Math.PI / 30 * i);
                    newCon.appendChild(min);
                    min.style.left = x * r + r * 1.429 + 'px';
                    min.style.top = r * 1.429 - y * r + 'px';
                }
            }
            this.minPlate = newCon;
        }
        numCon.parentNode.replaceChild(this.minPlate, numCon);
    }
    if (typeof module != 'undefined' && module.exports) {
        module.exports = timePicker;
    } else if (typeof define == 'function' && define.amd) {
        define(function() {
            return timePicker;
        });
    } else {
        window.TimePicker = timePicker;
    }
})(window);


(function(window) {

    /*
        日期选择器
    */
    var templates = {
        date: "<mask id='$id$' evnt='mask'>" +
            "<dialog id='_dtPicker' out='out-top' clean='$clean$'>" +
            "<div class='_dtIndicator'>" +
            "<div class='_indiYear'>2015</div>" +
            "<div>" +
            "<span class='_indiMonth'>06</span><span>月</span>" +
            "</div>" +
            "<div class='_indiCtrl'>" +
            "<a class='_addYear' evnt='addYear'>&gt;</a>" +
            "<a class='_minYear' evnt='minYear'>&lt;</a>" +
            "<a class='_addMonth'evnt='addMonth'>&gt;</a>" +
            "<a class='_minMonth' evnt='minMonth'>&lt;</a>" +
            "</div>" +
            "</div>" +
            "<ol class='_dtTitle'>" +
            "<pre>日</pre>" +
            "<pre>一</pre>" +
            "<pre>二</pre>" +
            "<pre>三</pre>" +
            "<pre>四</pre>" +
            "<pre>五</pre>" +
            "<pre>六</pre>" +
            "</ol>" +
            "<div class='_dtPlate'></div>" +
            "<li>" +
            "<button type='neg' evnt='neg'>取消</button>" +
            "<button type='pos' evnt='pos'>确认</button>" +
            "</li>" +
            "</dialog>" +
            "</mask>",
        dateSlct: "<section id='$id$' class='_dtPicker' out='out-top' clean='$clean$'>" +
            "<div class='_dtIndicator'>" +
            "<div class='_indiYear'>2015</div>" +
            "<div>" +
            "<span class='_indiMonth'>06</span><span>月</span>" +
            "</div>" +
            "<div class='_indiCtrl'>" +
            "<a class='_addYear' evnt='addYear'>&gt;</a>" +
            "<a class='_minYear' evnt='minYear'>&lt;</a>" +
            "<a class='_addMonth'evnt='addMonth'>&gt;</a>" +
            "<a class='_minMonth' evnt='minMonth'>&lt;</a>" +
            "</div>" +
            "</div>" +
            "<ol class='_dtTitle'>" +
            "<pre>日</pre>" +
            "<pre>一</pre>" +
            "<pre>二</pre>" +
            "<pre>三</pre>" +
            "<pre>四</pre>" +
            "<pre>五</pre>" +
            "<pre>六</pre>" +
            "</ol>" +
            "<div class='_dtPlate'></div>" +
            "</section>",
        dateFull: "<section id='$id$' class='_dtPicker' out='out-top' clean='$clean$'>" +
            "<div class='_dtIndicator'>" +
            "<div class='_indiYear'>2015</div>" +
            "<div>" +
            "<span class='_indiMonth'>06</span><span>月</span>" +
            "</div>" +
            "<div class='_indiCtrl'>" +
            "<a class='_addYear' evnt='addYear'>&gt;</a>" +
            "<a class='_minYear' evnt='minYear'>&lt;</a>" +
            "<a class='_addMonth'evnt='addMonth'>&gt;</a>" +
            "<a class='_minMonth' evnt='minMonth'>&lt;</a>" +
            "</div>" +
            "</div>" +
            "<ol class='_dtTitle'>" +
            "<pre>日</pre>" +
            "<pre>一</pre>" +
            "<pre>二</pre>" +
            "<pre>三</pre>" +
            "<pre>四</pre>" +
            "<pre>五</pre>" +
            "<pre>六</pre>" +
            "</ol>" +
            "<div class='_dtPlate'></div>" +
            "</section>",
    };

    var getTemplates = function(type) {
        var dialog = '',
            item = '';
        switch (type) {
            case 'date':
                dialog = templates.date;
                break;
            case 'dateSlct':
                dialog = templates.dateSlct;
                break;
            case 'dateFull':
                dialog = templates.dateSlct;
                break;
        }
        return { dialog: dialog, item: item };
    };
    var DatePicker = function(init) {
        this.id = pd.randId(4);
        Hammer.assign(this, init);

        if (this.maxDate) { this.maxDate = new Date(init.maxDate); }
        if (this.minDate) { this.minDate = new Date(init.minDate); }
        var tmp = getTemplates(this.type).dialog;
        document.body.appendChild(pd.compose(this, tmp));

        this.dlg = pd.id(this.id);
        this.dlg.style.display = 'none';
        this.nowArr = dateToArr(new Date());
        this.slctArr = (this.ele.value) ? dateToArr(new Date(this.ele.value)) : this.nowArr;
        var self = this;
        pd.ontap(function(name) {
            self.evHandler.call(self, name);
        }, self.dlg);
        this.layDate(this.slctArr);
    };
    DatePicker.prototype.show = function(ele) {
        this.dlg.style.display = 'block';
        ele.insertBefore(this.dlg, ele.children[0]);
    }
    DatePicker.prototype.out = function(res) {
        this.dlg.style.display = 'none';
        if (this.onOut) this.onOut(res);
    };
    DatePicker.prototype.evHandler = function(name) {
        var ctrlDr, slctArr = this.slctArr;
        switch (name) {
            case 'pos':
                var res = slctArr[0] + '-' + (slctArr[1] + 1) + '-' + slctArr[2];
                this.out(res);
                break;
            case 'neg':
            case 'mask':
                this.out(null);
                break;
            case 'addYear':
                slctArr[0]++;
                ctrlDr = "isAdd";
                this.layDate(slctArr);
                break;
            case 'minYear':
                slctArr[0]--;
                ctrlDr = "isMin";
                this.layDate(slctArr);
            case 'addMonth':
                this.addMonth();
                break;
            case 'minMonth':
                this.minMonth();
                break;
            case 'day':
                if (target.getAttribute('disabled') == 'disabled') return;
                slctArr[2] = parseInt(target.innerHTML, 10);
                var dateArr = this.dlg.getElementsByTagName('a');
                for (var i = dateArr.length - 1; i >= 0; i--) {
                    dateArr[i].removeAttribute('select');
                }
                target.setAttribute('select', 'select');
                var res = [slctArr[0], (slctArr[1] + 1), slctArr[2]];
                if (this.onOut) this.onOut(res);
                break;
        }
    };
    DatePicker.prototype.addMonth = function() {
        var slctArr = this.slctArr;
        slctArr[1]++;
        if (slctArr[1] > 11) {
            slctArr[1] = 0;
            slctArr[0]++;
        }
        if (this.onChange) this.onChange(slctArr);
        this.layDate(slctArr);
    };
    DatePicker.prototype.minMonth = function() {
        var slctArr = this.slctArr;
        slctArr[1]--;
        if (slctArr[1] < 0) {
            slctArr[1] = 11;
            slctArr[0]--;
        }
        if (this.onChange) this.onChange(slctArr);
        this.layDate(slctArr);
    };
    DatePicker.prototype.layDate = function(date) {
        var min = this.minDate,
            max = this.maxDate,
            now = this.nowArr,
            slct = this.slctArr,
            plate = pd.find('._dtPlate', this.id);
        plate.innerHTML = '';
        this.checkDate(date);
        //加日期
        var str,
            i = 1,
            a1,
            a2 = (date[1] + 1 < 10) ? ('0' + (date[1] + 1)) : (date[1] + 1),
            a3,
            isToday = (date[0] == now[0] && date[1] == now[1]),
            isSlct = (date[0] == slct[0] && date[1] == slct[1]);
        for (; i < 32; i++) {
            // 设置范围
            a3 = (i < 10) ? ('0' + i) : i;
            str = parseISO8601(date[0] + '-' + a2 + '-' + a3);
            if (str.getDate() != i) break; // 判断有效

            var tag = document.createElement('a');
            tag.innerHTML = i;
            tag.setAttribute('evnt', 'day');
            tag.setAttribute('alt', i);
            if ((min && str < min) || (max && str > max)) tag.setAttribute('disabled', 'disabled');
            if (isToday && now[2] == i) tag.setAttribute('today', 'today');
            if (isSlct && i == slct[2]) tag.setAttribute('select', 'select');
            if (i == 1) tag.style.marginLeft = str.getDay() * 14.28 + '%';
            plate.appendChild(tag);
        }
        pd.find('._indiYear').innerHTML = slct[0];
        pd.find('._indiMonth').innerHTML = slct[1] + 1;
    }
    DatePicker.prototype.checkDate = function(date) {
        var min = this.minDate,
            max = this.maxDate,
            dlg = pd.find('._dtPicker'),
            ctrlDr = 'static';

        var layDt = new Date(date[0] + '-' + (date[1] + 1) + '-' + date[2]);
        // 最小天数
        if (!min) {
            dlg.setAttribute('ctrl', 'y_on_m_on');
        } else if (layDt < min) {
            date = dateToArr(min);
            dlg.setAttribute('ctrl', 'y_off_m_off');
            if (ctrlDr == 'isMin') dtPicker.animEle(dlg, '_denyAnim', 200);
        } else if (date[0] == min.getFullYear() && date[1] >= (min.getMonth() - 1)) {
            dlg.setAttribute('ctrl', 'y_off_m_on');
        }

        // 最大日期判断
        if (!max) {
            dlg.setAttribute('ctrl', 'y_yes_m_yes');
        } else if (layDt > max) {
            date = dateToArr(max);
            dlg.setAttribute('ctrl', 'y_no_m_no');
            if (ctrlDr == 'isAdd') dtPicker.animEle(dlg, '_denyAnim', 200);
        } else if (date[0] == max.getFullYear() && date[1] <= max.getMonth()) {
            dlg.setAttribute('ctrl', 'y_no_m_yes');
        }
    }

    function dateToArr(day) {
        return [day.getFullYear(), day.getMonth(), day.getDate()];
    }

    function parseISO8601(dateStringInRange) {
        var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
            date = new Date(NaN),
            month, parts = isoExp.exec(dateStringInRange);
        if (parts) {
            month = +parts[2];
            date.setFullYear(parts[1], month - 1, parts[3]);
            if (month != date.getMonth() + 1) {
                date.setTime(NaN);
            }
        }
        return date;
    }
    if (typeof module != 'undefined' && module.exports) {
        module.exports = DatePicker;
    } else if (typeof define == 'function' && define.amd) {
        define(function() {
            return DatePicker;
        });
    } else {
        window.DatePicker = DatePicker;
    }
})(window);
