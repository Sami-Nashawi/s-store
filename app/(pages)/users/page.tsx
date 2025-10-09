export default function UsersPage() {
  const users = [
    { id: "1", name: "Manager Ali", role: "Manager" },
    { id: "2", name: "Worker Omar", role: "Worker" },
  ];

  return (
    <div>
      <h1>👥 Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} — {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
