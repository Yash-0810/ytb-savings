import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo height="50px" />
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-700 font-medium">{user?.name}</span>
          <button
            onClick={() => navigate('/account')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Account
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
