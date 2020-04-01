<template>
  <el-upload
    v-loading="avatarLoading"
    accept="image/*"
    :data="{path: path}"
    :action="baseUri"
    :headers="headers"
    :show-file-list="false"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :before-upload="beforeUpload"
  >
    <img v-if="src" :src="src" class="avatar">
    <i v-else class="el-icon-folder-opened avatar-uploader-icon" />
  </el-upload>
</template>
<script>
import { getToken } from '@/utils/auth'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: 'uploads'
    },
    size: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + getToken()
      },
      baseUri: process.env.VUE_APP_BASE_API + '/admin/upload',
      avatarLoading: false,
      src: this.value
    }
  },
  watch: {
    value: function(newValue, oldValue) {
      this.src = newValue
    }
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
      this.avatarLoading = true
      if (this.size && file.size >= this.size) {
        this.avatarLoading = false
        const size = this.formatFileSize(this.size)
        this.$message.error(`上传图片大小不能超过 ${size}`)
        return false
      }
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
    }
  }
}
</script>

<style>
.avatar {
  max-width: 300px;
  max-height: 300px
}
</style>
