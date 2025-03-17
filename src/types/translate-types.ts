import en from '@assets/i18n/sv/sv.json';

type TranslationKeys = typeof en;

type DeepKeys<T, Prefix extends string = ''> = T extends object
    ? {
        [K in keyof T]: T[K] extends object
        ? DeepKeys<T[K], `${Prefix}${K & string}.`> // Recursive call
        : `${Prefix}${K & string}`;
    }[keyof T]
    : never;

export type TranslationKeyPaths = DeepKeys<TranslationKeys>;
