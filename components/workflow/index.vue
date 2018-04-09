<template>
  <section>
    <ul>
      <dl class="green">
        <dd>需求说明单</dd>
        <dd>
          <label>模板</label>
        </dd>
        <dt class='outer icon'>
          <textarea @drop='upload' @click='select' id='excel'></textarea>
          <div class="label">
            <icon name='file-excel-o'></icon>
          </div>
          <div class='hint'>点击上传xml或拖拽到此区域</div>
          <input type="file" @change="upload" name='excel'>
        </dt>
      </dl>
      <dl class="blue">
        <dd>需求文档</dd>
        <dd>
          <label>模板</label>
        </dd>
        <dt class='outer icon'>
          <textarea @drop='upload' @click='select' id='word'></textarea>
          <div class="label">
            <icon name='file-word-o'></icon>
          </div>
          <div class='hint'>点击上传xml或拖拽到此区域</div>
          <input type="file" @change="upload" name='word'>
        </dt>
      </dl>
    </ul>
    <h3></h3>
    <ol class="shade-as-card pd-half procedure" @click='procedure=!procedure'>
      <li type='filter'><em>UED工作流程</em></li>
      <div class='cliper'>
        <img src='static/img/支持流程.svg' />
      </div>
    </ol>
    <transition name='slide'>
      <div class="mask" v-if='procedure'>
        <button id='close-btn' @click='procedure=!procedure'>
          <icon name='times-circle'></icon>
        </button>
        <img-viewer :src='"/static/img/支持流程.svg"'></img-viewer>
      </div>
    </transition>
  </section>
</template>
<style scoped>
dl {
  flex: 1 1 10rem;
  margin: 0.8rem;
  border-radius: 4px;
  overflow: hidden;
}

dd {
  padding: 0.4rem 0.8rem;
  color: white;
}

dd label {
  display: inline-block;
  float: right;
  cursor: pointer;
  color: white;
}

textarea {
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0;
  left: 0;
  top: 0;
  cursor: pointer;
  z-index: 99;
}

li[type=filter]>button {
  border-radius: 1.2rem;
  flex: 0 0 6.4rem;
  height: 2.4rem;
  line-height: 2.4rem;
}

.outer {
  position: relative;
}

.outer>.label {
  line-height: 6rem;
}

.outer>.label svg {
  transform: scale(2);
}

.upload {
  position: absolute;
  height: 2.4rem;
  width: 5.6rem;
  border-radius: 1.2rem;
  right: 0.1rem;
  top: 50%;
  margin-top: -1.2rem;
  opacity: 1;
}

.upload svg {
  margin-bottom: -0.2rem;
  fill: white;
}

input[type="file"] {
  display: none;
}

.task-input button {
  border-radius: 50%;
  height: 3rem;
  line-height: 3rem;
}

.task-input input {
  border-radius: 0;
}

.green {
  background-color: #259b24;
  margin-left: 0;
}

.blue .outer,
.green .outer {
  background-color: #2baf2b;
  text-align: center;
  color: white;
  line-height: 3rem;
  font-size: 0.875rem;
}

.hint {
  display: block;
  line-height: 3rem;
}

.blue {
  background-color: #3f51b5;
  margin-right: 0;
}

.blue .outer {
  background-color: #5c6bc0;
}

.procedure {
  cursor: pointer;
}

.procedure img {
  transform: translateY(-50%);
}

.cliper {
  height: 8rem;
  overflow: hidden;
}

.mask {
  background-color: #f5f5f5;
  z-index: 9999;
}

#close-btn {
  width: 3.2rem;
  height: 3.2rem;
  line-height: 3.2rem;
  border-radius: 50%;
  position: absolute;
  right: 0.8rem;
  top: 0.8rem;
  z-index: 9999;
}

#close-btn svg {
  transform: scale(1.6);
}

</style>
<script>
import viewer from './../_common/img-viewer'
import ocrImage from './../_common/ocr-image'
export default {
  data() {
    return {
      clicked: null,
      procedure: false,
    }
  },
  methods: {
    upload(event) {
      event.preventDefault()
      var files = event.target.files || event.dataTransfer.files
      if (!files.length) return
      var _id = event.target.id || this.clicked
      var file = files[0]
      var sendFile = (data, filename) => {
        this.$http.post('/api/workflow/generate-prd-' + _id, {
          data: data,
          name: filename
        }).then(res => {
          if (!res.body) return
          this.$pd.toast('上传成功')
          document.getElementsByName(_id)[0].value = null
          window.location.href = res.body.resPath
        })
      }

      this.readFileSync(file)
        .then(reader => {
          var parser = new DOMParser()
          var doc = parser.parseFromString(reader.result, "text/xml")
          var data = this.xmlToJson(doc).xml.rows.row
          var filename = file.name.replace(/(.*\/)*([^.]+).*/ig, "$2");
          sendFile(data, filename)
        })
    },
    readFileSync(file) {
      var reader = new FileReader()
      var readFile = new Promise((resolve, reject) => {
        reader.readAsText(file)
        reader.onload = ev => {
          resolve(reader)
        }
      })
      return readFile
    },
    xmlToJson(xml) {
      var obj = {};
      if (xml.nodeType == 1) { // element
        if (xml.attributes.length > 0) {
          obj["@attributes"] = {};
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
      }
      if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;
          if (typeof(obj[nodeName]) == "undefined") {
            obj[nodeName] = this.xmlToJson(item);
          } else {
            if (typeof(obj[nodeName].push) == "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(this.xmlToJson(item));
          }
        }
      }
      return obj;
    },
    select(ev) {
      var _id = event.target.id
      this.clicked = _id
      document.getElementsByName(_id)[0].click()
    }
  },
  computed: {
    curWeek() {
      function isLeapYear(year) {
        return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
      }

      function getMonthDays(year, month) {
        return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
      }

      function getWeekNumber(y, m, d) {
        var now = new Date()
        if (y && m && d) now = new Date(y, m - 1, d);
        var year = now.getFullYear(),
          month = now.getMonth(),
          days = now.getDate();
        //那一天是那一年中的第多少天
        for (var i = 0; i < month; i++) {
          days += getMonthDays(year, i);
        }
        //那一年第一天是星期几
        var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

        var week = null;
        if (yearFirstDay == 1) {
          week = Math.ceil(days / yearFirstDay);
        } else {
          days -= (7 - yearFirstDay + 1);
          week = Math.ceil(days / 7) + 1;
        }
        return week;
      }
      return getWeekNumber()
    },
    start() {
      var now = new Date()
      var day = now.getDay()
      var month = now.getMonth() + 1
      var date = now.getDate()
      return month + '-' + (date - (day - 1))
    },
    end() {
      var now = new Date()
      var day = now.getDay()
      var month = now.getMonth() + 1
      var date = now.getDate()
      return month + '-' + (date + (5 - day))
    }
  },
  components: {
    'img-viewer': viewer,
    'ocr-image': ocrImage
  }
}

</script>
