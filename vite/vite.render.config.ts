import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import log from './LogPlugin';

import builtinModules from 'builtin-modules/static';
const license = require('rollup-plugin-license');

const externalPackages = [
    'electron',
    'electron/main',
    'electron/common',
    'electron/renderer',
    ...builtinModules
];

// https://vitejs.dev/config/
export default defineConfig(({ mode } = { command: 'build', mode: 'production' }) => ({
    optimizeDeps: {
        entries: [
            path.join(__dirname, '../src/render/MainWindow.html'),
            path.join(__dirname, '../src/render/TranslatorWindow.html')
        ],
        include: ['vue', 'ant-design-vue', 'vue-router', '@ant-design/icons-vue', 'debug']
    },
    mode,
    root: path.join(__dirname, '../src/render'),
    base: './',
    clearScreen: false,
    plugins: [log({
        include: [
            path.join(__dirname, '../src/render/*.*').replace(/\\/g, '/'),
            path.join(__dirname, '../src/render/**/*.*').replace(/\\/g, '/')
        ],
        loggerPath: '@render/logger',
        logFunction: { logger: 'logger' },
        disableLog: mode === 'production'
    }),
    vue(),
    ...(mode === 'production'
        ? [license({
            thirdParty: {
                includePrivate: false,
                output: {
                    file: path.join(__dirname, '../dist/license.dependencies.render.json'),
                    template(dependencies) {
                        return JSON.stringify(dependencies);
                    }
                }
            }
        })]
        : []
    )],
    build: {
        outDir: path.join(__dirname, '../dist/render'),
        emptyOutDir: true,
        minify: mode === 'production',
        sourcemap: mode !== 'production',
        rollupOptions: {
            input: [
                path.join(__dirname, '../src/render/MainWindow.html'),
                path.join(__dirname, '../src/render/TranslatorWindow.html')
            ],
            external: externalPackages
        }
    },
    resolve: {
        alias: {
            '@main': path.join(__dirname, '../src/main'),
            '@render': path.join(__dirname, '../src/render'),
            '@static': path.join(__dirname, '../static'),
            '@assets': path.join(__dirname, '../assets')
        }
    }
}));
