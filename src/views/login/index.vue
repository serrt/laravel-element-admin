<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="off" label-position="left" @keydown.native.enter.prevent="handleLogin">

      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
      </div>

      <el-form-item prop="username">
        <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="Username" tabindex="1" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" placeholder="Password" name="password" show-password />
      </el-form-item>

      <el-form-item prop="captcha_code">
        <el-input v-model="loginForm.captcha_code" prefix-icon="el-icon-picture-outline" placeholder="输入验证码" style="width: 70%;" />
        <el-image :src="captcha.img" style="vertical-align: middle;cursor: pointer;" alt="点击刷新" title="点击刷新" @click="getCaptcha" />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { title } from '@/settings'
import { guard } from '@/utils/auth'
import { get } from '@/api'

export default {
  name: 'Login',
  data() {
    return {
      title: title,
      loginForm: {
        username: 'admin',
        password: '123456',
        guard: 'admin',
        captcha_key: '',
        captcha_code: '',
        captcha_config: 'login'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        captcha_code: [{ required: true, trigger: 'blur', message: '验证码必填' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      redirect: undefined,
      captcha: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCaptcha()
  },
  methods: {
    getCaptcha() {
      get(`captcha/api/${this.loginForm.captcha_config}`).then(res => {
        this.captcha = res
        this.loginForm.captcha_key = this.captcha.key
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const oldGuard = guard()
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            guard(this.loginForm.guard)
            if (oldGuard !== this.loginForm.guard) {
              this.$router.push({ path: '/' })
            } else {
              this.$router.push({ path: this.redirect || '/' })
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 95%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 30px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
