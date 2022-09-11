module.exports = {
    apps: [
        {
            name: 'BrickGameSimulator',
            exec_mode: 'cluster',
            instances: 'max', // Or a number of instances
            script: './node_modules/nuxt/bin/nuxt.mjs',
            args: 'start',
        },
    ],
}
