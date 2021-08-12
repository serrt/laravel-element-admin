<template>
  <div class="app-container">
    <el-button type="primary" size="small" icon="el-icon-plus" @click="$router.push({name: 'PermissionCreate'})">添加权限</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column align="left" label="名称" prop="display_name" />
      <el-table-column align="left">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" :loading="buttonLoading" :disabled="scope.row.name === 'admin'" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tree, destroy } from '@/api/permission'

export default {
  name: 'PermissionIndex',
  data() {
    return {
      list: [],
      listLoading: false,
      buttonLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true

      tree().then(res => {
        this.listLoading = false
        if (res.code === 200) {
          this.list = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      })
    },

    handleEdit(index, row) {
      this.$router.push({ name: 'PermissionEdit', params: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否确定?', '删除该权限').then(() => {
        this.buttonLoading = true
        destroy(row.id).then(res => {
          this.buttonLoading = false
          if (res.code === 200) {
            this.list.splice(index, 1)
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          this.buttonLoading = false
          console.log(error)
        })
      }).catch(() => {
      })
    }
  }
}
</script>
