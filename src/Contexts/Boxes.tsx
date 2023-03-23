/* eslint-disable security/detect-object-injection */
import {
	FC,
	createContext,
	ReactNode,
	useCallback,
	useState,
	useRef,
	useEffect,
	MutableRefObject,
} from 'react'

import { IValueOrFactory } from 'Types'

export interface IBox {
	x: number
	y: number
	width: number
	height: number
}

type IUpdateBox = (
	id: string,
	options: IValueOrFactory<Partial<IBox>, IBox>
) => void

interface IBoxesContext {
	UpdateBox: IUpdateBox
	Boxes: Record<string, IBox>
	BoxesRef: MutableRefObject<Record<string, IBox>>
}

const BoxesContext = createContext<IBoxesContext>({
	UpdateBox: () => undefined,
	Boxes: {},
	BoxesRef: { current: {} },
})

export const BoxesProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [Boxes, SetBoxes] = useState<Record<string, IBox>>({
		'813ea7e5-6768-42ed-a037-2abda5c59984': {
			x: 200,
			y: 200,
			width: 200,
			height: 200,
		},
		'741fca7d-3788-4c48-a5cc-fc3b2e34b237': {
			x: 500,
			y: 200,
			width: 200,
			height: 200,
		},
		'9168b9ed-1306-4318-b905-bd4dd39fc7cb': {
			x: 800,
			y: 200,
			width: 100,
			height: 100,
		},
	})

	const BoxesRef = useRef<Record<string, IBox>>({})

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

	useEffect(() => {
		BoxesRef.current = Boxes
	}, [Boxes])

	return (
		<BoxesContext.Provider value={{ Boxes, UpdateBox, BoxesRef }}>
			{children}
		</BoxesContext.Provider>
	)
}

export default BoxesContext
