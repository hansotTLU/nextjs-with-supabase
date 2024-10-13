"use client";

import { useUser } from "../../context/UserContext";

export default function ClientUserComponent() {
  const { user, loading } = useUser();

  return (
    <>
      <div className="my-4 text-center">
        {loading ? (
          <p>Loading user info...</p>
        ) : user ? (
          <p>Logged in as: {user.email}</p>
        ) : (
          <p>No user is logged in</p>
        )}
      </div>
    </>
  );
}
