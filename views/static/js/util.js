(function(window) {
  String.prototype.temp = function(obj) { //填充数据
    return this.replace(/\$\w+\$/gi, function(matchs) {
      var returns = obj[matchs.replace(/\$/g, "")];
      return (returns + "") == "undefined" ? "" : returns;
    });
  };

  HTMLElement.prototype.addEvent = function(type, fn, capture) {
    if (window.addEventListener) {
      this.addEventListener(type, fn, capture || false);

    } else if (window.attachEvent) {
      this.attachEvent("on" + type, function(e) {
        fn.call(this, e);
      });
    }
  };
  var util = {
    render: function(data, template) {
      var str = '';
      data.forEach(item => {
        str += template.temp(item);
      })
      return str;
    },
    html: function(text) {
      var i, a = document.createElement("div"),
        b = document.createDocumentFragment();
      a.innerHTML = text;
      while (i = a.firstChild) { b.appendChild(i); }
      return b;
    },
    target: function(ev) {
      var target = ev.target || window.event;
      while (!target.id) {
        target = target.parentNode;
      }
      return target;
    },
    randId: function(n) {
      var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        res = "";
      for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
      }
      return res;
    },
    getStyle(dom, prop) {
      if (window.getComputedStyle) {
        return window.getComputedStyle(dom, null)[prop];
      } else {
        return dom.currentStyle[prop];
      }
    },
    toast(str) {
      var tst = document.createElement('div');
      tst.innerHTML = str;
      tst.id = this.randId(4);
      tst.className = 'toast';
      document.body.appendChild(tst);
      setTimeout(t => {
        this.animOut(tst, tst, 'out-opacity', 200, function() {
          tst.parentNode.removeChild(tst);
        });
      }, 1500);
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
  };
  window.util = util;
}(window));
