<template>
  <el-breadcrumb
    v-show="breadcrumbs.length > 1"
    class="breadcrumbs"
    separator="/"
  >
    <el-breadcrumb-item
      v-for="link in breadcrumbs"
      :key="link.link"
      :to="link.link"
      >{{ link.text() }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
const breadcrumbs: any[] = []
</script>

<style lang="scss" scoped>
.breadcrumbs {
  margin: 20px 0 40px;
}
</style>
