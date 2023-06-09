/* eslint-disable jest/require-hook */
import React from 'react'
import ReactDOM from 'react-dom/client'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { BoxesProvider } from 'Contexts/Boxes'

import App from './App'

import GlobalStyle from './Styles'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<React.StrictMode>
		<GlobalStyle />
		<DndProvider backend={HTML5Backend}>
			<BoxesProvider>
				<App />
			</BoxesProvider>
		</DndProvider>
	</React.StrictMode>
)
