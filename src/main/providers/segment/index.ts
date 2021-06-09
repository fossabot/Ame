/* eslint-disable @typescript-eslint/ban-types */
import type { Schema } from '@main/schema';
import type { SegmentProviderMethods, SegmentProviderConfig } from '@main/providers/SegmentProvider';
import type { BaseProviderOptions, Methods } from '@main/providers/BaseProvider';
import intlSegmenter from './intl-segmenter';
import mecab from './mecab';

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineSegmentProvider<
    ID extends string,
    S extends Schema,
    D,
    M extends Methods = {}
>(
    arg: BaseProviderOptions<ID, S, D>,
    methods: SegmentProviderMethods<ID, S, D, M>
): SegmentProviderConfig<ID, S, D, M> {
    return { ...arg, ...methods };
}

export const availableSegmentConfigs = [intlSegmenter, mecab] as const;
export type AvailableSegmentConfigs = typeof availableSegmentConfigs;
