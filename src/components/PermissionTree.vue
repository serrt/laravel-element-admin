<template>
  <el-tree
    ref="tree"
    :data="data"
    :props="defaultProps"
    node-key="id"
    show-checkbox
    highlight-current
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
        setTimeout(() => {
          this.$refs['tree'].setCheckedKeys(this.filterKeys(this.value))
        }, 1000)
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
    },
    filterKeys(keys) {
      const newKeys = []
      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i]
        if (keys.includes(item.id)) {
          let is_check = true
          for (let k = 0; k < item.children.length; k++) {
            const subItem = item.children[k]
            is_check = keys.includes(subItem.id)
            if (is_check) {
              newKeys.push(subItem.id)
            }
          }
          if (is_check) {
            newKeys.push(item.id)
          }
        }
      }
      return newKeys
    }
  }
}
</script>
