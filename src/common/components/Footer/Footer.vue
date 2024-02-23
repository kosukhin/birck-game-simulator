<template>
  <footer class="footer">
    <div class="middle footer-breadcrumbs">
      <Breadcrumbs />
    </div>
    <nuxt-link to="/offer/">
      <el-button class="footer__button">
        {{ $t('Offer game') }}
      </el-button>
    </nuxt-link>
    <div class="middle footer-content">
      <div class="footer-column">
        <nuxt-link to="/simulator/tetris/">{{ $t('Tetris') }} </nuxt-link>
        <nuxt-link to="/simulator/snake/">{{ $t('Snake') }} </nuxt-link>
        <nuxt-link to="/simulator/">{{ $t('Simulator') }} </nuxt-link>
      </div>
      <div class="footer-column">
        <nuxt-link to="/about/">{{ $t('About project') }} </nuxt-link>
        <nuxt-link to="/new-game/">{{ $t('Create new game') }} </nuxt-link>
        <nuxt-link to="/documentation/">{{ $t('Documentation') }} </nuxt-link>
      </div>
      <div class="footer-column">
        <LangChanger />
      </div>
    </div>
    <div class="footer-bottom">
      <div class="middle">
        {{
          $t(
            'It is allowed to use the Software free of charge without restrictions'
          )
        }}
        , MIT &copy;
      </div>
    </div>
  </footer>
</template>

<script setup>
import Breadcrumbs from '~~/src/common/components/Breadcrumbs/Breadcrumbs.vue'
import LangChanger from '~~/src/common/components/LangChanger/LangChanger.vue'
</script>

<style lang="scss" scoped>
.footer {
  background: $c_black;
  color: $c_white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;

  :deep(.flag-link) {
    color: $c_body;
    margin-bottom: 15px;
  }

  &__button {
    background: #111;
    border-color: #111;
    color: #fff;

    &:hover {
      color: orangered;
    }
  }
}

.footer-content {
  flex: 1;
  display: flex;

  @include media1024 {
    flex-direction: column;
  }
}

.footer-breadcrumbs {
  padding: 20px 40px 0;
  position: relative;

  :deep(.breadcrumbs) {
    margin: 0;
  }

  :deep(.el-breadcrumb__inner) {
    color: $c_body;
  }

  @include media1024 {
    opacity: 0;
    height: 20px;
    width: 100%;
  }
}

.footer-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  position: relative;
  padding: 20px;

  a {
    color: $c_body;
    margin-bottom: 15px;

    &:hover {
      color: $c_white;
    }
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 20%;
    left: 0;
    width: 2px;
    height: 60%;
    background: $c_black_separator;
  }

  &:first-child {
    &:before {
      content: none;
    }
  }

  @include media1024 {
    padding: 0;
    margin-bottom: 15px;

    &:before {
      content: none;
    }
  }
}

.footer-bottom {
  width: 100%;
  padding: 10px;
  background: $c_black_deep;
  display: flex;
  justify-content: center;

  .middle {
    font-size: 13px;
    text-align: center;
  }
}
</style>
