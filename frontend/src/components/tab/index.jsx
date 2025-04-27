import { createContext, useContext, useState } from 'react'

const TabContext = createContext()

export default function Tab({ children, activeTab }) {
	const [active, setActive] = useState(activeTab)

	return (
		<TabContext.Provider value={{ active, setActive }}>
			<div className="flex flex-col h-full">
				{children}
			</div>
		</TabContext.Provider>
	)
}

Tab.Items = function TabItems({ children }) {
	return (
		<div className="flex border-b border-gray-200 dark:border-gray-800">
			{children}
		</div>
	)
}

Tab.Item = function TabItem({ children, id }) {
	const { active, setActive } = useContext(TabContext)
	const isActive = active === id

	return (
		<button
			onClick={() => setActive(id)}
			className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
				isActive
					? 'text-blue-500 border-b-2 border-blue-500'
					: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
			}`}
		>
			{children}
		</button>
	)
}

Tab.Content = function TabContent({ children, id }) {
	const { active } = useContext(TabContext)
	return active === id ? <div>{children}</div> : null
} 