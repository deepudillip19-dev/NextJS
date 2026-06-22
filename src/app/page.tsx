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
  if (!currentUser) return <div className="p-8 text-center text-gray-500">Please log in to view account settings.</div>;

  const fullProfile = registeredUsers.find(u => u.username === currentUser.username);
  const [name, setName] = useState(fullProfile?.name || "");
  const [phone, setPhone] = useState(fullProfile?.phone || "");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedText, setCopiedText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!name.trim()) {
      setErrorMessage("Full Name is required");
      return;
    }
    onUpdateUserProfile(currentUser.username, {
      name,
      phone,
      ...(password ? { password } : {})
    });
    setSuccessMessage("Profile updated successfully!");
    setPassword("");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4" id="profile-management-view">
      
      {/* Profile Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Profile Settings</h3>
          </div>
          {successMessage && (
            <div className="flex items-center text-emerald-600 text-sm font-medium animate-fade-in">
              <CheckCircle className="h-4 w-4 mr-1" /> {successMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">New Password (leave blank to keep current)</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center text-red-500 text-xs mt-2">
              <AlertCircle className="h-3 w-3 mr-1" /> {errorMessage}
            </div>
          )}

          <button 
            type="submit"
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </form>
      </div>

      {/* Cloud Storage & GitHub Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">Cloud Storage & Git Center</h3>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Verified Stack
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Backup Panel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-700">
              <HardDrive className="h-4.5 w-4.5 text-indigo-500" />
              <h4 className="font-bold text-slate-800 text-xs">Clinical Data Backups</h4>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Export your clinical database anytime to keep it safe. 
              Contact <span className="font-mono font-bold text-slate-700">deepu.dillip19@gmail.com</span> for automation support.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const backupObj = { appName: "Sangeetha Physio", timestamp: new Date().toISOString(), patients, appointments, smsLogs, registeredUsers };
                  const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Backup_${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  setSuccessMessage("Backup downloaded!");
                  setTimeout(() => setSuccessMessage(""), 3000);
                }}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Clinical Backup</span>
              </button>

              <input type="file" ref={fileInputRef} accept=".json" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const parsed = JSON.parse(event.target?.result as string);
                    if (onImportBackup) onImportBackup(parsed);
                    setSuccessMessage("Backup Restored!");
                  } catch (err) { setErrorMessage("Invalid JSON file"); }
                };
                reader.readAsText(file);
              }} />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-2"
              >
                <Upload className="h-4 w-4 text-emerald-600" />
                <span>Restore Backup (.json)</span>
              </button>
            </div>
          </div>

          {/* GitHub Panel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-700">
              <Github className="h-4.5 w-4.5 text-slate-900" />
              <h4 className="font-bold text-slate-800 text-xs">GitHub Deployment Sync</h4>
            </div>
            <div className="bg-slate-900 text-slate-300 p-3 rounded-xl font-mono text-[10px] relative">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`git init\ngit add .\ngit commit -m "init"\ngit remote add origin https://github.com/deepu-dillip/sangeetha.git\ngit push -u origin main`);
                  setCopiedText("git");
                  setTimeout(() => setCopiedText(""), 2000);
                }}
                className="absolute right-2 top-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-[9px] flex items-center space-x-1"
              >
                <Copy className="h-3 w-3" />
                <span>{copiedText === "git" ? "Copied!" : "Copy"}</span>
              </button>
              <p className="text-yellow-500"># To deploy to GitHub:</p>
              <p>git init</p>
              <p>git add .</p>
              <p>git commit -m "update"</p>
              <p className="text-indigo-400 mt-1"># Push to Cloud</p>
              <p>git push origin main</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
