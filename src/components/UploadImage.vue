<template>
  <div class="upload-img-cbox">
    <el-upload
      v-loading="avatarLoading"
      accept="image/*"
      action=""
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
    >
      <img v-if="src" :src="src" class="avatar">
      <i v-else class="el-icon-folder-opened avatar-uploader-icon" />
    </el-upload>
    <cropper v-if="iscrop" ref="cropper" :width="cropWidth" :height="cropHeight" :path="path" :disk="disk" @success="handleCropSuccess" />
  </div>
</template>
<script>
import { upload } from '@/api/web'
import Cropper from '@/components/Cropper'
import { config, upload as ossUpload } from '@/api/oss'

export default {
  components: { Cropper },
  props: {
    // 默认值
    value: {
      type: String,
      default: ''
    },
    // 上传目录
    path: {
      type: String,
      default: 'uploads'
    },
    // 文件大小(单位: byte)
    size: {
      type: Number,
      default: 2 * 1000 * 1000
    },
    // 自定义上传函数
    upload: {
      type: Function,
      default: null
    },
    disk: {
      type: String,
      default: 'default'
    },
    // 是否需要裁剪
    iscrop: {
      type: Boolean,
      default: false
    },
    // 裁剪的宽度
    cropWidth: {
      type: Number,
      default: 300
    },
    // 裁剪的高度
    cropHeight: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      avatarLoading: false,
      src: this.value
    }
  },
  watch: {
    value: function(newValue, oldValue) {
      this.src = newValue
    }
  },
  created() {
  },
  methods: {
    uploadError(error, file) {
      console.log(error)
      this.avatarLoading = false
    },
    uploadSuccess(res, file) {
      this.avatarLoading = false
      if (res.code === 200 && res.data) {
        this.src = res.data.file
        this.$emit('success', this.src)
      } else {
        this.$message.error(res.message || '上传失败')
      }
    },
    beforeUpload(file) {
      if (this.size && file.size >= this.size) {
        const size = this.formatFileSize(this.size)
        this.$message.error(`上传图片大小不能超过 ${size}`)
        return false
      }
      return true
    },
    handleUpload(data) {
      if (this.upload) {
        this.upload(data.file)
        return
      }
      if (this.iscrop) {
        this.$refs.cropper.crop(data.file)
        return
      }
      if (this.disk === 'oss') {
        this.handleUploadOss(data.file)
        return
      }
      const formData = new FormData()
      formData.append('path', this.path)
      formData.append('file', data.file)
      this.avatarLoading = true
      upload(formData).then(res => {
        this.avatarLoading = false
        if (res.code === 200) {
          this.src = res.data.file
          this.$emit('success', res.data.file)
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        this.avatarLoading = false
        console.log(error)
      })
    },
    async handleUploadOss(file) {
      this.avatarLoading = true
      try {
        const response = await config({ path: this.path })
        if (response.code !== 200) {
          this.$message.error(response.message)
          return false
        }
        const data = response.data
        data.file = file
        const res = await ossUpload(data)
        this.avatarLoading = false
        this.src = data.host + res.filename
        this.$emit('success', data.host + res.filename)
      } catch (error) {
        this.avatarLoading = false
        this.$message.error('OSS 上传失败')
        console.log(error)
      }
    },
    // 格式化文件大小
    formatFileSize(fileSize) {
      if (fileSize < 1024) {
        return fileSize + 'B'
      } else if (fileSize < (1024 * 1024)) {
        return (fileSize / 1024).toFixed(2) + 'KB'
      } else if (fileSize < (1024 * 1024 * 1024)) {
        return (fileSize / (1024 * 1024)).toFixed(2) + 'MB'
      } else {
        return (fileSize / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
    },
    handleCropSuccess(url) {
      this.src = url
      this.$emit('success', url)
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
