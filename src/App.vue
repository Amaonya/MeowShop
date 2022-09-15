<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
#nprogress .bar {
  background: #6968d7 !important;
}

#nprogress .spinner-icon{
  border-top-color: #f0f0fb !important;
  border-left-color: #f0f0fb !important;
}
</style>
