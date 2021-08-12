<template>
  <el-form v-loading="loading" class="app-container" label-width="120px" size="mini">
    <el-descriptions title="基本信息" :border="true">
      <template slot="extra">
        <el-switch v-model="info.status" @change="handleSwitchChange" />
      </template>
      <el-descriptions-item label="用户名">
        <el-avatar v-if="info.avatar" :src="info.avatar" />
        {{ info.username }}
      </el-descriptions-item>
      <el-descriptions-item label="姓名">{{ info.name }}</el-descriptions-item>
      <el-descriptions-item label="注册时间">{{ info.created_at | parseTime }}</el-descriptions-item>
      <el-descriptions-item label="角色" :span="3">
        <el-tag v-for="item in info.roles" :key="item.id" size="small">{{ item.display_name }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="权限" :span="3">
         <permission-tree :value="permissionIds" :check="false" />
      </el-descriptions-item>
    </el-descriptions>
    <el-form-item style="margin-top: 20px;">
      <el-button type="default" size="default" @click="handleBack">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { get, put } from '@/api'
import PermissionTree from '@/components/PermissionTree'

export default {
  name: 'AdminUserShow',
  components: { PermissionTree },
  data() {
    return {
      loading: false,
      id: this.$route.params.id,
      info: {},
      permissionIds: []
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      this.loading = true
      const res = await get(`admin/admin-user/${this.id}`, { include: 'roles' })
      if (res.code === 200) {
        this.info = res.data
      }
      const res2 = await get(`admin/admin-user/${this.id}/permissions`)
      if (res2.code === 200) {
        this.permissionIds = res2.data.map(item => {
          return item.id
        })
      }
      this.loading = false
    },
    handleSwitchChange(status) {
      put(`admin/admin-user/${this.id}`, { status }).then(res => {
        if (res.code !== 200) {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleBack() {
      this.$router.back()
    }
  }
}
</script>

