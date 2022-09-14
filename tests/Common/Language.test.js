import services from '~~/src/Injections/Services'

test('tetris service', () => {
    expect(services.lang.t('Hello')).toBe('Hello')
    services.lang.setLangValue('ru')
    expect(services.lang.t('Hello')).toBe('Привет')
    services.lang.setLangValue('es')
    expect(services.lang.t('Hello')).toBe('Hello')
    services.lang.setLangValue('ru')
    expect(services.lang.t('Hello unknown')).toBe('Hello unknown')
})
