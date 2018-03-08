<template>
  <div class="main">
    <img id="imgPreview" :src="markedImg"/>
    <input id="imgInput" type="file" accept="image/*" @change="handleImgChange"/>

    <div>
      <mt-field label="内容" placeholder="请输入水印内容..." v-model="markedText"></mt-field>
    </div>
    <div class="markedColorRow">
      <span>颜色</span>
      <input id="markedC1" type="radio" value="#fff" name="color" @change="handleColorChange" checked>
      <label for="markedC1" class="markedColor" style="background-color: #fff"></label>
      <input id="markedC2" type="radio" value="#000" name="color" @change="handleColorChange">
      <label for="markedC2" class="markedColor" style="left: 80px;background-color: #000"></label>
      <input id="markedC3" type="radio" value="#f7333b" name="color" @change="handleColorChange">
      <label for="markedC3" class="markedColor" style="left: 112px;background-color: #f7333b"></label>
    </div>
    <div>
      <span class="markedLabel">透明度</span>
      <mt-range
        v-model="markedAlpha"
        :min="0"
        :max="100"
        :step="10"
        :bar-height="5">
      </mt-range>
    </div>
    <label id="imgLabel" for="imgInput">选择图片</label>
    <mt-button type="primary" size="large" @click.native="handleImageMarked" :disabled="controlDisabled">添加水印</mt-button>
  </div>
</template>

<script>
import Watermark from 'watermarkjs'

export default {
  name: 'HelloWorld',
  data () {
    return {
      markedImg: '',
      markedAlpha: 50,
      markedColor: '#fff',
      markedSize: 16,
      markedText: '这是一个小水印',
      rawImg: '',
      controlDisabled: true
    }
  },
  methods: {
    handleImgChange(e) {
      const imgFile = e.target.files[0]
      this.rawImg = imgFile

      const reader = new FileReader()
      reader.readAsDataURL(imgFile)
      reader.onload = arg => {
        this.markedImg = arg.target.result
        this.controlDisabled = false
      }
    },
    handleImageMarked() {
      if (!this.rawImg.type.match('image.*')) {
        return false;
      }

      Watermark([this.rawImg])
        .image(this.handleTextRotate)
        .render()
        .then(img => {
          console.log(img)
          this.markedImg = img[0].src
        })
    },
    handleTextRotate(target) {
      let context = target.getContext('2d')
      let size = this.markedSize
      let text = this.markedText
      text = `${text}   `
      text = text.repeat(50)

      let x = 0
      let y = target.height
      const gap = 32

      context.globalAlpha = this.markedAlpha / 100
      context.fillStyle = this.markedColor
      context.font = `${size}px Arial`
      context.rotate(45 * Math.PI / 180)

      for (let i=0; i < 50; i++) {
        y = y - gap * 2
        context.fillText(text, x, y)
      }
      return target;
    },
    handleColorChange(e) {
      this.markedColor = e.target.value
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #imgInput {
    display: none;
  }
  #imgLabel {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 4px;
    border: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 18px;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;

    margin: 8px 0;
    padding: 8px;

    display: block;
    width: 100%;

    color: #656b79;
    background-color: #f6f8fa;
    -webkit-box-shadow: 0 0 1px #b8bbbf;
    box-shadow: 0 0 1px #b8bbbf;
  }
  #imgPreview {
    width: 100%;
  }
  .markedLabel {

  }
  .markedColor {
    position: absolute;
    left: 48px;
    top: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #999;
  }
  .markedColorRow {
    position: relative;
    line-height: 30px;
  }
  input[type="radio"] {
    width: 20px;
    height: 20px;
    opacity: 0;
  }
  input[type="radio"]:checked+label {
    border: 1px solid #ccc;
  }
  input:checked+label::after {
    position: absolute;
    content: "";
    width: 5px;
    height: 10px;
    top: 4px;
    left: 8px;
    border: 2px solid #cccccc;
    border-top: none;
    border-left: none;
    transform: rotate(45deg)
  }
</style>
