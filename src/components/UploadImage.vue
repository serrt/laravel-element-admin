<template>
  <el-upload
    v-loading="avatarLoading"
    :accept="accept"
    class="avatar-uploader"
    :show-file-list="false"
    action=""
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-remove="handleRemove"
    :before-upload="beforeUpload"
    :http-request="handleUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>
<script>
import { upload } from '@/api/web'
import { config, upload as ossUpload } from '@/api/oss'

export default {
  props: {
    // 上传目录
    path: {
      type: String,
      default: 'uploads'
    },
    // 文件大小(KB)
    size: {
      type: Number,
      default: 2 * 1000 * 1000
    },
    // 默认图片
    value: {
      type: String,
      default: ''
    },
    // 文件类型
    accept: {
      type: String,
      default: 'image/*'
    },
    disk: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      avatarLoading: false,
      imageUrl: this.value
    }
  },
  watch: {
    value(newValue) {
      this.imageUrl = newValue
    }
  },
  methods: {
    handleSuccess(res, file, fileList) {
      this.avatarLoading = false
    },
    handleRemove(file, fileList) {
    },
    handleError(error, file, fileList) {
      this.avatarLoading = false
      console.log(error)
    },
    beforeUpload(file) {
      if (this.size && file.size >= this.size) {
        const size = this.formatFileSize(this.size)
        this.$message.error(`上传图片大小不能超过 ${size}`)
        return false
      }
      this.avatarLoading = true
      return true
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
    handleUpload(data) {
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
          this.$emit('input', res.data.file)
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
        const src = data.host + res.filename
        this.$emit('success', src)
        this.$emit('input', src)
      } catch (error) {
        this.avatarLoading = false
        this.$message.error('OSS 上传失败')
        console.log(error)
      }
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
