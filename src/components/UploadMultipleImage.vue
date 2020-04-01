<template>
  <div>
    <el-upload
      v-loading="avatarLoading"
      :accept="accept"
      list-type="picture-card"
      :data="{path: path}"
      :action="baseUri"
      :headers="headers"
      :limit="limit"
      :file-list="fileList"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-preview="handlePictureCardPreview"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'

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
      default: 0
    },
    // 文件个数限制
    limit: {
      type: Number,
      default: 0
    },
    // 默认图片
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 文件类型
    accept: {
      type: String,
      default: 'image/*'
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
      fileList: [],
      // 图片预览
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  watch: {
    list(value) {
      const fileList = []
      for (let i = 0; i < value.length; i++) {
        fileList.push({
          url: value[i]
        })
      }
      this.fileList = fileList
    }
  },
  methods: {
    handleSuccess(res, file, fileList) {
      this.avatarLoading = false
      this.$emit('change', fileList.map(item => {
        return item.response.data.file
      }))
    },
    handleRemove(file, fileList) {
      this.$emit('change', fileList.map(item => {
        return item.response.data.file
      }))
    },
    handleError(error, file, fileList) {
      this.avatarLoading = false
      console.log('error')
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
    handleExceed(file, fileList) {
      this.$message.error(`最多上传${this.limit}张`)
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    getFileList(fileList) {
      return fileList.map(item => {
        return item.response.data.file
      })
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
