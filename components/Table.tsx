interface Row {
  id: string;
  name: string;
  qty: number;
  lastUpdate: string;
}

export default function Table({ data }: { data: Row[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Last Update</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.qty}</td>
            <td>{row.lastUpdate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
