import services from '~~/src/Injections/Services'

test('tetris service', () => {
  const gamesList = {}
  services.hooks.gamesResolving.runSubscribers(gamesList)
  expect(gamesList).toHaveProperty('tetris')
  expect(gamesList).toHaveProperty('tanks')
  expect(gamesList).toHaveProperty('snake')
})
