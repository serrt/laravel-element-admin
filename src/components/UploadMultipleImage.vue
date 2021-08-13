<template>
  <div>
    <el-upload
      v-loading="avatarLoading"
      :accept="accept"
      list-type="picture-card"
      action=""
      :limit="limit"
      :file-list="fileList"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
      multiple
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { upload } from '@/api/web'
import { config, upload as ossUpload } from '@/api/oss'
import { generateFileName } from '@/utils'

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
    },
    disk: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      avatarLoading: false,
      fileList: [],
      // 图片预览
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  watch: {
    list(newValue) {
      const list = []
      for (let i = 0; i < newValue.length; i++) {
        const item = newValue[i]
        const itemSplit = item.split('/')
        list.push({ name: itemSplit[itemSplit.length - 1], url: item })
      }
      this.fileList = list
    }
  },
  methods: {
    handleSuccess(res, file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleError(error, file, fileList) {
      console.log(error)
    },
    beforeUpload(file) {
      if (this.size && file.size >= this.size) {
        const size = this.formatFileSize(this.size)
        this.$message.error(`上传图片大小不能超过 ${size}`)
        return false
      }
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
    handleUpload(data) {
      if (this.upload) {
        this.upload(data.file)
        return
      }
      if (this.disk === 'oss') {
        this.handleUploadOss(data)
        return
      }
      const formData = new FormData()
      formData.append('path', this.path)
      formData.append('file', data.file)
      this.avatarLoading = true
      upload(formData).then(res => {
        this.avatarLoading = false
        if (res.code === 200) {
          data.onSuccess(res.data.file)
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        this.avatarLoading = false
        console.log(error)
      })
    },
    async handleUploadOss(data) {
      const file = data.file
      this.avatarLoading = true
      try {
        const response = await config({ path: this.path })
        if (response.code !== 200) {
          this.$message.error(response.message)
          return false
        }
        const configData = response.data
        configData.file = file
        configData.key = generateFileName(configData.file, configData.dir)
        await ossUpload(configData)
        this.avatarLoading = false
        data.onSuccess(configData.domain + '/' + configData.key)
      } catch (error) {
        console.log(error)
        this.avatarLoading = false
        this.$message.error('OSS 上传失败')
      }
    },
    getFileList() {
      return this.fileList.map(item => {
        return item.response ? item.response : item.url
      })
    }
  }
}
</script>
