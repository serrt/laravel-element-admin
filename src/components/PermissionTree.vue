<template>
  <el-tree
    :data="data"
    :default-expand-all="true"
    :props="defaultProps"
    :default-checked-keys="value"
    node-key="id"
    show-checkbox
    @check-change="handleCheckChange"
  />
</template>

<script>
import { tree } from '@/api/permission'

export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      data: [],
      defaultProps: { children: 'children', label: 'display_name' }
    }
  },
  created() {
    tree().then(res => {
      if (res.code === 200) {
        this.data = res.data
      } else {
        this.$message.error(res.message)
      }
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      this.$emit('handleCheckChange', data, checked, indeterminate)
    }
  }
}
</script>
