<template>
  <div class="app-container">
    <admin-user-form :id="id" />
  </div>
</template>

<script>
import AdminUserForm from './form'

export default {
  name: 'AdminUserEdit',
  components: { AdminUserForm },
  data() {
    return {
      id: this.$route.params.id
    }
  },
  created() {
  }
}
</script>
