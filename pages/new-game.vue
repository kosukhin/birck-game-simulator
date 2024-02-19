<template>
  <div class="middle article">
    <link
      rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.3.2/styles/dark.min.css"
    />
    <h1>
      {{ 'Create a new game' }}
    </h1>
    <p>
      {{ 'To create a new game, create a directory, for example,' }}
      <el-tag>src/Arcanoid</el-tag>
    </p>
    <p>
      {{ 'Next, create a directory' }}
      <el-tag>Services</el-tag>
      {{ 'and a file called, for example,' }}
      <el-tag>SArcanoid.ts</el-tag>
      .
      {{
        'This service is needed in order to connect a new game to the Simulator component'
      }}
    </p>
    <p>
      {{ 'For example, the code from the STetris service looks like this:' }}
    </p>
    <pre v-highlightjs>
            <code class="typescript">
export class STetris {
    afterInit(hooks: SHooks) {
        hooks.gamesResolving
        .registerSubscriber((gamesList) => {
            gamesList.tetris = TetrisGame
        })
    }
}
            </code>
            </pre>
    <p>
      {{ 'The TetrisGame component is added to the games List' }}
    </p>
    <p>
      {{
        'After the work done, you will be able to open your game if you go to'
      }}
      <el-tag>http://localhost:3000/simulator/arcanoid/</el-tag>
    </p>
    <p>
      {{ 'To create your own game, you only need to use 2 models:' }}
      <el-tag>MGrid</el-tag>
      {{ 'and' }}
      <el-tag>MShape</el-tag>
    </p>
    <p>
      <b>MGrid</b>
      {{
        'responsible for the formation of the main grid of the game.function'
      }}
      <el-tag>render</el-tag>
      {{ 'how to deploy the main two-dimensional array of the game' }}
    </p>
    <p>
      <b>MShape</b>
      {{
        'responsible for creating shapes on the MGrid grid. After creating a new instance of MShape, you can place it on the grid of the game Grid by calling the add Shape function.'
      }}
    </p>
    <p>
      {{ 'To see the results of your game, use the component' }}
      <el-tag>CanvasView</el-tag>
      .
      {{ 'Transfer your Mgrid instance to the prop' }}
      <el-tag>grid</el-tag>
      {{
        'and set the desired refresh rate level of the game, for example fps=10 will update the display 10 times per second.'
      }}
    </p>
    <pre v-highlightjs>
            <code class="html">
&lt;CanvasView :grid="game.grid" :fps="10" /&gt;
            </code>
        </pre>
    <p>
      {{ 'In principle, this should be enough to develop a new game.' }}
    </p>
    <p>
      {{ 'If you have any questions, you can ask them in Issues on Github.' }}
      <el-link
        type="primary"
        href="https://github.com/kosukhin/brick-game-simulator/issues"
      >
        {{ 'Ask a question about creating a game' }}
      </el-link>
    </p>
  </div>
</template>
