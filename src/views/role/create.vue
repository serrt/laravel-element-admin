<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="Guard">
        <el-radio-group v-model="form.guard_name">
          <el-radio label="admin">Admin</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-col :sm="11">
          <el-input v-model="form.name" />
        </el-col>
      </el-form-item>
      <el-form-item label="名称" prop="display_name">
        <el-col :sm="11">
          <el-input v-model="form.display_name" />
        </el-col>
      </el-form-item>
      <el-form-item label="权限">
        <permission-tree @handleCheckChange="handleCheckChange" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { create } from '@/api/role'
import { unique } from '@/api/web'
import PermissionTree from '@/components/PermissionTree'

export default {
  name: 'RoleCreate',
  components: { PermissionTree },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Name 必填'))
      }
      unique({ table: 'roles', unique: 'name', name: value }).then(res => {
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
        display_name: '',
        name: '',
        guard_name: 'admin',
        permissions: []
      },
      rules: {
        display_name: [{ required: true, message: '名称必填', trigger: 'blur' }],
        name: [
          { required: true, message: 'Name 必填', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.formLoading = true
          create(this.form).then(res => {
            this.formLoading = false
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.$router.back()
            }
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
