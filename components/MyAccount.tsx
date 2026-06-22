'use client';
import React, { useState, useRef } from 'react';
import { 
  User, Shield, Key, CheckCircle, AlertCircle, Save, 
  HardDrive, Download, Upload, Copy, Database, Github 
} from 'lucide-react';

interface MyAccountProps {
  currentUser: { name: string; username: string; role: "admin" | "employee"; phone?: string } | null;
  registeredUsers: any[];
  onUpdateUserProfile: (username: string, updatedFields: { name?: string; password?: string; phone?: string }) => void;
  patients?: any[];
  appointments?: any[];
  smsLogs?: any[];
  onImportBackup?: (data: { patients: any[]; appointments: any[]; smsLogs: any[]; registeredUsers?: any[] }) => void;
}

export default function MyAccount({
  currentUser,
  registeredUsers,
  onUpdateUserProfile,
  patients = [],
  appointments = [],
  smsLogs = [],
  onImportBackup
}: MyAccountProps) {
  if (!currentUser) return <div className="p-10 text-center">Please Log In</div>;

  const fullProfile = registeredUsers.find(u => u.username === currentUser.username);
  const [name, setName] = useState(fullProfile?.name || "");
  const [phone, setPhone] = useState(fullProfile?.phone || "");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile(currentUser.username, { name, phone, ...(password ? { password } : {}) });
    setSuccessMessage("Saved!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <User className="text-indigo-600" /> Account Settings
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <input 
            className="w-full p-2 border rounded-lg" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Full Name" 
          />
          <input 
            className="w-full p-2 border rounded-lg" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Phone Number" 
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">
            {successMessage ? "Updated!" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-xl">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
          <Github size={16} /> GitHub Sync
        </h3>
        <code className="text-[10px] text-indigo-300">
          git remote add origin https://github.com/deepudillip19-dev/NextJS.git
        </code>
      </div>
    </div>
  );
}
