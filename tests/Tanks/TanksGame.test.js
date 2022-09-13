import { mount } from '@vue/test-utils'
import services from '~~/src/Injections/Services'
import TanksGame from '~~/src/Tanks/Components/TanksGame/TanksGame.vue'

test('tanks game component', () => {
    const wrapper = mount(TanksGame, {
        global: {
            mocks: {
                $services: services,
            },
        },
    })
    expect(wrapper.text()).toContain('Score: 0')
})
