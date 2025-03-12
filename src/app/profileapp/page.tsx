// app/profileapp/page.tsx
import Profile from "@/components/Profile";

export default function ProfilePage() {
  const userId = "testUser123";
  
  return (
      <div className="min-h-screen">
      <Profile userId={userId} />
    </div>
  );
}
