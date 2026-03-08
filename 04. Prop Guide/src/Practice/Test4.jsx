// Create a UserContext that stores user information.
// Requirements
// User object:
// {
//   name: "Mayank",
//   role: "Developer",
//   location: "India"
// }

// Components:
// Navbar → show username
// ProfileCard → show full user details
// Dashboard → show role

// Goal:
// All components should access user data directly using useContext.

import { useTest4 } from "../hooks/useTest4.jsx";

function NavBar() {
  const { name } = useTest4();

  return <div>{`Howdy, ${name}`}</div>;
}

function ProfileCard() {
  const { name, role, location } = useTest4();

  return (
    <div className="flex flex-wrap gap-4 ">
      <div>{`Name: ${name} `}</div>
      <div>{`Role: ${role} `}</div>
      <div>{`Location: ${location} `}</div>
    </div>
  );
}

function Dashboard() {
  const { role } = useTest4();

  return <div>{`Wooh! You are a ${role}`}</div>;
}

function Test4() {
  return (
    <div className="shadow-md rounded-lg p-4 flex flex-col items-center text-gray-800 justify-center">
      <NavBar />
      <ProfileCard />
      <Dashboard />
    </div>
  );
}

export default Test4;
