<template>
  <div id='canvas'>
    <div id='crosshair'></div>
    <button id='colorpicker' class="shade-as-card" name='vr-btn' @click='selectColor'>
      <icon name='paint-brush'></icon>
      <div>
        <button @click='color("#e51c23")'>
          <icon name='circle' class='red'></icon>
        </button>
        <button @click='color("#9c27b0")'>
          <icon name='circle' class='purple'></icon>
        </button>
        <button @click='color("#303f9f")'>
          <icon name='circle' class='blue'></icon>
        </button>
        <button @click='color("#8bc34a")'>
          <icon name='circle' class='green'></icon>
        </button>
      </div>
    </button>
    <button id='fullscreen' class=" shade-as-card" @click='fullscreen' name='vr-btn'>
      <icon v-if='!ifFullscreen' name='expand'></icon>
      <icon v-if='ifFullscreen' name='compress'></icon>
    </button>
    <button class="leave_btn shade-as-card" @click='leave' name='vr-btn'>
      <icon name='angle-left'></icon>
    </button>
    <button id='enviroment' class="shade-as-card" @click='env' name='vr-btn'>
      <icon v-if='!isDaytime' name='sun-o'></icon>
      <icon v-if='isDaytime' name='moon-o'></icon>
    </button>
    <button id='insight-btn' class="shade-as-card" @click='insight' name='vr-btn'>
      <icon name='eye'></icon>
    </button>
    <button id='vr-btn' class="shade-as-card" @click='vr' name='vr-btn'>
      <icon name='simplybuilt'></icon>
    </button>
    <loading ref='loading' :show='loading'></loading>
  </div>
</template>
<style scoped>
div {
  padding: 0;
}

#crosshair {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 8px;
  width: 8px;
  margin-left: -4px;
  margin-top: -4px;
  border-radius: 50%;
  border: solid 3px #03a9f4;
  box-shadow: 0 0 3px white;
  z-index: 9999;
}

#info {
  position: absolute;
  top: 0;
  left: 25%;
  width: 50%;
}

#canvas {
  height: 100%;
  width: 100%;
  cursor: w-resize;
}

#colorpicker {
  position: absolute;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  top: 50%;
  right: 0.8rem;
  line-height: 4rem;
  margin-top: 2.8rem;
}

#insight-btn {
  position: absolute;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  top: 50%;
  margin-top: -2rem;
  right: 0.8rem;
  line-height: 4rem;
}

#enviroment {
  position: absolute;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  top: 50%;
  margin-top: -6.8rem;
  right: 0.8rem;
  line-height: 4rem;
}

#vr-btn {
  position: absolute;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  bottom: 0.8rem;
  right: 0.8rem;
  line-height: 4rem;
}

#fullscreen {
  position: absolute;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  top: 0.8rem;
  right: 0.8rem;
  line-height: 4rem;
}


#colorpicker div {
  display: none;
  background-color: #f5f5f5;
  box-shadow: 0 1px 3px #bdbdbd;
  padding: 0;
  width: 16rem;
  margin-left: -16rem;
  word-spacing: -6px;
  margin-top: -4rem;
}

#colorpicker button {
  width: 4rem;
  height: 4rem;
  line-height: 4rem;
  margin: 0!important;
}

#colorpicker:hover div {
  display: block;
}

.red {
  fill: #e51c23
}

.purple {
  fill: #9c27b0
}

.blue {
  fill: #303f9f
}

.green {
  fill: #8bc34a
}

.leave_btn {
  position: absolute;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  top: 50%;
  margin-top: -2rem;
  left: 0.8rem;
  line-height: 4rem;
}

</style>
<script>
import * as THREE from 'three'
import './../../../static/js/hammer.js'
// 模型
var models = {
  cur: 0,
  list: ['/static/model/bus2.obj', '/static/model/bus1.obj']
}

