import { FC, useRef } from 'react'

import { useDrop, XYCoord } from 'react-dnd'

import Box from 'Components/Box/Box'

import useBoxes from 'Hooks/useBoxes'

import { IBoxItem } from 'Types'

import { Container } from './AppStyles'

const App: FC = () => {
	const PrevDeltaRef = useRef<XYCoord | null>(null)

	const { Boxes, UpdateBox } = useBoxes()

	const [, drop] = useDrop<IBoxItem>(() => ({
		accept: 'Box',
		hover(item, monitor) {
			const delta = monitor.getDifferenceFromInitialOffset()

			const deltaX = delta?.x ?? 0
			const deltaY = delta?.y ?? 0

			const prevDeltaX = PrevDeltaRef.current?.x ?? 0
			const prevDeltaY = PrevDeltaRef.current?.y ?? 0

			UpdateBox(item.id, prev => ({
				y: prev.y + deltaY - prevDeltaY,
				x: prev.x + deltaX - prevDeltaX,
			}))

			PrevDeltaRef.current = { x: deltaX, y: deltaY }
		},
		drop() {
			PrevDeltaRef.current = { x: 0, y: 0 }
		},
	}))

	return (
		<Container ref={drop}>
			{Object.keys(Boxes).map(id => (
				<Box key={id} id={id} />
			))}
		</Container>
	)
}

export default App
