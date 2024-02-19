<template>
  <div>
    <h1>{{ 'Documentation' }}</h1>

    <div class="middle article">
      <p>
        {{ 'There are several types of documentation in the project.' }}
      </p>
      <p>
        {{
          'Documentation for the source code of the modules can be found here'
        }}
        <el-link type="primary" href="/jsdocs/modules.html">
          {{ 'Documentation for modules' }}
        </el-link>
      </p>
      <p>
        {{
          'Documentation on all the main points of the project is stored in the repository on GitHub'
        }}
        <el-link
          type="primary"
          href="https://github.com/kosukhin/brick-game-simulator/tree/master/docs"
        >
          {{ 'Project documentation' }}
        </el-link>
      </p>
    </div>
  </div>
</template>