var texture = new THREE.TextureLoader().load("static/datum/motorsky.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1);

var metalTxtr = new THREE.CubeTextureLoader()
  .setPath('static/datum/')
  .load(['posX.jpg', 'negX.jpg', 'posY.jpg', 'negY.jpg', 'posZ.jpg', 'negZ.jpg'])

var textureCube = new THREE.CubeTextureLoader()
  .setPath('static/datum/')
  .load(['texture_motorsky_pos_x.jpg', 'texture_motorsky_neg_x.jpg', 'texture_motorsky_pos_y.jpg', 'texture_motorsky_neg_y.jpg', 'texture_motorsky_pos_z.jpg', 'texture_motorsky_neg_z.jpg'])

var textureCubeNight = new THREE.CubeTextureLoader()
  .setPath('static/datum/')
  .load(['texture_skydark_pos_x.jpg', 'texture_skydark_pos_x.jpg', 'texture_skydark_pos_x.jpg', 'texture_skydark_neg_y.jpg', 'texture_skydark_pos_x.jpg', 'texture_skydark_pos_x.jpg'])

// 材质
var metalMaterial = new THREE.MeshPhongMaterial({
  color: 0x212121,
  envMap: metalTxtr,
  combine: THREE.MixOperation,
  reflectivity: 0.6,
})

var bodyMaterial = new THREE.MeshLambertMaterial({
  color: 0xd01716,
  envMap: textureCube,
  combine: THREE.MixOperation,
  reflectivity: 0.2,
  side: THREE.DoubleSide,
})

var glassMaterial = new THREE.MeshPhongMaterial({
  color: 0x000000,
  shininess: 60,
  opacity: 0.7,
  transparent: true,
  envMap: textureCube,
  combine: THREE.MixOperation,
  reflectivity: 0.2,
})

var brightGlassMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 60,
  opacity: 0.7,
  transparent: true,
})

var tireMaterial = new THREE.MeshLambertMaterial({
  color: 0x000000,
})

var bannerMaterial = new THREE.MeshStandardMaterial({
  color: 0xff5722,
})

var defaultMaterial = new THREE.MeshLambertMaterial({
  color: 0x9e9e9e,
  envMap: metalTxtr,
  combine: THREE.MixOperation,
  reflectivity: 0.6,
})

var seatMaterial = new THREE.MeshLambertMaterial({
  color: 0x424242,
  flatShading: true,
})

var oringeLightMaterial = new THREE.MeshBasicMaterial({
  color: 0xff7043,
  side: THREE.DoubleSide,
})

//灯光
var ambient = new THREE.AmbientLight(0xffcc80, 0.02)

// 镜头光晕
var light = new THREE.PointLight(0xffffff, 5, 2000)
light.position.set(0, 500, 1000)

var textureLoader = new THREE.TextureLoader();
var textureFlare = textureLoader.load("static/datum/lensflare.png")
var flareColor = new THREE.Color(0xffffff)
flareColor.setHSL(0.55, 0.9, 0.5)

var lensFlare = new THREE.LensFlare(textureFlare, 700, 0.0, THREE.AdditiveBlending, flareColor)
lensFlare.add(textureFlare, 70, 1.0, THREE.AdditiveBlending);
lensFlare.position.copy(light.position)


// 高光
var spotLight = new THREE.SpotLight(0xd0d9ff, 2.5);
spotLight.position.set(500, 1000, 0);
spotLight.penumbra = 0.5;
spotLight.decay = 2;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 1000;
spotLight.shadow.camera.far = 3500;

var groundGeometry = new THREE.PlaneGeometry(3000, 3000, 100, 100)
var groundMaterial = new THREE.ShadowMaterial()
groundMaterial.opacity = 0.5;
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true
ground.position.set(0, -200, 0)
ground.rotation.x = -Math.PI * 0.5

// 渲染器
var renderer

// 画布
var canvas, ctx

// 场景
var scene

// 摄影机
var camera

// 模型
var object

var tire

// 加载器
var loader

// 效果
var effect

// 控制器 
var control

// 粒子系统

var cloudSpeed = 0.001

var geom = new THREE.Geometry();
//粒子系统材质，
var material = new THREE.PointsMaterial({
  size: 8, //默认大小
  transparent: true, //透明的
  opacity: 0.6, //不透明
  vertexColors: true,
  sizeAttenuation: true, //粒子透视
  blending: true,
});

var range = 3000,
  createNums = 5000, //粒子数
  color = new THREE.Color(0xffffff); //颜色在vertexColors为true时
