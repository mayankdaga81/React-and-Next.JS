// What is Queue Management?
// This application manages customer queues: a form collects customer data, and a display area shows the queue, allows status changes, and deletions.
// The form and display are in separate components, so we use props to pass data and functions.

// Functions as props: All handler functions are defined in App.jsx and passed down to QueueForm.jsx or QueueDisplay.jsx. Just like passing variables, we pass functions. When destructuring or passing, we don't specify arguments; they're used directly in the child component.

// addToQueue function:
// We maintain a queue array of objects. Data comes from QueueForm; we add it to the existing queue, plus generate an id and set initial status to "Waiting".

// updateStatus and removeFromQueue are pure functions that update the queue state immutably.

import { useState } from "react";
import "./App.css";
import QueueForm from "./components/QueueForm";
import QueueDisplay from "./components/QueueDisplay";

export default function App() {
  const [queue, setQueue] = useState([]);

  function addToQueue(customer) {
    console.log(customer, " may data");
    setQueue([...queue, { ...customer, id: Date.now(), status: "Waiting" }]);
  }

  function updateStatus(id, _status) {
    setQueue(
      queue.map((item) =>
        item.id === id ? { ...item, status: _status } : item,
      ),
    );
  }

  function removeFromQueue(_id) {
    setQueue(queue.filter((item) => item.id !== _id));
  }

  return (
    <div className="app">
      <header>
        <h1>Queue Management Application</h1>
        <p>Manage your customers effeciently</p>
      </header>
      <main>
        <QueueForm onAdd={addToQueue} />
        <QueueDisplay
          queue={queue}
          onUpdateStatus={updateStatus}
          onRemove={removeFromQueue}
        />
      </main>
    </div>
  );
}
