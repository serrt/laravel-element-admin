<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" size="small" :model="form" :rules="rules" label-width="80px">
      <el-form-item>
        <upload-image v-model="form.avatar" path="avatar" :size="1024 * 1024" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-col :sm="11">
          <el-input v-model="form.username" disabled="disabled" />
        </el-col>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-col :sm="11">
          <el-input v-model="form.name" />
        </el-col>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-col :sm="11">
          <el-input v-model="form.password" type="password" show-password />
        </el-col>
      </el-form-item>
      <el-form-item label="编辑器">
        <editor v-model="content" disk="oss" />
        {{ content }}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo } from '@/api/auth'
import UploadImage from '@/components/UploadImage'
import Editor from '@/components/Editor'

export default {
  name: 'Profile',
  components: { UploadImage, Editor },
  data() {
    return {
      formLoading: false,
      form: {
        username: '',
        name: '',
        avatar: ''
      },
      info: {},
      rules: {
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        password: [{ min: 6, message: '密码最少6位', trigger: 'blur' }]
      },
      content: '1234'
    }
  },
  mounted() {
    this.getUserProfile()
  },
  methods: {
    getUserProfile() {
      getInfo().then(res => {
        if (res.code === 200) {
          this.info = res.data
          const { username, name, avatar } = this.info
          this.form = { username, name, avatar }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.formLoading = true
          this.$store.dispatch('user/updateInfo', this.form).then(data => {
            this.formLoading = false
            this.$message.success('保存成功')
          })
        }
      })
    }
  }
}
</script>
