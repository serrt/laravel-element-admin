<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" size="small" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="头像">
        <el-col :sm="11">
          <upload-image :limit="1" path="avatar" @success="handleAvatarSuccess" />
        </el-col>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-col :sm="11">
          <el-input v-model="form.username" />
        </el-col>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-col :sm="11">
          <el-input v-model="form.name" />
        </el-col>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-col :sm="11">
          <el-select
            v-model="form.roles"
            multiple
            remote
            filterable
            :loading="selectLoading"
            :remote-method="getRoles"
            placeholder="请选择"
          >
            <el-option v-for="item in roles" :key="item.id" :label="item.display_name" :value="item.id" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-col :sm="11">
          <el-input v-model="form.password" type="password" show-password />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { create } from '@/api/adminUser'
import { unique } from '@/api/web'
import { list } from '@/api/role'
import UploadImage from '@/components/UploadImage'

export default {
  name: 'AdminUserCreate',
  components: { UploadImage },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名必填'))
      }
      unique({ table: 'admin_users', unique: 'username', username: value }).then(res => {
        if (res.code !== 200) {
          callback(new Error(res.message))
        } else {
          callback()
        }
      })
    }
    return {
      form: {
        username: '',
        name: '',
        avatar: '',
        roles: []
      },
      rules: {
        username: [
          { required: true, message: '用户名必填', trigger: 'blur' },
          { pattern: /^[\w|_|-]+$/, message: '只能由 字母, 数字, _, - 组成', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        password: [
          { required: true, message: '登录密码必填', trigger: 'blur' },
          { min: 6, message: '密码最少6位', trigger: 'blur' }
        ]
      },
      roles: [],
      selectLoading: false,
      formLoading: false
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    handleAvatarSuccess(src) {
      this.form.avatar = src
    },
    beforeAvatarUpload(file) {
      this.avatarLoading = true
      if (file.size >= 2 * 1024 * 1024) {
        this.avatarLoading = false
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return true
    },
    getRoles(key) {
      this.selectLoading = true
      list({ search: key }).then(res => {
        this.selectLoading = false
        if (res.code === 200) {
          this.roles = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        this.selectLoading = false
        console.log(error)
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.formLoading = true
          create(this.form).then(res => {
            this.formLoading = false
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.$router.back()
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            this.formLoading = false
            console.log(error)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
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
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