for (var i = 0; i < createNums; i++) {
  var particle = new THREE.Vector3(
    Math.random() * range - range / 2,
    Math.random() * range - range / 2,
    Math.random() * range - range / 2
  );
  geom.vertices.push(particle); //点加入
  geom.colors.push(color); //颜色加入
}
var cloud = new THREE.Points(geom, material); //粒子云系统
cloud.name = 'particles'; //命名名字，在重绘的时候使用


var gamma = 0,
  beta = 0;

var btns = []
var header = 0
var fireSeed
var fireable = true
var fireOver = false

var checkBtn = axis => {
  console.log('fireable:' + fireable, '  fireOver:' + fireOver, ' fireSeed:' + fireSeed)
  if (!btns.length) initBtn()
  axis[0] += (canvas.clientWidth / 2)
  axis[1] += (canvas.clientHeight / 2 + header)
  var bd
  for (var i = btns.length - 1; i >= 0; i--) {
    bd = btns[i].getBoundingClientRect()
    bd = [bd.top, bd.right, bd.bottom, bd.left]
    if (axis[0] > bd[3] && axis[0] < bd[1] && axis[1] > bd[0] && axis[1] < bd[2]) {
      // 2. 如果在上面就是悬停
      fireOver = true
      // 3. 悬停状态下如果可以 触发就触发
      if (fireable) fireEnter(btns[i])
    }
  }
  // 如果没在悬停就是离开
  if (!fireOver) fireLeave()
}

var initBtn = function() {
  header = document.getElementsByTagName('header')[0].clientHeight
  btns = document.getElementsByName('vr-btn')
}

var orientationHandler = event => {
  gamma = event.gamma;
  beta = event.beta;
  if (beta > 65) beta = 65
  if (beta < 25) beta = 25
  beta = 45 - beta;
  if (gamma > 20) gamma = 20
  if (gamma < -20) gamma = -20

  gamma = -Math.floor(canvas.clientWidth * gamma / 40)
  beta = Math.floor(canvas.clientHeight * beta / 40)
  document.getElementById('crosshair').style.transform =
    `translate(${gamma}px, ${beta}px)`
  // 1. 每次动手机都检查
  if (Math.abs(gamma) > (canvas.clientWidth / 2 - 50)) checkBtn([gamma, beta])
  else fireLeave()
}

function fire(btn) {
  console.log('fire')
  btn.click()
}

function fireEnter(btn) {
  // 触发一次就不能再触发
  fireable = false
  console.log('enter')
  fireSeed = setTimeout(ev => {
    // 400毫秒之后点击
    fire(btn)
  }, 400)
}

function fireLeave() {
  // 如果离开则不是悬停，可以触发
  console.log('leave')
  fireOver = false
  fireable = true
  // 如果有计时就清空
  clearTimeout(fireSeed)
  fireSeed = null
}

