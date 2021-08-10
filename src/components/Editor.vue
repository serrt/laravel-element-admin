<template>
  <div id="wang-editor" v-loading="loading" />
</template>

<script>
import E from 'wangeditor'
import { upload } from '@/api/web'
import { config, upload as ossUpload } from '@/api/oss'
import { generateFileName } from '@/utils'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: 'editor'
    },
    disk: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      loading: true
    }
  },
  watch: {
    value(newValue) {
      if (this.editor) {
        this.editor.txt.html(newValue)
      }
    }
  },
  mounted() {
    const editor = new E(`#wang-editor`)

    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.$emit('input', newHtml)
    }

    editor.config.customUploadImg = (resultFiles, insertImgFn) => {
      if (this.disk === 'oss') {
        this.loading = true
        for (let i = 0; i < resultFiles.length; i++) {
          config({ path: this.path }).then(res => {
            this.loading = false
            if (res.code === 200) {
              const data = res.data
              data.file = resultFiles[i]
              data.key = generateFileName(data.file, data.dir)
              ossUpload(data).then(res2 => {
                console.log(res2)
                insertImgFn(data.domain + '/' + data.key)
              }).catch(error => {
                this.loading = false
                console.log(error)
                this.$message.error('oss 上传失败')
              })
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            this.loading = false
            console.log(error)
            this.$message.error('oss 签名失败')
          })
        }
      } else {
        const formData = new FormData()
        for (let i = 0; i < resultFiles.length; i++) {
          formData.append('files[]', resultFiles[i])
        }
        this.loading = true
        upload(formData).then(res => {
          this.loading = false
          if (res.code === 200) {
            res.data.files.forEach(item => {
              insertImgFn(item)
            })
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      }
    }

    // 创建编辑器
    editor.create()

    if (this.value) {
      editor.txt.html(this.value)
    }

    this.editor = editor
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  methods: {
  }
}
</script>
