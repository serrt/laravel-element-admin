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
          <el-input v-model="form.name" :disabled="form.name === 'admin'" />
        </el-col>
      </el-form-item>
      <el-form-item label="名称" prop="display_name">
        <el-col :sm="11">
          <el-input v-model="form.display_name" />
        </el-col>
      </el-form-item>
      <el-form-item v-if="form.name !== 'admin'" label="权限">
        <permission-tree v-if="permissions.length" :value="permissions" @update="handleCheckChange" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { update, show } from '@/api/role'
import { unique } from '@/api/web'
import PermissionTree from '@/components/PermissionTree'

export default {
  name: 'RoleEdit',
  components: { PermissionTree },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Name 必填'))
      }
      unique({ table: 'roles', unique: 'name', name: value, ignore: this.$route.params.id }).then(res => {
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
        permissions: [],
        guard_name: ''
      },
      rules: {
        username: [
          { required: true, message: '名称必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: 'Name 必填', trigger: 'blur' },
          { pattern: /^[\w|_|-]+$/, message: '只能由 字母, 数字, _, - 组成', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ]
      },
      permissions: []
    }
  },
  created() {
    if (this.$route.params.id) {
      show(this.$route.params.id, { include: ['permissions'] }).then(res => {
        if (res.code === 200) {
          this.form = res.data
          const permissionIds = []
          const _permissions = []
          res.data.permissions.map(item => {
            _permissions.push(item.id)
            _permissions.push(item.pid)
            permissionIds.push(item.id)
          })
          this.form.permissions = permissionIds
          for (let i = 0; i < _permissions.length; i++) {
            let count = 0
            for (let j = 0; j < _permissions.length; j++) {
              if (_permissions[i] === _permissions[j]) {
                count++
                if (count > 1) {
                  break
                }
              }
            }
            if (count === 1) {
              this.permissions.push(_permissions[i])
            }
          }
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  methods: {
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
    },
    handleCheckChange(ids) {
      this.form.permissions = ids
    }
  }
}
</script>
