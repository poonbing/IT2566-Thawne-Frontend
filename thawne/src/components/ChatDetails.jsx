import React from 'react';
import FileCarousel from './ChatView/FileCarousel';

function ChatDetails({ chatDetails, onClose }) {
    return (
        <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-zinc-800 shadow-md p-4 overflow-y-auto max-h-full">
    <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold mb-4 text-white">Info</h2>
    <button onClick={onClose} className="text-white px-4 py-2 rounded-md text-lg">
        <ion-icon name="close"></ion-icon>
    </button>
    </div>
    <div className="flex flex-col h-full space-y-4">
    <div className="flex-grow ">
    <img
                className="object-cover w-3/4 rounded-full p-5 "
                src="/images/default_pfp.png"
                alt="username"
              />
        <p className='italic mb-2 text-white'>Created by: Creator XX at XX/XX/XX </p>

    </div>
        <div className="flex-grow">
        <div class="grid py-6 sm:grid-cols-2">
        <div class="text-white">
          <h2 class="text-lg font-semibold leading-4">Chat Details</h2>

          <p class=" mt-5">Chat ID: </p>

          <p class="mt-6">Chat Security:</p>
          

        </div>
        <div class="mt-4 flex items-center sm:justify-end">
          <div class="flex flex-col gap-3 text-white italic">
            
            <span className='mt-3 relative inline-flex cursor-pointer items-center'>No Hair</span>
            <span className='mt-3 text-xs bg-red-600 text-white font-semibold p-1 rounded-md'>Top Secret</span>


          </div>
        </div>
</div>

        </div>


        <div className="flex-grow">
        <div className="overflow-y-auto text-white p-4">
            <div className="flex items-center">
            <p className="mb-2">Chat Description: {chatDetails.description}</p>
            <button className="ml-auto text-white">
                <ion-icon name="create-outline"></ion-icon>
            </button>
            </div>


        </div>
        </div>

        <div className="flex-grow">
        <h2 className="text-lg font-semibold mb-4 text-white">Files</h2>
        <FileCarousel />
        </div>

        <div className="flex-grow">
        <h2 className="text-lg font-semibold mb-4 text-white">Participants</h2>
        <div className="flex items-center mb-3">
        <img
                    className="object-cover w-12 h-12 rounded-full mr-4"
                    src="/images/default_pfp.png"
                    alt="username"
                />
            <div>
            <p className="font-semibold text-white">User 1</p>
            <p className="text-gray-500 text-sm">ID: 001</p>
            </div>
        </div>

        <div className="flex items-center mb-3">
        <img
                    className="object-cover w-12 h-12 rounded-full mr-4"
                    src="/images/default_pfp.png"
                    alt="username"
                />
            <div>
            <p className="font-semibold text-white">User 2</p>
            <p className="text-gray-500 text-sm">ID: 002</p>
            </div>
        </div>

        <div className="flex items-center mb-3">
        <img
                    className="object-cover w-12 h-12 rounded-full mr-4"
                    src="/images/default_pfp.png"
                    alt="username"
                />
            <div>
            <p className="font-semibold text-white">User 3</p>
            <p className="text-gray-500 text-sm">ID: 003</p>
            </div>
        </div>
        </div>

        <div className="flex-grow">
            <button className='text-red-500 w-full px-4 py-2 '>
                <ion-icon name="exit-outline"></ion-icon> Exit Group
            </button>
            <button className='text-red-500 w-full px-4 py-2'>
                <ion-icon name="megaphone-outline"></ion-icon> Report Group
            </button>
            
        </div>
    </div>
    </div>

    );
}

export default ChatDetails;
