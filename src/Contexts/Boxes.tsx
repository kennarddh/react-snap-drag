/* eslint-disable security/detect-object-injection */
import { FC, createContext, ReactNode, useCallback, useState } from 'react'

import { IValueOrFactory } from 'Types'

interface IBox {
	x: number
	y: number
}

type IUpdateBox = (
	id: string,
	options: IValueOrFactory<Partial<IBox>, IBox>
) => void

interface IBoxesContext {
	UpdateBox: IUpdateBox
	Boxes: Record<string, IBox>
}

const BoxesContext = createContext<IBoxesContext>({
	UpdateBox: () => undefined,
	Boxes: {},
})

export const BoxesProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [Boxes, SetBoxes] = useState<Record<string, IBox>>({
		'813ea7e5-6768-42ed-a037-2abda5c59984': {
			x: 100,
			y: 100,
		},
		'741fca7d-3788-4c48-a5cc-fc3b2e34b237': {
			x: 400,
			y: 100,
		},
	})

	const UpdateBox: IUpdateBox = useCallback((id, box) => {
		SetBoxes(prev => {
			let data: Partial<IBox>

			if (typeof box === 'function') {
				data = box(prev[id])
			} else {
				data = box
			}

			return {
				...prev,
				[id]: {
					...prev[id],
					...data,
				},
			}
		})
	}, [])

	return (
		<BoxesContext.Provider value={{ Boxes, UpdateBox }}>
			{children}
		</BoxesContext.Provider>
	)
}

export default BoxesContext
