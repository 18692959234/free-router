<template>
  <div class="id">
    group/user/:id页面，动态路由
    <div>userid为：{{$route.params.id}}</div>
  </div>
</template>
<script>
export default {
  name: 'id'
}
</script>
