<template>
  <el-form ref="form" v-loading="formLoading" size="small" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="头像">
      <el-col :sm="11">
        <upload-image v-model="form.avatar" path="avatar" />
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
    <!-- <el-form-item label="权限">
      <permission-tree :value="form.permissions" @update="handleCheckChange" />
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="$router.back()">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { update, create, show } from '@/api/admin-user'
import { unique } from '@/api/web'
import { list } from '@/api/role'
// import PermissionTree from '@/components/PermissionTree'
import UploadImage from '@/components/UploadImage'

export default {
  name: 'AdminUserForm',
  components: { UploadImage },
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
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
    if (this.id) {
      show(this.id, { include: ['roles', 'permissions'] }).then(res => {
        if (res.code === 200) {
          const data = res.data
          data.roles = data.roles.map(item => {
            return item.id
          })

          data.permissions = data.permissions.map(item => {
            return item.id
          })

          this.form = data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
      })
    }
    this.getRoles()
  },
  methods: {
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
          if (this.id) {
            this.handleUpdate()
          } else {
            this.handleCreate()
          }
        }
      })
    },
    handleUpdate() {
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
    },
    handleCreate() {
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
    },
    handleCheckChange(ids) {
      this.form.permissions = ids
    }
  }
}
</script>
<style scoped>
.el-select {
  width: 100%;
}
</style>