export default {
  data() {
    return {
      rotateSeed: 0,
      rotateSpeed: 0.01,
      pinchSeed: 0,
      _position: 0,
      _scale: 1,
      dragging: 0,
      dragDelta: 0,
      colorpicker: false,
      loading: true,
      maxRotateSpeed: 0.04,
      fromInsight: false,
      isDaytime: true,
      _renderer: null,
      isVr: false,
      ifFullscreen: false,
      colorArr: ["#e51c23", "#9c27b0", "#303f9f", "#8bc34a"],
      curColor: 0,
    }
  },
  mounted() {
    this.init()
  },

  destroyed() {
    cancelAnimationFrame(this.rotateSeed)
    cancelAnimationFrame(this.leaveSeed)

    scene = null;
    object = null
    loader = null;
    camera = null;
    renderer = null
    if (control) control.destroy()
  },
  methods: {
    init() {
      this.loading = false
      canvas = this.$pd.id('canvas')
      window.onresize = this.resize
      setTimeout(t => {
        this.initScene()
      }, 400)
      if (!window.DeviceOrientationEvent) return
      window.addEventListener("deviceorientation", orientationHandler, false)
    },
    initScene() {
      camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 1, 2000);
      camera.position.set(0, 0, 1250);
      camera.rotation.x = -Math.PI * 0.125;
      camera.lookAt({ x: 0, y: 0, z: 0 })


      renderer = new THREE.WebGLRenderer();
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.antialias = true
      renderer.setClearColor(0xf5f5f5, 1.0)
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio * 2);
      canvas.appendChild(renderer.domElement)

      this.renderer = renderer

      effect = new THREE.StereoEffect(renderer)
      effect.setSize(canvas.clientWidth, canvas.clientHeight)

      scene = new THREE.Scene();
      scene.background = texture

      scene.add(ambient)
      scene.add(spotLight)
      scene.add(light) //有bug添加有问题
      scene.add(lensFlare) //有bug添加有问题

      scene.add(ground)

      scene.add(cloud);
      this.render()
      this.cloudAnim()
      this.ctrlInit()

      loader = new THREE.OBJLoader()
      this.loadSync(models.list[models.cur])
        .then(obj => {
          object = obj
          this.rotateAnim()
          // this.rollAnim()
        })
    },
    selectColor(ev) {
      this.curColor++;
      if (this.curColor > 4) this.curColor = 0
      this.color(this.colorArr[this.curColor])
    },
    panstart(ev) {
      this._position = object.rotation.y
      cancelAnimationFrame(this.rotateSeed)
      this.dragAnim()
    },
    panmove(ev) {
      this.dragDelta = ev.deltaX
    },
    panend(ev) {
      cancelAnimationFrame(this.dragging)
      this.rotateAnim()
      let speed = ev.velocityX * 0.01
      if (speed > 0.1) speed = this.maxRotateSpeed
      if (speed < -0.1) speed = -this.maxRotateSpeed
      this.rotateSpeed = speed
    },
    pinchstart(ev) {
      this._scale = object.scale.x
    },
    pinchmove(ev) {
      if (ev.scale) {
        let scale = ev.scale * this._scale
        if (scale > 2) scale = 2
        else if (scale < 0.5) scale = 0.5
        object.scale.set(scale, scale, scale)
      } else if (ev.deltaY) {
        let direct = ev.deltaY > 0 ? -0.03 : 0.03;
        this._scale = object.scale.x
        this._scale += direct
        object.scale.set(this._scale, this._scale, this._scale)
        ev.preventDefault()
      }
    },
    pinchend(ev) {
      this._scale = object.scale.x
    },
    dragAnim() {
      this.dragging = requestAnimationFrame(this.dragAnim)
      object.rotation.y = this._position + this.dragDelta * 0.01
      this.render()
    },
    rotateAnim() {
      this.rotateSeed = requestAnimationFrame(this.rotateAnim)
      object.rotation.y += this.rotateSpeed;
      if (object.rotation.y > Math.PI * 2 || object.rotation.y < -Math.PI * 2) object.rotation.y = 0
      this.render()
    },
    pinchAnim() {
      this.pinchSeed = requestAnimationFrame(this.pinchAnim)
      this._scale -= 0.01
      object.scale.set(this._scale, this._scale, this._scale)
      this.render()
    },
    cloudAnim() {
      requestAnimationFrame(this.cloudAnim)
      cloud.position.y -= 1;
      cloud.position.x += 0.3;
      if (cloud.position.y < -1200) cloud.position.y = 1500
      if (cloud.position.x > 1200) cloud.position.x = -1500
    },
    rollAnim() {
      requestAnimationFrame(this.rollAnim)
      tire.rotation.x += 0.05;
    },
    leave() {
      if (this.loading) return
      this.leaveSync()
        .then(res => {
          scene.remove(object)
          this.rotateSpeed = 0.01
          return this.loadSync(models.list[models.cur])
        })
        .then(obj => {
          object = obj
          this.rotateAnim()
        })
    },
    leaveSync() {
      var _p = new Promise((resolve, reject) => {
        var leaveSeed = 0
        this.loading = true
        var self = this
        var anim = function() {
          leaveSeed = requestAnimationFrame(anim)
          if (object.rotation.y > -Math.PI * 0.4) {
            object.rotation.y -= Math.PI * 0.1
          } else if (object.rotation.y < -Math.PI * 0.6) {
            object.rotation.y += Math.PI * 0.1
          } else {
            object.rotation.y = -Math.PI * 0.5
            object.position.x -= 20
            if (object.position.x < -2000) {
              cancelAnimationFrame(leaveSeed)
              resolve(true)
            }
          }
          self.render()
        }
        anim()
      })
      return _p
    },
    color(_c) {
      bodyMaterial.color = new THREE.Color(_c)
    },
    insight() {
      if (this.fromInsight) camera.position.set(0, 0, 1250);
      else camera.position.set(0, 20, 0);
      this.fromInsight = !this.fromInsight
    },
    ctrlInit() {
      control = new Hammer(canvas)
      control.on('panstart', this.panstart)
      control.on('panmove', this.panmove)
      control.on('panend', this.panend)
      control.on('pancancel', this.panend)

      control.get('pinch').set({ enable: true });
      control.on('pinchstart', this.pinchstart)
      control.on('pinchmove', this.pinchmove)
      control.on('pinchend', this.pinchend)
      control.on('pinchcancel', this.pinchend)

      canvas.addEventListener('mousewheel', this.pinchmove)
    },
    env() {
      if (this.isDaytime) {
        texture = new THREE.TextureLoader().load('static/datum/skydark.jpg')
        bodyMaterial.envMap = textureCubeNight
        glassMaterial.envMap = textureCubeNight
        scene.background = texture
        ambient.intensity = 0.05
      } else {
        texture = new THREE.TextureLoader().load('static/datum/motorsky.jpg')
        bodyMaterial.envMap = textureCube
        glassMaterial.envMap = textureCube
        scene.background = texture
        ambient.intensity = 0
      }
      this.isDaytime = !this.isDaytime
    },
    vr() {
      if (this.isVr) this.renderer = renderer
      else this.renderer = effect
      this.isVr = !this.isVr
      this.resize()
    },
    render() {
      this.renderer.render(scene, camera)
    },
    loadSync(url) {
      var _p = new Promise((resolve, reject) => {
        this.loading = true

        loader.load(
          url,
          model => {
            model.traverse(child => {
              if (!child instanceof THREE.Mesh) return
              child.castShadow = true
              child.receiveShadow = false
              switch (child.name) {
                case "Archmodels55_13_red_lights":
                case "Archmodels55_13_Texts":
                  child.material = oringeLightMaterial
                  break
                case "Archmodels55_13_carpaint":
                case "Archmodels55_12_carpaint":
                  child.material = bodyMaterial
                  break;
                case "Archmodels55_12_glass":
                case "Archmodels55_13_glass":
                  child.material = glassMaterial
                  break;
                case "Archmodels55_13_tire":
                case "Archmodels55_12_tire":
                case "Archmodels55_13_black":
                  tire = child
                  child.material = tireMaterial
                  break;
                case "Archmodels55_12_headlights_glass":
                case 'Archmodels55_13_headlights_glass':
                case 'Archmodels55_13_lights_glass':
                  child.material = brightGlassMaterial
                  break;
                case "Archmodels55_12_banners":
                  child.material = bannerMaterial
                  break;
                case 'Archmodels55_12_pipes':
                case 'Archmodels55_12_rims_caps':
                case 'Archmodels55_12_mirrors':
                case 'Archmodels55_12_rims':
                case 'Archmodels55_13_details':
                case "Archmodels55_13_mirrors":
                case 'Archmodels55_13_white_lights':
                case 'Archmodels55_13_front_details':
                case 'Archmodels55_13_lightsblack':
                  child.material = metalMaterial
                  break;
                case 'Archmodels55_12_seats':
                case 'Archmodels55_13_seats':
                  child.material = seatMaterial
                  break;
                default:
                  child.material = defaultMaterial
                  // console.log(child.name)
                  return
              }
            })
            model.position.set(0, -200, 0)
            model.castShadow = true
            models.cur = models.cur + 1
            if (models.cur >= models.list.length) models.cur = 0
            scene.add(model)
            this.loading = false
            resolve(model)
          }
        );
      })
      return _p
    },
    launchFullScreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    fullscreen() {
      if (this.ifFullscreen) {
        this.exitFullscreen()
      } else {
        this.launchFullScreen(canvas)
      }
      this.ifFullscreen = !this.ifFullscreen
    },
    resize() {
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      effect.setSize(canvas.clientWidth, canvas.clientHeight)
    },
  }
}

</script>
