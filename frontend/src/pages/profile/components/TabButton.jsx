export default function TabButton({ name, label, activeTab, setActiveTab }) {
    return (
        <button
            className={`px-4 py-4 font-medium ${activeTab === name ? 'font-bold border-b-4 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab(name)}
        >
            {label}
        </button>
    );
}