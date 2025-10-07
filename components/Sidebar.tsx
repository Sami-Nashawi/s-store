import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>S-Store</h2>
      <nav>
        <Link href="/">🏠 Dashboard</Link>
        <Link href="/add-material">➕ Add Material</Link>
        <Link href="/update-material">🔄 Update Material</Link>
        {/* <Link href="/withdraw"> Withdraw</Link> */}
        <Link href="/materials">📋 Materials</Link>
        <Link href="/users">👥 Users</Link>
      </nav>
    </aside>
  );
}
