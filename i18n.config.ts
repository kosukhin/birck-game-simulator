export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ru',
  globalInjection: true,
  messages: {
    en: {},
    ru: {
      'About project': 'О проекте',
      Hello: 'Привет',
      'Use 3D': 'Использовать 3D',
      'Offer game': 'Предложить игру',
      Settings: 'Настройки',
      'Start game': 'Начать игру',
      Back: 'Назад',
      'Game over': 'Игра закончена',
      Score: 'Счет',
      Speed: 'Скорость',
      Home: 'Главная',
      Tetris: 'Тетрис',
      Snake: 'Змейка',
      Tanks: 'Танки',
      'Failed to load the game': 'Не удалось загрузить игру',
      'choose another one, please,': 'выберите другую, пожалуйста',
      Controls: 'Управление',
      Fire: 'Выстрел',
      Simulator: 'Симулятор',
      'It is allowed to use the Software free of charge without restrictions':
        'Разрешается безвозмездно использовать Программное обеспечение без ограничений',
      'Create new game': 'Создать свою игру',
      Documentation: 'Документация',
      English: 'Английский',
      Russian: 'Русский',
      'Switch to': 'Переключить на',
      Games: 'Игры',

      '"Tetris" is a puzzle based on the use of geometric figures "tetramino" — a variety of polyominoes...':
        '«Тетрис» представляет собой головоломку, построенную на использовании геометрических фигур «тетрамино» — разновидности полимино...',
      'A computer game that first appeared in the Nokia 6110 push-button phone. Developed by Finnish developer Taneli Armanto':
        'Компьютерная игра, впервые появившаяся в кнопочном телефоне Nokia 6110. Разработана финским разработчиком Танели Арманто',
      'Non-standard implementation of classic tankers, in this version the rivals are more aggressive, they know exactly where you are! And they will seek to destroy you.':
        'Нестандартная реализация классических танчиков, в этой версии соперники более агрессивны, они точно знают где вы находитесь! И будут стремиться вас уничтожить.',

      'Popular games': 'Популярные игры',

      'Welcome to the BrickGame Simulator project!':
        'Добро пожаловать в проект BrickGame симулятор!',

      'This project is being developed as a work for an open source portfolio. So that the author of the project could show his skills on the example of this work.':
        'Этот проект разрабатывается в качестве работы для портфолио с открытым исходным кодом. Чтобы автор проекта мог показать свои навыки на примере этой работы.',

      'Perhaps in the future the project will grow into something more than a work for a portfolio. You can help the author in this difficult task and create your own game based on this simulator. You will find a detailed tutorial on how to make your own game here:':
        'Возможно в будущем проект перерастет во что-то большее чем работа для портфолио. Вы можете помочь автору в этом нелегком деле и создать свою игру на основе этого симулятора. Подбробную инстуркцию как сделать свою игру вы найдете здесь,',

      Error: 'Ошибка',
      'Page not found': 'Страница не найдена',

      'There are several types of documentation in the project.':
        'В проекте есть несколько видов документации.',

      'Documentation for the source code of the modules can be found here':
        'Документацию на исходный код модулей вы можете найти здесь',

      'Documentation for modules': 'Документация на модули',

      'Documentation on all the main points of the project is stored in the repository on GitHub':
        'Документация по всем основным моментам проекта храниться в репозитории на GitHub',

      'Project documentation': 'Документация на проект',
      and: 'и',
      'Create a new game': 'Создать новую игру',

      'To create a new game, create a directory, for example,':
        'Чтобы создать новую игру, создайте директорию, например,',

      'Next, create a directory': 'Дальше создайте директорию',
      'and a file called, for example,': 'и файл под названием, например,',

      'This service is needed in order to connect a new game to the Simulator component':
        'Этот сервис нужен для того чтобы подключить новую игру к компоненту Simulator',

      'For example, the code from the STetris service looks like this:':
        'Например, код из сервиса STetris выглядит так,',

      'The TetrisGame component is added to the games List':
        'В gamesList добавляется компонент TetrisGame',

      'After the work done, you will be able to open your game if you go to':
        'После проделанной работы, вы сможете открыть свою игру если перейдете по адресу',

      'To create your own game, you only need to use 2 models:':
        'Для создания своей игры вам нужно использовать всего лишь 2 модели,',

      'responsible for the formation of the main grid of the game.function':
        'отвечает за формирование основной сетки игры.функция',

      'how to deploy the main two-dimensional array of the game':
        'как раз вернет основной двумерный массив игры',

      'responsible for creating shapes on the MGrid grid. After creating a new instance of MShape, you can place it on the grid of the game Grid by calling the add Shape function.':
        'отвечает за создание фигур на сетке MGrid. Создав новый экземпляр MShape вы можете поместить его на сетку игры MGrid вызвав функцию addShape.',

      'To see the results of your game, use the component':
        'Чтобы увидеть результаты работы своей игры используйте компонент',

      'Transfer your Mgrid instance to the prop':
        'Передайте свой экземпляр Mgrid в пропс',

      'and set the desired refresh rate level of the game, for example fps=10 will update the display 10 times per second.':
        'и установите желаемый уровень частоты обновления игры, например fps=10 будет обновлять отбражение 10 раз в секунду.',

      'In principle, this should be enough to develop a new game.':
        'Впринципе этого должно быть достаточно чтобы раработать новую игру.',

      'If you have any questions, you can ask them in Issues on Github.':
        'Если есть вопросы можете задать их в Issues на Github.',

      'Ask a question about creating a game': 'Задать вопрос по созданию игры',

      pause: 'пауза',
      Arcanoid: 'Арканоид',
      Blasteroid: 'Бластероид',

      'As a pilot of a spaceship equipped with two blasters, you must destroy the threat coming at you.':
        'Вы как пилот космического корабля оснащенного двумя бластерами должны уничтожить надвигающуюся на вас угрозу.',

      'Dmitry scored 100 points': 'Дмитрий набрал 100 очков',
      'Vladimir earned 40 points': 'Владимир заработал 40 очков',
      'Evgeny scored 30 points': 'Евгений набрал 30 очков',
      'Vladislav destroyed 50 tanks': 'Владислав уничтожил 50 танков',
      'End the broadcast': 'Завершить трансляцию',
      'Start broadcasting': 'Начать трансляцию',
      'Broadcasting online': 'Онлайн трансляция',
      'Game Broadcast Online': 'Трансляция игры онлайн',

      'Here you can watch someone playing Brick Game':
        'Здесь вы можете наблюдать как кто-то играет в BrickGame',

      'Offer a game': 'Предложить игру',
      'What is your name?': 'Как вас зовут?',
      Post: 'Должность',
      'Work experience, years': 'Опыт работы, лет',
      'Describe the offer': 'Опишите предложение',
      'Send an offer': 'Отправить предложение',
      'Cool game': 'Отличная игра',

      'Unfortunately, this is a demo form, but you can':
        'К сожалению это демонстрационная форма, но вы можете',

      'send the results by email': 'отправить результаты на email',
      Field: 'Поле',
      Result: 'Результат',
      'John Smith': 'Иванов Иван',
      Developer: 'Разработчик',
      'Thanks for offer': 'Спасибо  за предложение',
      'Need your name': 'Необходимо указать ваше имя',
      'Need your post': 'Необходимо указать должность',
      'Need your experience': 'Необходимо указать опыт',
      'Need description': 'Необходимо указать описание',
      Send: 'Отправить',
      'Classic tanks': 'Классические танки',
      'Tanks 3D': 'Танки 3Д',
      'Tetris 3D': 'Тетрис 3Д',
      'Classic tetris': 'Классический тетрис',
      'Classic snake': 'Классическая змейка',
      'Snake 3D': 'Змейка 3Д',
      'Blasteroid 3D': 'Бластероид 3д',
      'Classic blasteroid': 'Классический бластероид',
    },
  },
}))
