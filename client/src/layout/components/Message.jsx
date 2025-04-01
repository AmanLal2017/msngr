export const Message = ({ content, time, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div className={`${isOwn ? 'bg-violet-300 dark:bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'} rounded-lg p-3`}>
      <div className="flex flex-col md:flex-row space-y-1 md:items-baseline md:justify-between md:space-x-4">
        <p className="whitespace-pre-wrap break-all">{content}</p>
        <span className="text-xs text-gray-800 dark:text-gray-400 self-end md:self-auto">{time}</span>
      </div>
    </div>
  </div>
);
