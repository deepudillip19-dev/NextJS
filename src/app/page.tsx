'use client';
import MyAccount from '../components/MyAccount';

export default function Home() {
  // Mock data so the component doesn't crash
  const mockUser = {
    name: "Deepu Dillip",
    username: "admin",
    role: "admin" as const
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <MyAccount 
        currentUser={mockUser} 
        registeredUsers={[mockUser]} 
        onUpdateUserProfile={(user, fields) => console.log(user, fields)}
        patients={[]}
        appointments={[]}
      />
    </main>
  );
}
