// Dashboard.js
// import Link from 'next/link';
// import firebase from '../utils/firebase';


// export default function Dashboard() {
//   return (
//     <div>
//       <Link href="/TA-Allocation/allocation">
//         <h1>TA ALLOCATION</h1>
//       </Link>
//       <Link href="/Data-Form">
//         <h1>DATA FORM</h1>
//       </Link>
//     </div>
//   );
// }
import React from 'react';
import firebase from '../utils/firebase';

const Dashboard = () => {
  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Add other dashboard content here */}
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default Dashboard;
