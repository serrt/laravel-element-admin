<template>
  <el-tree
    :data="data"
    :props="defaultProps"
    :default-checked-keys="value"
    node-key="id"
    show-checkbox
    @check="handleCheck"
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
    handleCheck(item, data) {
      const ids = []
      data.halfCheckedNodes.map(node => {
        ids.push(node.id)
      })
      data.checkedNodes.map(node => {
        ids.push(node.id)
      })
      this.$emit('update', ids)
    }
  }
}
</script>
