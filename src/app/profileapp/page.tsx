import Profile from "@/components/Profile";

export default function ProfilePage() {
  const userId = "testUser123"; // Replace with actual user authentication logic

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Profile userId={userId} />
    </div>
  );
}
