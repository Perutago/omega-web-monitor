type ResultType<T> = Promise<{
    success: boolean;
    data?: T | null;
}>;
