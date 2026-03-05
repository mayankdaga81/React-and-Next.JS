// This component demonstrates conditional rendering: content shows based on certain conditions.
// When mapping over arrays, React needs a unique 'key' prop to identify each item. Without keys, React can't optimize re-renders efficiently.
// Always provide a unique key for each item in a list.

function QueueDisplay({ queue, onUpdateStatus, onRemove }) {
  const getStatusColor = (_status) => {
    switch (_status) {
      case "Waiting":
        return "var(--warning)";
      case "Serving":
        return "var(--success)";
      case "Completed":
        return "var(--info)";
      default:
        return "var(--text)";
    }
  };

  return (
    <div className="queue-display">
      <h2>Current Queue</h2>
      {queue.length === 0 ? (
        <p>No Customer Data</p>
      ) : (
        <div className="queue-list">
          {queue.map((customer) => (
            <div className="queue-item" key={customer.id}>
              <div className="customer-info">
                <h3>{customer.name}</h3>
                <p>{customer.service}</p>
                <span
                  className="status"
                  style={{ color: getStatusColor(customer.status) }}
                >
                  {customer.status}
                </span>
              </div>
              <div className="actions">
                {customer.status === "Waiting" && (
                  <button
                    className="serve-btn"
                    onClick={() => onUpdateStatus(customer.id, "Serving")}
                  >
                    Serve
                  </button>
                )}
                {customer.status === "Serving" && (
                  <button
                    className="complete-btn"
                    onClick={() => onUpdateStatus(customer.id, "Completed")}
                  >
                    Complete
                  </button>
                )}
                <button
                  className="remove-btn"
                  onClick={() => onRemove(customer.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QueueDisplay;
