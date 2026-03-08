import { useState } from "react";

// ComplexProps
// The whole aim in this code is to handle complex data.
// In the ComplexProps function, we have a user array, which has objects, whichhas data, just like how we receive in API calls.
// Instead of adding data one by one in the Component call for UserProfileCard, we have used the spread option form JS, which will automatically spread the values  which we are expecting.

// UserProfileCard
// In the className for div, we have used data form the theme, which we have got via props.
// We have also showcased data form the user.
// Object.entries() converts an object into an array of key–value pairs so that you can iterate over it.
// This is used for iterating over objects, where we first convert them into arrays, and then we can iterate over then using loops like map, or something.
// Folllowed by Object.entries(), we have used .map(), which showcases an array of object, which will be created with the key and value of the objects, and we are showcasing the same.

function UserProfileCard({ user, theme, actions }) {
  const [message, setMessage] = useState("");

  return (
    <div
      className={`p-6 rounded-xl ${theme.backgroundColor} ${theme.textColor}`}
    >
      <div className="font-bold text-lg">
        {user.avatar} {user.role}
      </div>

      <div className="text-sm">{user.name}</div>
      <div className="text-sm mb-3">{user.email}</div>

      {user.stats && (
        <div className="mb-3">
          {Object.entries(user.stats).map(([key, value]) => (
            <div key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          className={actions.primary.className}
          onClick={() => setMessage(actions.primary.label)}
        >
          {actions.primary.label}
        </button>

        <button
          className={actions.secondary.className}
          onClick={() => setMessage(actions.secondary.label)}
        >
          {actions.secondary.label}
        </button>
      </div>

      {message && <div className="mt-3 text-sm">Action: {message}</div>}
    </div>
  );
}

function ComplexProps() {
  const users = [
    {
      user: {
        name: "Alice Johnson",
        email: "alice@example.com",
        avatar: "👩‍💼",
        role: "Admin",
        status: "Active",
        stats: {
          posts: 145,
          followers: 2834,
          following: 421,
        },
      },
      theme: {
        backgroundColor: "bg-gradient-to-br from-purple-100 to-blue-100",
        textColor: "text-gray-800",
      },
      actions: {
        primary: {
          label: "View Profile",
          className:
            "bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600",
        },
        secondary: {
          label: "Message",
          className:
            "bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300",
        },
      },
    },
    {
      user: {
        name: "Bob Smith",
        email: "bob@example.com",
        avatar: "👨‍💻",
        role: "Developer",
        status: "Online",
        stats: {
          projects: 28,
          commits: 1523,
          reviews: 89,
        },
      },
      theme: {
        backgroundColor: "bg-gradient-to-br from-green-100 to-teal-100",
        textColor: "text-gray-800",
      },
      actions: {
        primary: {
          label: "View Profile",
          className:
            "bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600",
        },
        secondary: {
          label: "Collaborate",
          className:
            "bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300",
        },
      },
    },
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold">User Profile Data</h3>

      <div className="flex flex-wrap gap-4">
        {users.map((userData, index) => (
          <UserProfileCard key={index} {...userData} />
        ))}
      </div>
    </div>
  );
}

export default ComplexProps;
