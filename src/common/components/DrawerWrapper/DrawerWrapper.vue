<template>
  <div>
    <!-- <el-drawer
      v-for="(drawerValue, drawerName) in drawersHash"
      :key="drawerName"
      :direction="drawersHashNotReactive[drawerName].direction"
      :model-value="drawerValue"
      :size="$services.device.isMobile() ? '100%' : '30%'"
      @closed="closed(drawerName)"
    >
      <div>
        <component
          :is="drawersHashNotReactive[drawerName].component()"
          :options="drawersHashNotReactive[drawerName].options"
        />
      </div>
    </el-drawer> -->
  </div>
</template>

<script lang="ts" setup></script>
