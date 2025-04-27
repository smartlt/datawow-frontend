'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with username:', username);
    // Redirect to home page or dashboard after login
    // router.push('/dashboard');
  };

  return (
    <div className="w-full min-h-screen">
      {/* Mobile view */}
      <div className="block md:hidden">
        <div className="bg-main-green-500 text-white min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="mb-12 text-center">
              <div className="flex justify-center mb-2">
                <div className="relative w-24 h-24">
                  <Image
                    src="/board-icon.svg"
                    alt="Board Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <p className="italic text-lg">a Board</p>
            </div>
            
            <div className="w-full max-w-xs">
              <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    id="username-mobile"
                    placeholder="Username"
                    className="w-full p-3 rounded border-0 focus:ring-0 focus:outline-none text-black"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#40a575] hover:bg-[#4ab483] text-white py-3 rounded transition-colors duration-200"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
          
          <div className="pb-8 flex justify-center">
            <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="bg-main-green-100 text-white min-h-screen flex items-center justify-center p-8">
          <div className="flex w-full max-w-5xl h-96 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      id="username-desktop"
                      placeholder="Username"
                      className="w-full p-3 rounded border-0 focus:ring-0 focus:outline-none text-black"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#40a575] hover:bg-[#4ab483] text-white py-3 rounded transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </form>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="relative w-56 h-56">
                <Image
                  src="/board-icon.svg"
                  alt="Board Icon"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="italic text-lg mt-4">a Board</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 