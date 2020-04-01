<template>
  <div class="app-container">
    <el-button type="danger" icon="el-icon-delete" :loading="buttonLoading" @click="handleClear">清空全部记录</el-button>
    <el-table v-loading="listLoading" :data="list" :default-sort="sort" @sort-change="handleSortChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          {{ JSON.stringify(props.row.properties) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" prop="id" sortable="custom" />
      <el-table-column align="center" label="操作人" prop="causer_id">
        <template v-if="scope.row.causer" slot-scope="scope">
          <el-avatar :src="scope.row.causer.avatar" />
          {{ scope.row.causer.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Description" prop="description" sortable="custom" />
      <el-table-column align="center" label="模型" prop="subject">
        <template slot-scope="scope">
          <el-tag type="success">
            {{ scope.row.subject_type }}
          </el-tag>
          <el-badge class="mark" :value="scope.row.subject_id" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="CreatedAt" prop="created_at" sortable="custom">
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
import { list, clear } from '@/api/activityLog'

export default {
  name: 'ActivityLog',
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
      sort: { prop: 'created_at', order: 'descending' },
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
        search: this.search
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
    handleClear() {
      this.$confirm('是否确定?', '清空全部记录').then(() => {
        this.buttonLoading = true
        clear().then(res => {
          this.buttonLoading = false
          if (res.code === 200) {
            this.list = []
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
