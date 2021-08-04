let mix = require('laravel-mix');

mix.ts('src/game.ts', 'dist/')
    .copy('src/index.html', 'dist/')
    .copy('src/assets', 'dist/assets')
    .setPublicPath('dist/')
    .sourceMaps()
    .version();
