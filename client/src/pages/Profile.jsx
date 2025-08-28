import { useEffect, useState } from "react";

// 🔹 Fetch profile data
async function fetchProfile() {
  try {
    const res = await fetch("/api/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}

// 🔹 Fetch recent journeys
async function fetchJourneys() {
  try {
    const res = await fetch("/api/journeys/recent");
    if (!res.ok) throw new Error("Failed to fetch journeys");
    return await res.json();
  } catch (err) {
    console.error("Error fetching journeys:", err);
    return [];
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    async function loadData() {
      const profileData = await fetchProfile();
      const journeysData = await fetchJourneys();

      setProfile(profileData);
      setJourneys(journeysData);
    }
    loadData();
  }, []);

  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatar || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h3 className="text-xl font-bold">{profile.name}</h3>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-600">{profile.phone}</p>
            <p className="text-gray-600">{profile.college}</p>
          </div>
        </div>
      </div>

      {/* Recent Journeys Section */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Journeys</h2>
        {journeys.length === 0 ? (
          <p className="text-gray-500">No journeys found.</p>
        ) : (
          <ul className="space-y-4">
            {journeys.map((j) => (
              <li
                key={j.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {j.from} → {j.to}
                  </p>
                  <p className="text-sm text-gray-600">
                    {j.date} at {j.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    Mode: {j.mode.toUpperCase()} | People: {j.people}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
