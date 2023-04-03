import Link from "next/link"

export default function Header() {
    return (
        <nav className="nav-bar">
            <h1 className="ucm-logo">
                <span className="UC">UC</span>MERCED
            </h1>
            <div className="nav-items">
            <h3 id="nav-item">
                    <Link href="/">
                        HOME
                    </Link>
                </h3>
                <h3 id="nav-item">
                    <Link href="/Initial-Faculty-Ranking">
                        INITIAL FACULTY RANKING
                    </Link>
                </h3>
                <h3 id="nav-item">
                    <Link href="/TA-Allocation/allocation">
                        TA ALLOCATION
                    </Link>
                </h3>
            </div>
        </nav>
    )
}