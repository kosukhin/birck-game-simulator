import { mount } from '@vue/test-utils'
import services from '~~/src/Injections/Services'
import BlasteroidGame from '~~/src/Blasteroid/Components/BlasteroidGame/BlasteroidGame.vue'

test('snake game component', () => {
    const wrapper = mount(BlasteroidGame, {
        global: {
            mocks: {
                $services: services,
            },
        },
    })
    expect(wrapper.text()).toContain('Score: 0, Speed: 400')
})
