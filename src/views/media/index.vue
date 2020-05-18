<template>
  <div class="app-container">
    <el-card shadow="never">
      <div slot="header">
        <div class="el-breadcrumb">
          <span v-for="(item, index) in breadcrumb" :key="index" class="el-breadcrumb__item" @click="handleBreadcrumb(index)">
            <span class="el-breadcrumb__inner">{{ item.text }}</span>
            <i class="el-breadcrumb__separator el-icon-arrow-right" />
          </span>
        </div>
        <input id="input-file" type="file" name="file" style="display: none" multiple @change="fileChange">
        <el-button-group>
          <el-button type="primary" size="medium" icon="el-icon-upload" @click="fileChoose">上传</el-button>
          <el-button type="primary" size="medium" icon="el-icon-folder-add" @click="handleAddFolder">添加目录</el-button>
        </el-button-group>
        <el-button-group v-if="activeIndex !== null">
          <el-button size="medium" type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        </el-button-group>
      </div>
      <el-row>
        <el-col :lg="18" :sm="12" :xs="12">
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
        </el-col>
        <el-col :lg="6" :sm="12" :xs="12">
          <el-card v-if="active" class="preview">
            <i v-if="active.type === 'dir'" slot="header" class="el-icon-folder" />
            <i v-if="active.type === 'file'" slot="header" class="el-icon-document" />
            <video v-if="active.type === 'video'" :src="active.url" width="100%" />
            <el-image v-if="active.type === 'image'" :src="active.url" style="width: 150px" />
            <el-form label-suffix=":">
              <el-form-item label="名称">{{ active.filename }}</el-form-item>
              <el-form-item label="类型">{{ active.type }}</el-form-item>
              <el-form-item v-if="active.size" label="大小">
                {{ active.size | formatSize }}
              </el-form-item>
              <el-form-item v-if="active.url" label="URL">
                <el-link type="primary" :underline="false" @click="openLink(active.url)">点击打开</el-link>
                <el-tooltip content="点击复制" placement="top">
                  <el-button type="primary" size="mini" class="el-icon-document-copy" @click="handleCopy(active.url,$event)" />
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { files, upload, addFolder, deleteFolder, deleteFiles } from '@/api/media'
import clip from '@/utils/clipboard'

export default {
  name: 'MediaIndex',
  data() {
    return {
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
      active: null
    }
  },
  created() {
    this.getFiles()
  },
  methods: {
    currentPath() {
      return this.breadcrumb[this.breadcrumb.length - 1].path
    },
    getFiles() {
      const params = {
        folder: this.currentPath()
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
        this.openLink(item.url)
      }
    },
    handleBreadcrumb(index) {
      const item = this.breadcrumb.slice(0, index + 1)
      this.breadcrumb = item
      this.activeIndex = null
      this.active = null
      this.getFiles()
    },
    handleAddFolder() {
      this.$prompt('请填写目录名', '添加目录', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '请填写目录名'
          }
          return true
        }
      }).then(result => {
        addFolder({ path: this.currentPath() + '/' + result.value }).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.getFiles()
          } else {
            this.$message.error(res.message)
          }
        }).then(error => {
          console.log(error)
        })
      }).catch(() => {})
    },
    handleDelete() {
      if (!this.active) {
        return
      }
      if (this.active.type === 'dir') {
        this.$confirm('删除目录会删除下面的所有文件, 且不可恢复, 是否确定?', '删除目录', { confirmButtonText: '确认', cancelButtonText: '取消' }).then(() => {
          deleteFolder({ path: this.active.path }).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getFiles()
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
      } else {
        this.$confirm('删除文件后, 且不可恢复, 是否确定?', '删除文件').then(() => {
          deleteFiles({ path: this.active.path }).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getFiles()
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
      }
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    openLink(url) {
      window.open(url)
    },
    fileChoose() {
      document.getElementById('input-file').click()
    },
    fileChange(e) {
      const files = e.target.files
      if (files.length > 0) {
        const form = new FormData()
        form.append('path', this.currentPath())
        for (let i = 0; i < files.length; i++) {
          form.append('files[]', files[i])
        }
        upload(form).then(res => {
          if (res.code === 200) {
            this.$message.success('上传成功')
            this.getFiles()
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>
<style scoped>
.el-form-item {
  margin-bottom: 0;
}
.el-breadcrumb {
  margin-bottom: 20px
}
.el-button+.el-button {
  margin-left: 0;
}
.app-container .el-breadcrumb__item .el-breadcrumb__inner:hover {
  color: #409EFF;
  cursor: pointer;
  text-decoration: underline;
}

.file-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.file-list .file-list-item {
  margin: 0 5px;
  padding: 5px 5px;
  display: inline-block;
  width: 120px;
}

.file-list-item.active {
  background-color: rgba(143, 131, 131, .3);
  border-radius: 5px;
}

.file-header {
  text-align: center;
}
.file-header .svg-icon {
  font-size: 70px;
  color: #409EFF
}

.file-header .el-image {
  width: 70px;
  height: 70px;
}
.file-body {
  text-align: center;
}

.file-name {
  text-overflow: ellipsis;
  overflow: hidden;
}

.preview .el-card__header {
  text-align: center;
}
.preview .el-card__header i {
  font-size: 100px;
}
</style>

