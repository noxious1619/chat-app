import React from 'react'
import assets from '../assets/assets'

const RightSidebar = ({ selectedUser }) => {
  return selectedUser && (
    <div className="p-4 text-white">
      <div className="flex flex-col items-center">
        
        {/* Profile Picture */}
        <img 
          src={selectedUser?.profilePic || assets.avatar_icon} 
          alt="" 
          className="w-20 aspect-[1/1] rounded-full" 
        />

        {/* Name + Online Indicator */}
        <h1 className="px-10 text-xl font-medium flex items-center gap-2">
          <span 
            className={`w-2 h-2 rounded-full ${selectedUser.isOnline ? "bg-green-500" : "bg-gray-400"}`} 
          />
          {selectedUser.fullName}
        </h1>

        {/* Bio */}
        <p className="px-10 mx-auto">{selectedUser.bio}</p>
      </div>
    </div>
  )
}

export default RightSidebar
