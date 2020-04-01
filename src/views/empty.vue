<template>
  <!-- <keep-alive :include="/Index|Empty/">
    <router-view :key="key" />
  </keep-alive> -->
  <router-view :key="key" />
</template>

<script>
export default {
  name: 'Empty',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>
