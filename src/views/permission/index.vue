<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'PermissionCreate'})">添加权限</el-button>
    <el-table v-loading="listLoading" :data="list" :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column align="center" label="ID" prop="id" sortable="custom" />
      <el-table-column align="center" label="Guard" prop="guard_name" />
      <el-table-column align="center" label="上级" prop="pid">
        <template slot-scope="scope">
          {{ scope.row.parent.display_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="display_name" />
      <el-table-column align="center" label="创建时间" prop="created_at" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.created_at | parseTime }}
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <form @submit.prevent="fetchData">
            <el-input :key="scope.$index" v-model="search" type="search" size="mini" placeholder="输入关键字搜索" />
          </form>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" :loading="buttonLoading" :disabled="scope.row.name === 'admin'" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
import { list, destroy } from '@/api/permission'

export default {
  name: 'PermissionIndex',
  data() {
    return {
      search: '',
      list: null,
      listLoading: false,
      pagination: {
        per_page: 10,
        current_page: 1,
        total: 0
      },
      defaultSort: { prop: 'created_at', order: 'descending' },
      sort: null,
      buttonLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true

      const params = {
        per_page: this.pagination.per_page,
        page: this.pagination.current_page,
        search: this.search,
        include: ['parent']
      }

      if (this.sort) {
        params.order = this.sort.prop
        params._order = this.sort.order === 'ascending' ? 'asc' : 'desc'
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
