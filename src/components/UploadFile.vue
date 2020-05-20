<template>
  <el-upload
    ref="upload"
    v-loading="loading"
    drag
    :action="baseUri"
    :show-file-list="showFileList"
    :multiple="multiple"
    :limit="limit"
    :before-upload="handleBeforeUpload"
    :on-exceed="handleExceed"
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
      baseUri: ''
    }
  },
  created() {},
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
            this.$emit('success', res.data.file)
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
        const res = await ossUpload(data)
        this.loading = false
        this.$emit('success', data.host + res.filename)
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

