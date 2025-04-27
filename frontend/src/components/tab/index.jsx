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
			className={`flex-1 py-3 px-4 text-center text-base transition font-bold
				${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
			style={{ position: 'relative' }}
		>
			<span className="relative">
				{children}
				{isActive && (
					<span
						className="absolute left-1/2 -translate-x-1/2 block"
						style={{
							bottom: -8,
							height: 3,
							width: 36,
							borderRadius: 2,
							background: '#1d9bf0'
						}}
					/>
				)}
			</span>
		</button>
	)
}

Tab.Content = function TabContent({ children, id }) {
	const { active } = useContext(TabContext)
	return active === id ? <div>{children}</div> : null
} 