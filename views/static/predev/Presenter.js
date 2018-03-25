    document.body.addEventListener('keydown', function backKey(e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 27 && pd.log.heap.length > 1) pd.log.pop();
        else history.go(-1);
        return false;
    },false);
    var templates = {
        dialog: "<article id='$id$' out='out-top' clean='$clean$'>" +
            "<header><li><label><i class='$label$'></i></label>" +
            "<h1>$title$</h1></li></header>" +
            "<content></content>" +
            "<footer>" +
            "<button type='pos' evnt='submit'>OK</button>" +
            "</footer>" +
            "</article>",
        checkItem: "<li class='blink-theme' evnt='check' id='$id$'>" +
            "<em>$value$</em>" +
            "<pre>$secondary$</pre>" +
            "<label type='switch' checked='$checked$'>" +
            "<i class='fa fa-square-o'></i>" +
            "<i class='fa fa-check-square'></i>" +
            "</label>" +
            "</li>",
        radioItem: "<li class='blink-theme' evnt='radio' id='$id$'>" +
            "<em>$value$</em>" +
            "<pre>$secondary$</pre>" +
            "<label type='switch' checked='$checked$'>" +
            "<i class='fa fa-circle-o'></i>" +
            "<i class='fa fa-dot-circle-o'></i>" +
            "</label>" +
            "</li>",
        inputItem: "<li evnt='none'>" +
            "<input autocomplete='off' value='$value$' type='$type$' placeholder='$placeholder$'>" +
            "<button evnt='clear'><i class='fa fa-times-circle'></i></button>" +
            "</li>",
        menu: "<article id='$id$' out='out-top' clean='$clean$'>" +
            "<header><li>" +
            "<label><i class='fa fa-user'></i></label>" +
            "<h1>$title$</h1></li>" +
            "</header>" +
            "<content></content>" +
            "</article>",
        aside: "<aside id='$id$' out='out-left' clean='$clean$' class='in-left'>" +
            "<content>" +
            "<dl>" +
            "<clip type='circle-l'><img src='$img$'></clip>" +
            "</dl>" +
            "</content>" +
            "</aside>",
        hrefItem: "<li id='$id$' evnt='href' class='blink-wave' checked='$checked$'>" +
            "<label><i class='fa $label$'></i></label>" +
            "<em>$value$</em><pre>$secondary$</pre>" +
            "<label><i class='fa fa-angle-right'></i></label>" +
            "</li>",
        login: "<dialog id='$id$' out='out-top'  clean='$clean$'>" +
            "<ul>" +
            "<header><label><i class='fa fa-user'></i></label><h1>$title$</h1></header>" +
            "<li>" +
            "<input id='username' placeholder='邮箱'/>" +
            "<button evnt='clear'><i class='fa fa-times-circle'></i></button>" +
            "</li>" +
            "<li>" +
            "<input id='password' placeholder='密码' type='password'/>" +
            "<button id='forgetPwd'>忘记密码</button>" +
            "</li>" +
            "</ul>" +
            "<ul><button type='pos' id='loginBtn'>登录</button></ul>" +
            "<ul><button type='pos' id='signupBtn'>注册</button></ul>" +
            "</dialog>",
        confirm: "<dl class='confirm' id='$id$' out='out-top' clean='$clean$'>" +
            "<dt>" +
            "<h1>$title$</h1>" +
            "</dt>" +
            "<dd>" +
            "<button res='false' type='neg' evnt='confirm'>取消</button>" +
            "</dd>" +
            "<dd>" +
            "<button res='true' type='pos' evnt='confirm'>确认</button>" +
            "</dd>" +
            "</dl>",
        modal: "<modal></modal>",
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
        }
        return { dialog: dialog, item: item };
    };
    var Presenter = function(init) {
        this.id = pd.randId(4);
        this.title = init.title;
        this.type = init.type;
        this.checked = init.checked || '';
        this.data = init.data || [];
        this.onOut = init.onOut || function() {};
        var dlg = pd.compose(init, getTemplates(this.type).dialog);
        var mask = document.createElement('mask');
        mask.id = this.id;
        mask.setAttribute('evnt', 'mask');
        mask.appendChild(dlg);
        document.body.appendChild(mask);
        mask.style.display = 'none';
        if (init.data) this.setData(init.data);
        if (this.checked && pd.id(this.checked)) pd.id(this.checked).setAttribute('checked', true);
        var self = this;
        pd.ontap(function(name, target) {
            submit.call(self, name, target);
        }, mask);
    };
    Presenter.prototype.setData = function(data) {
        this.data = data;
        var con = pd.find('content', this.id);
        var list = pd.compose(data, getTemplates(this.type).item);
        con.appendChild(list);
    };
    Presenter.prototype.show = function() {
        pd.log.in(this.id);
    };
    var submit = function(name, target) {
        var res = null;
        switch (name) {
            case 'check':
                var toggle = pd.find('label', target);
                var flag = (toggle.getAttribute('checked') == 'true') ? false : true;
                toggle.setAttribute('checked', flag);
                break;
            case 'radio':
                var list = target.parentNode;
                list = pd.findAll('label', list);
                for (var i = list.length - 1; i >= 0; i--) {
                    list[i].setAttribute('checked', false);
                }
                var toggle = pd.find('label', target);
                var flag = (toggle.getAttribute('checked') == 'true') ? false : true;
                toggle.setAttribute('checked', flag);
                break;
            case 'clear':
                var input = pd.find('input', target.parentNode);
                input.value = '';
                break;
            case 'submit':
                if (this.type == 'radio' || this.type == 'check') {
                    var list = pd.findAll('label', this.id);
                    var txtArr = [],
                        idArr = [],
                        id, em;
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (list[i].getAttribute('checked') == 'true') {
                            id = list[i].parentNode.id;
                            em = pd.find('em', list[i].parentNode).innerHTML;
                            idArr.push(id);
                            txtArr.push(em);
                        };
                    }
                    res = { idArr: idArr, txtArr: txtArr };
                } else if (this.type == 'input') {
                    var res = pd.find('input', this.id).value;
                }
                this.onOut(res);
                pd.log.pop();
                break;
            case 'confirm':
                res = (target.getAttribute('res') == 'true') ? true : false;
                this.onOut(res);
                pd.log.pop();
                break;
            case 'href':
                res = target.id;
                this.onOut(res);
                pd.log.pop();
                break;
            case 'mask':
                pd.log.pop();
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
        this.id = pd.randId(4);
        this.data = init.data;
        this.template = init.template;
        this.tapHandler = init.tapHandler;
        var dom = pd.compose(this.data, this.template);
        var mdl = document.createElement('modal');
        mdl.setAttribute('out', 'out-bottom');
        mdl.setAttribute('clean', init.clean);
        mdl.id = this.id;
        mdl.style.display = 'none';
        mdl.appendChild(dom);
        document.body.appendChild(mdl);
        var article = pd.find('content', this.id);
        this.scrollHandler = new Scroller(article);
        pd.ontap(this.tapHandler, mdl);
    };
    Modal.prototype.show = function() {
        pd.id(this.id).style.display = 'block';
        pd.log.in(this.id);
        this.scrollHandler.refresh();
    };
    Modal.prototype.out = function() {
        pd.log.pop();
    };
    /*
        name： Aside
        style：侧边栏
        template： aside
    */
    var Aside = function(init) {
        this.type = init.type;
        this.tapHandler = init.tapHandler;
        this.clean = true;
        this.checked = init.checked;
        this.onOut = init.onOut;
        this.id = pd.randId(4);
        init.id = this.id;
        this.dom = pd.compose(init, getTemplates('aside').dialog);
        this.data = init.data;
        var outer = pd.find('main');
        outer.insertBefore(this.dom, pd.find('article', outer));
        var con = pd.find('content', this.id);
        var list = pd.compose(this.data, getTemplates(this.type).item);
        con.appendChild(list);
        if (this.checked && pd.id(this.checked)) pd.id(this.checked).setAttribute('checked', true);
        var self = this;
        pd.ontap(function(name, target) {
            submit.call(self, name, target);
        }, outer);
    }
    Aside.prototype.toggle = function() {
        var state = pd.id(this.id).getAttribute('default');
        state = (state == 'false') ? true : false;
        pd.id(this.id).setAttribute('default', state);
    };


    Presenter.Modal = Modal;
    Presenter.Aside = Aside;

    if (typeof module != 'undefined' && module.exports) {
        module.exports = Presenter;
    } else if (typeof define == 'function' && define.amd) {
        define(function() {
            return Presenter;
        });
    } else {
        window.Presenter = Presenter;
    }
