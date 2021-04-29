import type sharp from 'sharp';
import type { Schema, SchemaDescription, SchemaType } from '@main/schema';
import { BaseProvider, ProviderThisType } from './BaseProvider';
import logger from '@logger/providers/ocrProvider';

export type OcrProviderOptions<ID extends string, S extends Schema, D> = {
    id: ID;
    optionsSchema: S;
    defaultOptions: SchemaType<S>;
    optionsDescription?: SchemaDescription<S>;
    description?: string;
    data(): D;
};
export type OcrProviderMethods<ID extends string, S extends Schema, D> = {
    init?(): void | Promise<void>;
    isReady(): boolean;
    recognize(img: sharp.Sharp): Promise<string> | string;
    destroy?(): void;
} & ProviderThisType<OcrProvider<ID, S, D>>;

export type OcrProviderConfig<ID extends string, S extends Schema, D> = OcrProviderOptions<ID, S, D> & OcrProviderMethods<ID, S, D> & { providersStoreKey: 'ocrProviders' };

export class OcrProvider<ID extends string = string, S extends Schema = any, D = unknown> extends BaseProvider<ID, S, D, OcrProviderConfig<ID, S, D>> {
    public async recognize(img: sharp.Sharp): Promise<string> {
        logger(`${this.$id} recognize`);
        try {
            return await this.$config.recognize.call(this, img);
        } catch (e) {
            logger(`${this.$id} throw a error while calling the 'recognize' function, error: %O`, e);
            return Promise.reject(e);
        }
    }
}
