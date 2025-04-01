export const NavButton = ({ icon, active, onClick, notificationCount }) => (
  <div className="relative">
    <button 
      className={`p-3 rounded-lg hover:bg-gray-200 hover:dark:bg-gray-700 ${
        active ? 'bg-gray-200 dark:bg-gray-700' : ''
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
    {notificationCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-violet-300 dark:bg-purple-600 dark:text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {notificationCount}
      </span>
    )}
  </div>
); 