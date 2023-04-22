<template>
  <el-breadcrumb
    v-show="breadcrumbs.getLinks().length > 1"
    :key="breadcrumbs.renderCounter.value"
    class="breadcrumbs"
    separator="/"
  >
    <el-breadcrumb-item
      v-for="link in breadcrumbs.getLinks()"
      :key="link.link"
      :to="link.link"
      >{{ link.text() }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useService } from '~~/src/Common/Helpers/HService'
import { SBreadcrumbs } from '~~/src/Common/Services/SBreadcrumbs'

const breadcrumbs = useService<SBreadcrumbs>('breadcrumbs')
</script>

<style lang="scss" scoped>
.breadcrumbs {
  margin: 20px 0 40px;
}
</style>
