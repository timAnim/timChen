<style scoped>
    .shade-as-card{
        padding: 0.8rem;
    }
</style>
<template>
    <transition name='in-left'>
    <ol class='shade-as-card'>
        <li>
            <em>导入xml文件</em>
            <input type="file" @change='parse'>
            <button class="theme-mark">选择</button>
            <button class="theme-mark" @click='save'>创建</button>
        </li>
        <li><em>任务列表</em></li>
        <li v-for='item in tasks'>
            <em>{{ item.name }}</em>
            <em char='6'>{{ item.person }}</em>
            <em char='6'>{{ item.start }}</em>
            <em char='6'>{{ item.end }}</em>
        </li>
    </ol>
    </transition>
</template>
<script>

export default{
    props:['init'],
    data(){
        return{
            code:this.$route.query.code,
            tasks:[],
            file:'',
        }
    },
    methods:{
        save(){
            var req={
                code:this.code,
                plan:this.tasks
            }
            this.$http.post('/api/projects/plan/insert',req)
            .then(res => {
                if (res.body.code!==0)return
                this.$pd.toast('添加成功')
                this.$router.back()
            });            
        },
        parse(ev){
            var files=ev.target.files
            let self=this
             if (files.length) {
                var file = files[0];
                var reader = new FileReader();
                reader.onload = function() {
                    var doc = (new DOMParser()).parseFromString(reader.result,"text/xml")
                    var arr=xmlToJson(doc).xml.rows.row
                    arr.forEach(item=>{
                        if (item.estStarted['#text']==="0000-00-00") item.estStarted['#text']=self.init.start
                        if (item.finishedDate['#text']==="0000-00-00") item.finishedDate['#text']=self.init.end
                        self.tasks.push({
                            name:item.name['#text'],
                            pname:item.assignedTo['#text'],
                            start: item.estStarted['#text'],
                            end: item.finishedDate['#text'],
                        })
                    })
                }
                reader.readAsText(file);
            }
        },
    }
}

function xmlToJson(xml) {
 // Create the return object
 var obj = {};
 if (xml.nodeType == 1) { // element
  // do attributes
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
 // do children
 if (xml.hasChildNodes()) {
  for(var i = 0; i < xml.childNodes.length; i++) {
   var item = xml.childNodes.item(i);
   var nodeName = item.nodeName;
   if (typeof(obj[nodeName]) == "undefined") {
    obj[nodeName] = xmlToJson(item);
   } else {
    if (typeof(obj[nodeName].push) == "undefined") {
     var old = obj[nodeName];
     obj[nodeName] = [];
     obj[nodeName].push(old);
    }
    obj[nodeName].push(xmlToJson(item));
   }
  }
 }
 return obj;
}
</script>