<template>
  <div class="app-container">
    <el-form :model="form" size="small" :inline="true" @keydown.native.enter.prevent="fetchData(true)">
      <el-form-item label="关键字">
        <el-input v-model="form.key" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData(true)">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'RoleCreate'})">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" @sort-change="handleSortChange">
      <el-table-column align="center" label="ID" prop="id" sortable="custom" />
      <el-table-column align="center" label="Name" prop="name" sortable="custom" />
      <el-table-column align="center" label="名称" prop="display_name" />
      <el-table-column align="center" label="创建时间" prop="created_at" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.created_at | parseTime }}
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" :disabled="scope.row.name === 'admin'" :loading="buttonLoading" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :page-size="pagination.per_page"
      :total="pagination.total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { list, destroy } from '@/api/role'
import { EmptyFilter } from '@/utils'

export default {
  name: 'RoleIndex',
  data() {
    return {
      form: {
        key: ''
      },
      list: null,
      listLoading: false,
      pagination: {
        per_page: 10,
        current_page: 1,
        total: 0
      },
      sort: null,
      buttonLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(refresh) {
      if (refresh) {
        this.pagination.current_page = 1
      }
      this.listLoading = true

      const params = Object.assign(EmptyFilter(this.form), {
        per_page: this.pagination.per_page,
        page: this.pagination.current_page
      })

      if (this.sort) {
        params.sort = this.sort.prop
        params.sort_by = this.sort.order === 'ascending' ? 'asc' : 'desc'
      }

      list(params).then(res => {
        this.listLoading = false
        if (res.code === 200) {
          this.list = res.data
          res.meta.per_page = parseInt(res.meta.per_page)
          this.pagination = res.meta
        } else {
          this.$message.error(res.message)
        }
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      })
    },

    handlePageChange(page) {
      this.pagination.current_page = page
      this.fetchData()
    },

    handleSortChange(data) {
      if (data.order) {
        this.sort = data
      } else {
        this.sort = null
      }
      this.fetchData()
    },

    handleEdit(index, row) {
      this.$router.push({ name: 'RoleEdit', params: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否确定?', '删除该角色').then(() => {
        this.buttonLoading = true
        destroy(row.id).then(res => {
          this.buttonLoading = false
          if (res.code === 200) {
            this.list.splice(index, 1)
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
