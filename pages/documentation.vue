<template>
    <div>
        <h1>{{ $services.lang.t('Documentation') }}</h1>

        <div class="article">
            <p>
                {{
                    $services.lang.t(
                        'There are several types of documentation in the project.'
                    )
                }}
            </p>
            <p>
                {{
                    $services.lang.t(
                        'Documentation for the source code of the modules can be found here'
                    )
                }}
                <el-link type="primary" href="/jsdocs/modules.html">
                    {{ $services.lang.t('Documentation for modules') }}
                </el-link>
            </p>
            <p>
                {{
                    $services.lang.t(
                        'Documentation on all the main points of the project is stored in the repository on GitHub'
                    )
                }}
                <el-link
                    type="primary"
                    href="https://github.com/kosukhin/brick-game-simulator/tree/master/docs"
                >
                    {{ $services.lang.t('Project documentation') }}
                </el-link>
            </p>
        </div>
    </div>
</template>
