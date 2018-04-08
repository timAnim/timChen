define(['base'], function(base) {
    document.body.addEvent('keydown', function backKey(e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 27 && base.log.heap.length > 0) base.log.pop();
        return false;
    });
    var templates = {
        dialog: "<dialog id='$id$' out='out-top' clean='$clean$'>" +
            "<ul>" +
            "<header><label><i class='fa fa-user'></i></label>" +
            "<h1>$title$</h1></header>" +
            "<content></content>" +
            "</ul>" +
            "<ul>" +
            "<li>" +
            "<button type='pos' name='submit'>OK</button>" +
            "</li>" +
            "</ul>" +
            "</dialog>",
        checkItem: "<li class='blink-theme' name='check' id='$id$'>" +
            "<em>$value$</em>" +
            "<pre>$secondary$</pre>" +
            "<label type='switch' checked='false'>" +
            "<i class='fa fa-square-o'></i>" +
            "<i class='fa fa-check-square'></i>" +
            "</label>" +
            "</li>",
        radioItem: "<li class='blink-theme' name='radio' id='$id$'>" +
            "<em>$value$</em>" +
            "<pre>$secondary$</pre>" +
            "<label type='switch' checked='$checked$'>" +
            "<i class='fa fa-circle-o'></i>" +
            "<i class='fa fa-dot-circle-o'></i>" +
            "</label>" +
            "</li>",
        inputItem: "<li>" +
            "<input autocomplete='off' value='$value$' type='$type$' placeholder='$placeholder$'>" +
            "<button name='clear'><i class='fa fa-times-circle'></i></button>" +
            "</li>",
        menu: "<dialog id='$id$' out='out-top' clean='$clean$'>" +
            "<ul>" +
            "<header>" +
            "<label><i class='fa fa-user'></i></label>" +
            "<h1>$title$</h1>" +
            "</header>" +
            "<content></content>" +
            "</ul>" +
            "</dialog>",
        aside: "<aside id='$id$' out='out-left' clean='$clean$'>" +
            "<div>" +
            "<clip><img src='$img$'></clip>" +
            "</div>" +
            "<content></content>" +
            "</aside>",
        hrefItem: "<li>" +
            "<label><i class='$label$'></i></label>" +
            "<em>$value$</em><pre>$secondary$</pre>" +
            "<label><i class='fa fa-angle-right'></i></label>" +
            "</li>",
        login: "<dialog id='$id$' out='out-top'  clean='$clean$'>" +
            "<ul>" +
            "<header><label><i class='fa fa-user'></i></label><h1>$title$</h1></header>" +
            "<li>" +
            "<input id='username' placeholder='" + lan.t('Email') + "'/>" +
            "<button name='clear'><i class='fa fa-times-circle'></i></button>" +
            "</li>" +
            "<li>" +
            "<input id='password' placeholder='" + lan.t('Password') + "' type='password'/>" +
            "<button id='forgetPwd'>" + lan.t('Forgot') + "</button>" +
            "</li>" +
            "</ul>" +
            "<ul><button type='pos' id='loginBtn'>" + lan.t('Login') + "</button></ul>" +
            "<ul><button type='pos' id='signupBtn'>" + lan.t('Signup') + "</button></ul>" +
            "</dialog>",
        confirm: "<dialog class='confirm' id='$id$' out='out-top' clean='$clean$'>" +
            "<ul>" +
            "<h1>$title$</h1>" +
            "<li>" +
            "<button res='false' type='neg' name='confirm'>" + lan.t('Cancel') + "</button>" +
            "<button res='true' type='pos' name='confirm'>" + lan.t('Confirm') + "</button>" +
            "</li>" +
            "</ul>" +
            "</dialog>",
        modal: "<modal></modal>",
        date: "<mask id='$id$' name='mask'>" +
            "<dialog id='_dtPicker' out='out-top' clean='$clean$'>" +
            "<div class='_dtIndicator'>" +
            "<div class='_indiYear'>2015</div>" +
            "<div>" +
            "<span class='_indiMonth'>06</span><span>月</span>" +
            "</div>" +
            "<div class='_indiCtrl'>" +
            "<a class='_addYear' name='addYear'>&gt;</a>" +
            "<a class='_minYear' name='minYear'>&lt;</a>" +
            "<a class='_addMonth'name='addMonth'>&gt;</a>" +
            "<a class='_minMonth' name='minMonth'>&lt;</a>" +
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
            "<button type='neg' name='neg'>取消</button>" +
            "<button type='pos' name='pos'>确认</button>" +
            "</li>" +
            "</dialog>" +
            "</mask>",
    };

    var getTemplates = function(type) {
        var dialog = '',
            item = '';
        switch (type) {
            case 'radio':
                dialog = templates.dialog;
                item = templates.radioItem;
                break;
            case 'check':
                dialog = templates.dialog;
                item = templates.checkItem;
                break;
            case 'input':
                dialog = templates.dialog;
                item = templates.inputItem;
                break;
            case 'menu':
                dialog = templates.menu;
                item = templates.hrefItem;
                break;
            case 'aside':
                dialog = templates.aside;
                item = templates.hrefItem;
                break;
            case 'login':
                dialog = templates.login;
                break;
            case 'confirm':
                dialog = templates.confirm;
                break;
            case 'date':
                dialog = templates.date;
                break;
        }
        return { dialog: dialog, item: item };
    };
    var iDialog = function(init) {
        this.id = base.randId(4);
        this.title = init.title;
        this.type = init.type;
        this.data = init.data || [];
        this.onOut = init.onOut || function() {};
        var dlg = base.compose(init, getTemplates(this.type).dialog);
        var mask = document.createElement('mask');
        mask.id = this.id;
        mask.setAttribute('name', 'mask');
        mask.appendChild(dlg);
        document.body.appendChild(mask);
        mask.style.display = 'none';
        if (init.data) this.setData(init.data);
        var self = this;
        base.ontap(function(ev) {
            submit.call(self, ev);
        }, mask);
    };
    iDialog.prototype.setData = function(data) {
        this.data = data;
        var con = base.find('content', this.id);
        var list = base.compose(data, getTemplates(this.type).item);
        con.appendChild(list);
    };
    iDialog.prototype.show = function() {
        base.log.in(this.id);
    }
    var submit = function(ev) {
        var target = ev.target;
        var name = target.getAttribute('name'),
            res = null;
        if (!name) return;
        switch (name) {
            case 'check':
                var toggle = base.find('label', target);
                var flag = (toggle.getAttribute('checked') == 'true') ? false : true;
                toggle.setAttribute('checked', flag);
                break;
            case 'radio':
                var list = target.parentNode;
                list = base.findAll('label', list);
                for (var i = list.length - 1; i >= 0; i--) {
                    list[i].setAttribute('checked', false);
                }
                var toggle = base.find('label', target);
                var flag = (toggle.getAttribute('checked') == 'true') ? false : true;
                toggle.setAttribute('checked', flag);
                break;
            case 'clear':
                var input = base.find('input', target.parentNode);
                input.value = '';
                break;
            case 'submit':
                if (this.type == 'radio' || this.type == 'check') {
                    var list = base.findAll('label', this.id);
                    var txtArr = [],
                        idArr = [],
                        id, em;
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (list[i].getAttribute('checked') == 'true') {
                            id = list[i].parentNode.id;
                            em = base.find('em', list[i].parentNode).innerHTML;
                            idArr.push(id);
                            txtArr.push(em);
                        };
                    }
                    res = { idArr: idArr, txtArr: txtArr };
                } else if (this.type == 'input') {
                    var res = base.find('input', this.id).value;
                }
                this.onOut(res);
                base.log.pop();
                break;
            case 'confirm':
                res = (target.getAttribute('res') == 'true') ? true : false;
                this.onOut(res);
                base.log.pop();
                break;
            case 'mask':
                base.log.pop();
                break;
            default:
                return;
        }
    };
    /*
        name： 模态Modal
        style：全屏的覆盖
        template： 用户自定义
        value： 用户自定义
    */
    var Modal = function(init) {
        this.id = base.randId(4);
        this.data = init.data;
        this.template = init.template;
        this.tapHandler = init.tapHandler;
        var dom = base.compose(this.data, this.template);
        var mdl = document.createElement('modal');
        mdl.setAttribute('out', 'out-bottom');
        mdl.setAttribute('clean', init.clean);
        mdl.id = this.id;
        mdl.style.display = 'none';
        mdl.appendChild(dom);
        document.body.appendChild(mdl);
        base.ontap(this.tapHandler, mdl);
    };
    Modal.prototype.show = function() {
        base.id(this.id).style.display = 'block';
        base.log.in(this.id);
    };
    Modal.prototype.out = function() {
        base.log.pop();
    };


    /*
        日期选择器
    */

    var DatePicker = function(init) {
        this.id = base.randId(4);
        Hammer.assign(this, init);

        if (this.maxDate) { this.maxDate = new Date(init.maxDate); }
        if (this.minDate) { this.minDate = new Date(init.minDate); }
        var tmp = getTemplates('date').dialog;
        document.body.appendChild(base.compose(this, tmp));

        this.dlg = base.id(this.id);
        this.dlg.style.display = 'none';
        this.nowArr = dateToArr(new Date());
        this.slctArr = (this.ele.value) ? dateToArr(new Date(this.ele.value)) : this.nowArr;
        var self = this;
        base.ontap(function(ev) {
            self.evHandler.call(self, ev);
        }, self.dlg);
        this.layDate(this.slctArr);
    };
    DatePicker.prototype.show = function() {
        base.log.in(this.dlg);
    }
    DatePicker.prototype.out = function(res) {
        base.log.pop();
        if (this.onSubmit) this.onSubmit(res);
    };
    DatePicker.prototype.evHandler = function(ev) {
        var ctrlDr, slctArr = this.slctArr;
        var target = ev.target;
        var name = target.getAttribute('name');
        if (!name) return;
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
                slctArr[1]++;
                if (slctArr[1] > 11) {
                    slctArr[1] = 0;
                    slctArr[0]++;
                }
                ctrlDr = "isAdd";
                this.layDate(slctArr);
                break;
            case 'minMonth':
                slctArr[1]--;
                if (slctArr[1] < 0) {
                    slctArr[1] = 11;
                    slctArr[0]--;
                }
                ctrlDr = "isMin";
                this.layDate(slctArr);
                break;
            case 'day':
                if (target.getAttribute('disabled') == 'disabled') return;
                slctArr[2] = parseInt(target.innerHTML, 10);
                var dateArr = this.dlg.getElementsByTagName('a');
                for (var i = dateArr.length - 1; i >= 0; i--) {
                    dateArr[i].removeAttribute('select');
                }
                target.setAttribute('select', 'select');
                break;
        }
    };
    DatePicker.prototype.layDate = function(date) {
        var min = this.minDate,
            max = this.maxDate,
            now = this.nowArr,
            slct = this.slctArr,
            plate = base.find('._dtPlate');
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
            tag.setAttribute('name', 'day');
            tag.setAttribute('alt', i);
            if ((min && str < min) || (max && str > max)) tag.setAttribute('disabled', 'disabled');
            if (isToday && now[2] == i) tag.setAttribute('today', 'today');
            if (isSlct && i == slct[2]) tag.setAttribute('select', 'select');
            if (i == 1) tag.style.marginLeft = str.getDay() * 14.28 + '%';
            plate.appendChild(tag);
        }
        base.find('._indiYear').innerHTML = slct[0];
        base.find('._indiMonth').innerHTML = slct[1] + 1;
    }
    DatePicker.prototype.checkDate = function(date) {
        var min = this.minDate,
            max = this.maxDate,
            dlg = base.id('_dtPicker'),
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

    iDialog.DatePicker = DatePicker;
    iDialog.Modal = Modal;
    return iDialog;
});
