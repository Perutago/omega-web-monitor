export const allResultTypes = [
    'error',
    'warning',
    'info',
    'success',
] as const;
export type ResultType = typeof allResultTypes[number];
export const ResultType = {
    ERROR: allResultTypes[0],
    WARNING: allResultTypes[1],
    INFO: allResultTypes[2],
    SUCCESS: allResultTypes[3],
} as const;

export const allRepositoryTypes = [
    'db',
    'csv',
    'json',
] as const;
export type RepositoryType = typeof allRepositoryTypes[number];
export const RepositoryType = {
    DB: allRepositoryTypes[0],
    CSV: allRepositoryTypes[1],
    JSON: allRepositoryTypes[2],
} as const;

export type Brand<K, T> = K & { _brand: T };
