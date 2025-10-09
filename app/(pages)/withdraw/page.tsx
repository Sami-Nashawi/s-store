export default function WithdrawPage() {
  return (
    <div>
      <h1>📤 Withdraw Material</h1>
      <form className="form">
        <label>
          Material ID / Scan QR:
          <input type="text" placeholder="Scan or enter ID" />
        </label>
        <label>
          Quantity:
          <input type="number" placeholder="0" />
        </label>
        <button type="submit">Withdraw</button>
      </form>
    </div>
  );
}
