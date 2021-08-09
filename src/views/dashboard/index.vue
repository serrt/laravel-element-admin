<template>
  <div class="dashboard-container">
    <panel-group />
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'

export default {
  name: 'Dashboard',
  components: { PanelGroup },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  }
}
</script>
<style scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  height: calc(100vh - 50px);
}
</style>
