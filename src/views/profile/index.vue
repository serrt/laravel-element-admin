<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="form" :rules="rules" label-width="80px">
      <el-form-item>
        <el-col :sm="11">
          <upload-image
            path="avatar"
            :value="form.avatar"
            :size="1024 * 1024"
            @success="handleAvatarSuccess"
          />
        </el-col>
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo } from '@/api/auth'
import UploadImage from '@/components/UploadImage'

export default {
  name: 'Profile',
  components: { UploadImage },
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
      }
    }
  },
  mounted() {
    this.getUserProfile()
  },
  methods: {
    getUserProfile() {
      getInfo().then(res => {
        if (res.code === 200) {
          const { username, name, avatar } = this.info = res.data
          this.form = { username, name, avatar }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleAvatarSuccess(res) {
      console.log(res)
      this.form.avatar = res
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

<style scoped>
.line{
  text-align: center;
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

