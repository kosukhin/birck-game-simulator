<template>
  <div class="game screen">
    <el-empty
      :description="
        $services.lang.t('Failed to load the game') +
        ' ' +
        $services.lang.t('choose another one, please')
      "
    />
  </div>
</template>
