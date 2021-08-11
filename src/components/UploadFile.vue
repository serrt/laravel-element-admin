<template>
  <el-upload
    ref="upload"
    v-loading="loading"
    drag
    action=""
    :show-file-list="showFileList"
    :file-list="fileList"
    :multiple="multiple"
    :limit="limit"
    :before-upload="handleBeforeUpload"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
    :http-request="handleUpload"
  >
    <i class="el-icon-upload" />
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip">{{ tip }}</div>
  </el-upload>
</template>

<script>
import { upload } from '@/api/web'
import { config, upload as ossUpload } from '@/api/oss'
import { generateFileName } from '@/utils'

export default {
  name: 'UploadFile',
  props: {
    // 提示文本
    tip: {
      type: String,
      default: null
    },
    // 上传的目录
    path: {
      type: String,
      default: 'uploads'
    },
    // 是否允许多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 限制文件大小(单位: Byte)
    size: {
      type: Number,
      default: null
    },
    // 允许的文件个数
    limit: {
      type: Number,
      default: null
    },
    // 允许的文件类型 MIME_type(https://www.freeformatter.com/mime-types-list.html)
    accept: {
      type: Array,
      default: null
    },
    // 默认值
    value: {
      type: Array,
      default: null
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    // OSS: 上传至OSS(需要实现 api/oss)
    disk: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      fileList: []
    }
  },
  watch: {
    value(newValue) {
      const list = []
      if (newValue) {
        for (let i = 0; i < newValue.length; i++) {
          const item = newValue[i]
          const itemSplit = item.split('/')
          list.push({ name: itemSplit[itemSplit.length - 1], url: item })
        }
      }
      this.fileList = list
    }
  },
  methods: {
    handleBeforeUpload(file) {
      if (this.size && file.size >= this.size) {
        const size = this.formatFileSize(this.size)
        this.$message.error(`上传图片大小不能超过 ${size}`)
        return false
      }
      if (file.type && !this.checkMimeType(file.type)) {
        this.$message.error('上传的文件格式不对')
        return false
      }
      return true
    },
    handleExceed(files, fileList) {
      this.$message.error(`最多上传 ${this.limit} 个文件`)
    },
    handleRemove(files, fileList) {
      console.log(fileList)
    },
    handlePreview(file) {
      if (file.url) {
        window.open(file.url, '_blank')
      }
    },
    handleUpload(data) {
      if (this.disk === 'oss') {
        this.handleUploadOss(data.file)
      } else {
        const formData = new FormData()
        formData.append('path', this.path)
        formData.append('file', data.file)
        this.loading = true
        upload(formData).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.uploadSuccess(res.data.file)
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      }
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
        data.key = generateFileName(data.file, data.dir)
        await ossUpload(data)
        this.loading = false
        this.uploadSuccess(data.domain + '/' + data.key)
      } catch (error) {
        this.loading = false
        this.$message.error('OSS 上传失败')
        console.log(error)
      }
    },
    // 解析XML
    parseXml(text) {
      try {
        const result = {}
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text.trim(), 'text/xml')
        if (xmlDoc.getElementsByTagName('Error').length > 0) {
          const element = xmlDoc.getElementsByTagName('Error')[0]
          for (let i = 0; i < element.children.length; i++) {
            const item = element.children[i]
            result[item.tagName] = item.innerHTML
          }
        }
        return result
      } catch (error) {
        console.log(error)
      }
    },
    uploadSuccess(url) {
      this.$emit('success', url)
    },
    checkMimeType(type) {
      if (this.accept && this.accept.length > 0) {
        for (let i = 0; i < this.accept.length; i++) {
          const reg = new RegExp(`^${this.accept[i]}`)
          if (!reg.test(type)) {
            return false
          }
        }
        return true
      }
      return true
    },
    clear() {
      this.$refs['upload'].clearFiles()
    }
  }
}
</script>

