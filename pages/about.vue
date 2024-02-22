<template>
  <div class="about">
    <h1>{{ $t('About project') }}</h1>
    <div class="middle">
      <div class="article">
        <p>
          {{
            $t(
              'This project is being developed as a work for an open source portfolio. So that the author of the project could show his skills on the example of this work.'
            )
          }}
        </p>
        <p>
          {{
            $t(
              'Perhaps in the future the project will grow into something more than a work for a portfolio. You can help the author in this difficult task and create your own game based on this simulator. You will find a detailed tutorial on how to make your own game here:'
            )
          }}
          <nuxt-link to="/new-game/">
            <el-link type="primary">{{ $t('Create new game') }} </el-link>
          </nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>
