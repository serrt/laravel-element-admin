<template>
  <transition name="fade-transform" mode="out-in">
    <router-view :key="$route.fullPath" />
  </transition>

  <!-- 使用 meta.cache 缓存页面; 组件刷新事件 activated -->
  <!-- <div>
    <keep-alive>
      <router-view v-if="$route.meta && $route.meta.cache" :key="$route.fullPath" />
    </keep-alive>
    <router-view v-if="!($route.meta && $route.meta.cache)" :key="$route.fullPath" />
  </div> -->
</template>

<script>
export default {
  name: 'Empty'
}
</script>
