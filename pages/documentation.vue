<template>
  <div>
    <h1>{{ $t('Documentation') }}</h1>

    <div class="middle article">
      <p>
        {{ $t('There are several types of documentation in the project.') }}
      </p>
      <p>
        {{
          $t(
            'Documentation for the source code of the modules can be found here'
          )
        }}
        <el-link type="primary" href="/jsdocs/modules.html">
          {{ $t('Documentation for modules') }}
        </el-link>
      </p>
      <p>
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
