/* eslint-disable no-unused-expressions */
import type { SchemaType } from '@main/schema';
import { expect } from 'chai';
import { OcrProvider, OcrProviderConfig } from '@main/providers/OcrProvider';
import { ScreenCapturer } from '@main/extractor/OcrExtractor/ScreenCapturer';
import { SimpleWindow } from '../../../SimpleWindow';

export function buildTest<C extends OcrProviderConfig<string, any, unknown, any>>(config: C, options: SchemaType<C['optionsSchema']>, skip = false) {
    describe('OcrProvider', function() {
        (skip ? describe.skip : describe)(config.id, function() {
            let provider: OcrProvider;
            let screenCapturer: ScreenCapturer;
            let window: SimpleWindow;

            before(async function() {
                this.timeout(5000);
                window = new SimpleWindow();
                await window.whenReady();
                const width = 400;
                const height = 300;
                await window.run(`(function(){const { width, height } = screen.screenToDipRect(window, { x: 0, y: 0, width: ${width}, height: ${height} }); window.setSize(width, height);})()`);
                await window.run('window.webContents.executeJavaScript(`document.open();document.write(\'<div style="width:100%;height:100%;display:flex;align-items:center;align-content:center;justify-content:center;"><h1>こんにちは。<hi><div>\');document.close();`)');
                screenCapturer = new ScreenCapturer(window.pids);
            });

            after(async function() {
                await window.destroy();
                screenCapturer.destroy();
            });

            it('init', async function() {
                provider = new OcrProvider(config, () => options);
                await provider.whenInitDone();
                expect(provider.isReady()).to.be.true;
            });
            it('recognize', async function() {
                this.timeout(20000);
                const result = await provider.recognize((await screenCapturer.capture()).extract({ left: 50, top: 100, width: 300, height: 100 }));
                expect(result).to.be.a('string').and.not.to.be.empty;
                expect(result.trim()).to.equal('こんにちは。');
            });
            this.afterAll(function() {
                provider.destroy();
            });
        });
    });
}
