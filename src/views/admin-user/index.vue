<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'AdminUserCreate'})">创建</el-button>
    <el-table v-loading="listLoading" :data="list" @sort-change="handleSortChange">
      <el-table-column align="center" label="ID" prop="id" sortable="custom" />
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <el-avatar v-if="scope.row.avatar" :src="scope.row.avatar" />
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="username" sortable="custom" />
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <el-tag v-for="(role, index) in scope.row.roles" :key="index">{{ role.display_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="handleSwitchChange($event, scope.row.id)" />
        </template>
      </el-table-column>
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
          <el-button size="mini" type="danger" :disabled="id === scope.row.id" :loading="buttonLoading" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
import { list, destroy, update } from '@/api/adminUser'
import { mapGetters } from 'vuex'

export default {
  name: 'AdminUserIndex',
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
      sort: null,
      buttonLoading: false
    }
  },
  computed: {
    ...mapGetters(['id'])
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
        include: ['roles']
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
      this.$router.push({ name: 'AdminUserEdit', params: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否确定?', '删除该用户').then(() => {
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
    },
    handleSwitchChange($event, id) {
      update({ id: id, status: $event }).then(res => {
        if (res.code !== 200) {
          this.$message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
