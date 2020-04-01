<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="Guard">
        <el-radio-group v-model="form.guard_name">
          <el-radio label="admin">Admin</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上级" prop="role">
        <el-col :sm="11">
          <el-select
            v-model="form.pid"
            remote
            filterable
            clearable
            :loading="selectLoading"
            :remote-method="getPermissions"
            placeholder="请选择"
          >
            <el-option v-for="item in permissions" :key="item.id" :label="item.display_name" :value="item.id" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-col :sm="11">
          <el-input v-model="form.name" :disabled="form.name === 'admin'" />
        </el-col>
      </el-form-item>
      <el-form-item label="名称" prop="display_name">
        <el-col :sm="11">
          <el-input v-model="form.display_name" />
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
import { update, show, list } from '@/api/permission'
import { unique } from '@/api/web'

export default {
  name: 'PermissionEdit',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Name 必填'))
      }
      unique({ table: 'permissions', unique: 'name', name: value, ignore: this.$route.params.id }).then(res => {
        if (res.code !== 200) {
          callback(new Error(res.message))
        } else {
          callback()
        }
      })
    }
    return {
      formLoading: false,
      form: {
        guard_name: 'admin',
        display_name: '',
        name: '',
        pid: ''
      },
      rules: {
        username: [
          { required: true, message: '名称必填', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        display_name: [{ required: true, message: 'Name 必填', trigger: 'blur' }]
      },

      permissions: [],
      selectLoading: false
    }
  },
  created() {
    if (this.$route.params.id) {
      show(this.$route.params.id, { include: ['parent'] }).then(res => {
        if (res.code === 200) {
          this.form = res.data
          this.permissions = [res.data.parent]
          this.getPermissions()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  methods: {
    getPermissions(key) {
      this.selectLoading = true
      list({ search: key }).then(res => {
        this.selectLoading = false
        if (res.code === 200) {
          this.permissions = res.data
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
            }
          }).catch(error => {
            console.log(error)
            this.formLoading = false
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
</style>
