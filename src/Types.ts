export type IValueOrFactory<T, Prev = T> = T | ((prev: Prev) => T)
