<template>
  <div>
    <h1 class="mb-4">{{ $t('Documentation') }}</h1>

    <div class="middle article">
      <p class="mb-4">
        {{ $t('There are several types of documentation in the project.') }}
      </p>
      <p class="mb-4">
        {{
          $t(
            'Documentation for the source code of the modules can be found here'
          )
        }}
        <el-link type="primary" href="/jsdocs/modules.html">
          {{ $t('Documentation for modules') }}
        </el-link>
      </p>
      <p class="mb-4">
        {{
          $t(
            'Documentation on all the main points of the project is stored in the repository on GitHub'
          )
        }}
        <el-link
          type="primary"
          href="https://github.com/kosukhin/brick-game-simulator/tree/master/docs"
        >
          {{ $t('Project documentation') }}
        </el-link>
      </p>
    </div>
  </div>
</template>
