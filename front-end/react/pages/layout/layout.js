import styles from "./layout.module.css";
import Head from "next/head";
import Header from "../Header"; 

export default function Layout({ children, home, user }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
      </Head>
      <Header user={user} /> {/* Pass the user prop to the Header component */}
      <main>{children}</main>
    </div>
  );
}
