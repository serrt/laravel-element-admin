<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="头像">
        <el-col :sm="11">
          <upload-image :value="form.avatar" path="avatar" @success="handleAvatarSuccess" />
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
          <el-input v-model="form.password" type="password" />
        </el-col>
      </el-form-item>
      <el-form-item label="权限">
        <permission-tree :value="form.permissions" @handleCheckChange="handleCheckChange" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { update, show } from '@/api/adminUser'
import { unique } from '@/api/web'
import { list } from '@/api/role'
import PermissionTree from '@/components/PermissionTree'
import UploadImage from '@/components/UploadImage'

export default {
  name: 'AdminUserEdit',
  components: { PermissionTree, UploadImage },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名必填'))
      }
      unique({ table: 'admin_users', unique: 'username', username: value, ignore: this.$route.params.id }).then(res => {
        if (res.code !== 200) {
          callback(new Error(res.message))
        } else {
          callback()
        }
      }).catch(error => {
        console.log(error)
      })
    }
    return {
      formLoading: false,
      form: {
        username: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: []
      },
      rules: {
        username: [
          { required: true, message: '用户名必填', trigger: 'blur' },
          { pattern: /^[\w|_|-]+$/, message: '只能由 字母, 数字, _, - 组成', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        password: [
          { min: 6, message: '密码最少6位', trigger: 'blur' }
        ]
      },
      roles: [],
      selectLoading: false
    }
  },
  created() {
    if (this.$route.params.id) {
      show(this.$route.params.id, { include: ['roles', 'permissions'] }).then(res => {
        if (res.code === 200) {
          const data = res.data
          const roleOptions = data.roles
          const roleIds = []
          for (let i = 0; i < data.roles.length; i++) {
            roleIds.push(data.roles[i].id)
          }
          data.roles = roleIds

          // format permissions
          const permissions = []
          for (let i = 0; i < data.permissions.length; i++) {
            permissions.push(data.permissions[i].id)
          }
          data.permissions = permissions

          this.form = data
          this.roles = roleOptions
          this.getRoles()
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  methods: {
    handleAvatarSuccess(file) {
      this.form.avatar = file
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
          update(this.form).then(res => {
            this.formLoading = false
            if (res.code === 200) {
              this.$message.success('修改成功')
              this.$router.back()
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            console.log(error)
            this.formLoading = false
          })
        }
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      const index = this.form.permissions.indexOf(data.id)
      if (checked || indeterminate) {
        if (index === -1) {
          this.form.permissions.push(data.id)
        }
      } else {
        if (index !== -1) {
          this.form.permissions.splice(index, 1)
        }
      }
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

