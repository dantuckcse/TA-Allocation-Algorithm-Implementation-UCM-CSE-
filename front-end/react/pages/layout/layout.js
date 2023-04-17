import styles from "./layout.module.css"
import Head from "next/head"

export default function Layout({ children, home }) {
    return(
        <div className={styles.container}>
            <Head>
                <title>Home</title>
            </Head>
            <header className={styles.header}>
                { home? (
                    <h1>Welcome!</h1>
                ) : (
                    ""
                )}
            </header>
            <main> {children} </main>
            {/* <footer className={styles.footer}>Footer</footer> */}
        </div>
    )
}