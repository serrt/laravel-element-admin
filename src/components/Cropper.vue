<template>
  <!-- vueCropper 剪裁图片实现-->
  <el-dialog title="图片剪裁" :visible.sync="dialogVisible" width="70%" append-to-body>
    <div v-loading="loading" element-loading-text="上传中.." class="cropper-content pad60">
      <div class="left-option-box">
        <div class="handle">
          <el-button icon="el-icon-refresh" circle @click="cropperRotateFn" />
        </div>
        <div class="handle">
          <el-button icon="el-icon-zoom-in" circle @click="bigger" />
        </div>
        <div class="handle">
          <el-button icon="el-icon-zoom-out" circle @click="smaller" />
        </div>
      </div>
      <div class="cropper" style="text-align:center">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
          :center-box="option.centerBox"
          :info-true="option.infoTrue"
          :fixed-box="option.fixedBox"
          :auto-crop-width="width"
          :auto-crop-height="height"
          :enlarge="option.enlarge"
        />
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="finish">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { upload } from '@/api/web'
import { config, upload as ossUpload } from '@/api/oss'

export default {
  name: 'Cropper',
  components: {
    VueCropper
  },
  props: {
    // 裁剪的宽度
    width: {
      type: Number,
      default: 300
    },
    // 裁剪的高度
    height: {
      type: Number,
      default: 200
    },
    // 上传的目录
    path: {
      type: String,
      default: 'uploads'
    },
    disk: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: this.width, // 默认生成截图框宽度
        autoCropHeight: this.height, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        enlarge: 1
      },
      // 防止重复提交
      loading: false
    }
  },
  methods: {
    getObjectUR(file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 初始化
    crop(file) {
      this.fileinfo = file
      this.option.img = this.getObjectUR(file)
      this.dialogVisible = true
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      if (!this.option.img) {
        this.$message('操作过快，图片尚未加载成功')
        return false
      }
      this.$refs.cropper.getCropBlob((data) => {
        const fileName = 'xmbk' + this.fileinfo.uid
        // blob转为file对象
        const file = new window.File([data], fileName, {
          type: this.fileinfo.type
        })
        if (this.disk === 'oss') {
          this.handleUploadOss(file)
          return
        }
        const formData = new FormData()
        formData.append('name', file)
        formData.append('path', this.path)
        this.loading = true
        upload(formData).then((result) => {
          this.loading = false
          if (result.code === 200) {
            this.$emit('success', result.data.name)
            this.dialogVisible = false
          } else {
            this.$message.error(result.message)
          }
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      })
    },
    cropperRotateFn() {
      this.$refs.cropper.rotateLeft()
    },
    bigger() {
      this.$refs.cropper.changeScale(1)
    },
    smaller() {
      this.$refs.cropper.changeScale(-1)
    },
    async handleUploadOss(file) {
      this.loading = true
      try {
        const response = await config({ path: this.path })
        if (response.code !== 200) {
          this.$message.error(response.message)
          return false
        }
        const data = response.data
        data.file = file
        const res = await ossUpload(data)
        this.loading = false
        this.$emit('success', data.host + res.filename)
        this.dialogVisible = false
      } catch (error) {
        this.loading = false
        this.$message.error('OSS 上传失败')
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.avatar {
  max-width: 300px;
  max-height: 300px
}
.cropper-content {
  position: relative;
  &.pad60{
    padding-left: 60px;
  }
  .left-option-box {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    .handle{
      margin: 10px 0;
    }
  }
  .cropper {
    width: auto;
    height: 300px;
  }
}
</style>
