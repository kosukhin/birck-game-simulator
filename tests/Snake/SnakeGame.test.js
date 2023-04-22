import { mount } from '@vue/test-utils'
import services from '~~/src/Injections/Services'
import SnakeGame from '~~/src/Snake/Components/SnakeGame/SnakeGame.vue'

test('snake game component', () => {
  const wrapper = mount(SnakeGame, {
    global: {
      mocks: {
        $services: services,
      },
    },
  })
  expect(wrapper.text()).toContain('Score: 0, Speed: 400')
})
