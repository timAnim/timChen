  var predev = {
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
        while (!target.getAttribute('evnt') && target.tagName !== 'BODY') {
          target = target.parentNode;
        }
        var name = target.getAttribute('evnt');
        if (!name) return;
        fn.call(target, name, target);
      });
    },
    // 通知
    toast: function(str) {
      var tst = document.createElement('toast');
      tst.innerHTML = str;
      tst.id = this.randId(4);;
      document.body.appendChild(tst);
      setTimeout(function() {
        predev.animOut(tst, tst, 'out-opacity', 200, function() {
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
    isArray: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    },
    compose: function(model, viewId) {
      var view;
      if (this.id(viewId)) {
        view = this.id(viewId).value;
      } else {
        view = viewId;
      }
      var htmlStr = '';
      if (predev.isArray(model)) {
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
      if (typeof(userInit) == 'undefined') var userInit = {};
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
    getRequest: function() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        if (str.indexOf("&") != -1) {
          strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
          }
        } else {
          theRequest[str.split("=")[0]] = decodeURI(str.split("=")[1]);
        }
      }
      return theRequest;
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
    log: {
      heap: [document.getElementsByTagName('main')[0]],
      in: function(ele) {
        ele = (typeof(ele) == "string") ? document.getElementById(ele) : ele;
        var heap = this.heap;
        if (ele.tagName == 'MODAL') ele.style.display = 'flex';
        else ele.style.display = 'block';
        heap.push(ele);
        var last = heap[heap.length - 2];
        last.setAttribute('pause', true);
      },
      pop: function() {
        var heap = this.heap;
        var outer = heap[heap.length - 1];
        var last = heap[heap.length - 2];
        var animObj = outer.children[0];
        if (outer.tagName == 'MODAL') animObj = outer;
        var clean = (animObj.getAttribute('clean') == 'true') ? true : false;
        var self = this;
        predev.animOut(outer, animObj, animObj.getAttribute('out'), 120, function() {
          heap.remove((heap.length - 1));
          if (clean) outer.parentNode.removeChild(outer);
          else outer.style.display = 'none';
          last.setAttribute('pause', false);
        });
      },

    },
  };

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


  export default predev
