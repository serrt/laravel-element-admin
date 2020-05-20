<template>
  <div>
    <el-button type="button" @click="dialogVisible = true">文件选择</el-button>
    <el-dialog :visible.sync="dialogVisible" @close="handleDialogClose">
      <el-tabs v-model="activeModel" type="border-card" @tab-click="handleTabChange">
        <el-tab-pane label="上传文件" name="upload">
          <upload-file ref="upload" :limit="1" :accept="accept" @success="success" />
        </el-tab-pane>
        <el-tab-pane label="浏览文件" name="browse">
          <el-card shadow="never" class="media-browse">
            <div slot="header">
              <div class="el-breadcrumb">
                <span v-for="(item, index) in breadcrumb" :key="index" class="el-breadcrumb__item" @click="handleBreadcrumb(index)">
                  <span class="el-breadcrumb__inner">{{ item.text }}</span>
                  <i class="el-breadcrumb__separator el-icon-arrow-right" />
                </span>
              </div>
            </div>
            <div v-if="list.length === 0">没有文件</div>
            <ul v-if="list.length > 0" class="file-list">
              <li
                v-for="(item, index) in list"
                :key="index"
                class="file-list-item"
                :class="{active: activeIndex === index}"
                @click="handleActive(index)"
                @dblclick="handleDblclick(index)"
              >
                <div class="file-header">
                  <el-image v-if="item.type == 'image'" :src="item.url" />
                  <svg-icon v-if="item.type !== 'image'" :icon-class="typeIcon[item.type]" />
                </div>
                <div class="file-body">
                  <div class="file-name">{{ item.filename }}</div>
                </div>
              </li>
            </ul>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="网络文件" name="link">
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="url">
              <el-input v-model="form.url" placeholder="文件链接">
                <el-button slot="append" @click="onSubmit">提取</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile'
import { files } from '@/api/media'

export default {
  name: 'MediaFile',
  components: { UploadFile },
  props: {
    // image: 图片
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeModel: 'link',
      // 文件浏览
      list: [],
      typeIcon: {
        'dir': 'folder',
        'file': 'file',
        'video': 'video'
      },
      breadcrumb: [
        { path: '/', text: '媒体库' }
      ],
      activeIndex: null,
      active: null,
      // 输入的链接
      form: {
        url: ''
      },
      rules: {
        url: [
          { required: true, type: 'url', message: '请填写有效的文件链接', trigger: 'submit' }
        ]
      }
    }
  },
  computed: {
    accept() {
      let types = []
      if (this.type) {
        types = this.type.split(',')
      }
      const typeToMime = {
        image: 'image/*'
      }
      const mime = []
      for (let i = 0; i < types.length; i++) {
        mime.push(typeToMime[types[i]])
      }
      return mime
    }
  },
  created() {},
  methods: {
    getFiles() {
      const params = {
        folder: this.currentPath(),
        type: this.type
      }
      files(params).then(res => {
        if (res.code === 200) {
          this.list = res.data
          this.active = null
        } else {
          this.$message.error()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    currentPath() {
      return this.breadcrumb[this.breadcrumb.length - 1].path
    },
    handleBreadcrumb(index) {
      const item = this.breadcrumb.slice(0, index + 1)
      this.breadcrumb = item
      this.activeIndex = null
      this.active = null
      this.getFiles()
    },
    handleTabChange(tab, event) {
      if (tab.name === 'browse') {
        this.getFiles()
      }
    },
    handleActive(index) {
      const item = this.list[index]
      this.activeIndex = index
      this.active = item
    },
    handleDblclick(index) {
      const item = this.list[index]
      if (item.type === 'dir') {
        this.breadcrumb.push({ path: item.path, text: item.basename })
        this.active = null
        this.activeIndex = null
        this.getFiles()
      } else {
        this.success(item.url)
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.success(this.form.url)
        }
      })
    },
    handleDialogClose() {
      this.$refs['upload'].clear()
      this.form.url = ''
    },
    success(url) {
      this.dialogVisible = false
      this.$emit('success', url)
    }
  }
}
</script>
<style scoped>
.media-browse .el-form-item {
  margin-bottom: 0;
}
.media-browse .el-button+.el-button {
  margin-left: 0;
}
.media-browse  .el-breadcrumb__item .el-breadcrumb__inner:hover {
  color: #409EFF;
  cursor: pointer;
  text-decoration: underline;
}

.media-browse .file-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.media-browse .file-list .file-list-item {
  margin: 0 5px;
  padding: 5px 5px;
  display: inline-block;
  width: 120px;
}

.media-browse .file-list-item.active {
  background-color: rgba(143, 131, 131, .3);
  border-radius: 5px;
}

.media-browse .file-header {
  text-align: center;
}
.media-browse .file-header .svg-icon {
  font-size: 70px;
  color: #409EFF
}

.media-browse .file-header .el-image {
  width: 70px;
  height: 70px;
}
.media-browse .file-body {
  text-align: center;
}

.media-browse .file-name {
  line-height: 1.2rem;
  height: 40px;
  overflow: hidden;
}

.media-browse .preview .el-card__header {
  text-align: center;
}
.media-browse .preview .el-card__header i {
  font-size: 100px;
}
</style>
