export type IValueOrFactory<T, Prev = T> = T | ((prev: Prev) => T)

export interface IBoxItem {
	id: string
}
