import { mount } from '@vue/test-utils'
import services from '~~/src/Injections/Services'
import TetrisGame from '~~/src/Tetris/Components/TetrisGame/TetrisGame.vue'

test('tetris game component', () => {
  const wrapper = mount(TetrisGame, {
    global: {
      mocks: {
        $services: services,
      },
    },
  })
  expect(wrapper.text()).toContain('Score: 0, Speed: 500')
})
