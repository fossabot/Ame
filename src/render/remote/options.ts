import store from '@render/store';
import { handleError } from '@render/remote/handle';

const electron = require('electron');

export function getTranslateProvidersIDs() {
    return handleError(electron.ipcRenderer.invoke('get-translate-providers-ids'));
}
export function getTranslateProviderOptionsMeta(providerId: string) {
    return handleError(electron.ipcRenderer.invoke('get-translate-provider-options-meta', providerId));
}
export function getTranslateProviderOptions(providerId: string) {
    return store.get(`translateProviders.${providerId}`);
}
export function setTranslateProviderOptions(providerId: string, value: unknown) {
    return store.set(`translateProviders.${providerId}`, value);
}

export function getTtsProvidersIDs() {
    return handleError(electron.ipcRenderer.invoke('get-tts-providers-ids'));
}
export function getTtsProviderOptionsMeta(providerId: string) {
    return handleError(electron.ipcRenderer.invoke('get-tts-provider-options-meta', providerId));
}
export function getTtsProviderOptions(providerId: string) {
    return store.get(`ttsProviders.${providerId}`);
}
export function setTtsProviderOptions(providerId: string, value: unknown) {
    return store.set(`ttsProviders.${providerId}`, value);
}

export function getOcrProvidersIDs() {
    return handleError(electron.ipcRenderer.invoke('get-ocr-providers-ids'));
}
export function getOcrProviderOptionsMeta(providerId: string) {
    return handleError(electron.ipcRenderer.invoke('get-ocr-provider-options-meta', providerId));
}
export function getOcrProviderOptions(providerId: string) {
    return store.get(`ocrProviders.${providerId}`);
}
export function setOcrProviderOptions(providerId: string, value: unknown) {
    return store.set(`ocrProviders.${providerId}`, value);
}

export function getTtsManagerOptionsMeta() {
    return handleError(electron.ipcRenderer.invoke('get-tts-manager-options-meta'));
}
export function getTtsManagerOptions() {
    return store.get('ttsManager');
}
export function setTtsManagerOptions(_: string, value: unknown) {
    return store.set('ttsManager', value);
}

export function getOcrExtractorOptionsMeta() {
    return handleError(electron.ipcRenderer.invoke('get-ocr-extractor-options-meta'));
}
export function getOcrExtractorOptions() {
    return store.get('ocrExtractor');
}
export function setOcrExtractorOptions(_: string, value: unknown) {
    return store.set('ocrExtractor', value);
}
