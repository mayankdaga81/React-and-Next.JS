import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import "../App.css";

// This component has a form that, on submit, creates an object {name, service} and passes it to the onAdd prop (defined in App.jsx).
// {name, service} is shorthand for {name: name, service: service}.

export default function QueueForm({ onAdd }) {
  const [name, setName] = useState("");
  const [service, setService] = useState("");

  // For any form, we have to stop the deafult behaviour of form, which is to collect the form data and send it to the server specified in the action attribute, which causes a full page reload.
  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !service.trim()) return;
    onAdd({ name, service });
    setName("");
    setService("");
  }

  return (
    <>
      <form className="queue-form" onSubmit={handleSubmit}>
        <h2> Add to queue</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Customer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">Select Service</option>
            <option value="consultation">Consultation</option>
            <option value="payment">Payment</option>
            <option value="support">Support</option>
          </select>
        </div>
        <button type="submit">
          <FaUserPlus /> Add customer
        </button>
      </form>
    </>
  );
}
