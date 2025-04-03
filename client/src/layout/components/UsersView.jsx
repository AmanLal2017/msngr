import { useContext, useState, useMemo } from "react";
import { User, Search } from "lucide-react";
import { ChatContext } from "../../context/ChatContext";
import { UserListItem } from "./UserListItem";

export const UsersView = () => {
  const { potentialChats, currentChats, isUserChatsLoading } = useContext(ChatContext);
  const [search, setSearch] = useState('');

  const filteredCurrentChats = useMemo(() => {
    if (!search) return currentChats;
    return currentChats.filter(user => 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [currentChats, search]);

  const filteredPotentialChats = useMemo(() => {
    if (!search) return potentialChats;
    return potentialChats.filter(user => 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [potentialChats, search]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <div className="p-2">
          <User size={20} />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center bg-gray-300 dark:bg-gray-700 rounded-lg px-3 py-2">
          <Search size={16} className="dark:text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="bg-transparent w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {filteredCurrentChats?.length !== 0 && !isUserChatsLoading &&
        <div>
          <div className="flex items-center justify-center mb-4">
            <h2 className="font-medium">Friends</h2>
          </div>
          
          <div className="space-y-2 mb-6">
            {filteredCurrentChats?.map((user, index) => (
              <UserListItem 
                key={user._id}
                user={user}
              />
            ))}
          </div>
        </div>
      }

      {filteredPotentialChats?.length !== 0 && !isUserChatsLoading &&
        <div>
          <div className="flex items-center justify-center mb-4">
            <h2 className="font-medium">Users</h2>
          </div>
          
          <div className="space-y-2 mb-6">
            {filteredPotentialChats?.map((user, index) => (
              <UserListItem 
                key={user._id}
                user={user}
              />
            ))}
          </div>
        </div>
      }

      {isUserChatsLoading && !userChats && <div className="flex pt-2 justify-center text-sm text-gray-400">Loading...</div>}
      {filteredCurrentChats?.length === 0 && filteredPotentialChats?.length === 0 &&
        <div className="flex justify-center font-medium">No Users Found</div>}
    </div>
  );
};