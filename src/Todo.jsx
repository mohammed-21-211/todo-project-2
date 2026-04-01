import { useState, useRef } from "react";

const FILTERS = ["All", "Active", "Completed"];

const CATEGORIES = [
  { label: "Work", color: "#FF6B6B" },
  { label: "Personal", color: "#4ECDC4" },
  { label: "Health", color: "#45B7D1" },
  { label: "Ideas", color: "#FFA07A" },
];

  function CheckIcon({ checked }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7L5.5 10.5L12 3.5"
        stroke={checked ? "#fff" : "transparent"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M5.5 2.5h4M2.5 4.5h10M4 4.5l.6 7a1 1 0 001 .9h3.8a1 1 0 001-.9L11 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES.find((c) => c.label === todo.category);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 18px",
        borderRadius: "14px",
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.2s ease",
        animation: "slideIn 0.3s ease",
        cursor: "default",
      }}
    >
      <button
        onClick={() => onToggle(todo.id)}
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "8px",
          border: `2px solid ${todo.completed ? cat?.color || "#aaa" : "rgba(255,255,255,0.2)"}`,
          background: todo.completed ? cat?.color || "#aaa" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.2s ease",
        }}
      >
        <CheckIcon checked={todo.completed} />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            fontFamily: "'Lora', serif",
            color: todo.completed ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.9)",
            textDecoration: todo.completed ? "line-through" : "none",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {todo.text}
        </p>
        {todo.category && (
          <span
            style={{
              fontSize: "11px",
              fontFamily: "'DM Sans', sans-serif",
              color: cat?.color || "#aaa",
              opacity: 0.8,
              letterSpacing: "0.04em",
            }}
          >
            {todo.category}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.25)",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          opacity: hovered ? 1 : 0,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B6B")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Design the new landing page", category: "Work", completed: false },
    { id: 2, text: "Morning run — 5k", category: "Health", completed: true },
    { id: 3, text: "Read 30 pages before sleep", category: "Personal", completed: false },
    { id: 4, text: "Explore CSS scroll-driven animations", category: "Ideas", completed: false },
  ]);
  const [input, setInput] = useState("");
  const [selectedCat, setSelectedCat] = useState("Work");
  const [filter, setFilter] = useState("All");
  const inputRef = useRef(null);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: Date.now(), text, category: selectedCat, completed: false },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.completed));

  const filtered = todos.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0f0f13; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .todo-root {
          min-height: 100vh;
          background: #0f0f13;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 60px 20px;
          font-family: 'DM Sans', sans-serif;
          animation: fadeIn 0.5s ease;
        }
        .card {
          width: 100%;
          max-width: 520px;
          background: #17171f;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px 32px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .input-row { display: flex; gap: 10px; margin-top: 24px; }
        .todo-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
        }
        .todo-input::placeholder { color: rgba(255,255,255,0.25); }
        .todo-input:focus { border-color: rgba(255,255,255,0.25); }
        .add-btn {
          background: #E8C96D;
          color: #0f0f13;
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1;
        }
        .add-btn:hover { background: #f0d880; transform: scale(1.05); }
        .filters { display: flex; gap: 6px; margin-top: 28px; margin-bottom: 4px; }
        .filter-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.45);
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .filter-btn.active {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }
        .filter-btn:hover:not(.active) { color: rgba(255,255,255,0.7); }
        .list { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; min-height: 60px; }
        .empty {
          text-align: center;
          color: rgba(255,255,255,0.2);
          font-size: 13px;
          padding: 32px 0;
          font-style: italic;
          font-family: 'Lora', serif;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer-count { font-size: 12px; color: rgba(255,255,255,0.3); }
        .clear-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.25);
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
        }
        .clear-btn:hover { color: #FF6B6B; }
        .cat-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
        .cat-pill {
          border-radius: 8px;
          padding: 5px 12px;
          font-size: 11px;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="todo-root">
        <div className="card">
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "#E8C96D", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
                My Tasks
              </p>
              <h1 style={{ margin: "4px 0 0", fontSize: "28px", fontFamily: "'Lora', serif", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                What's the plan<br />
                <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>for today?</span>
              </h1>
            </div>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg, #E8C96D 0%, #f0a060 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px"
            }}>✦</div>
          </div>

          {/* Input */}
          <div className="input-row">
            <input
              ref={inputRef}
              className="todo-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task…"
            />
            <button className="add-btn" onClick={addTodo}>+</button>
          </div>

          {/* Category pills */}
          <div className="cat-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className="cat-pill"
                onClick={() => setSelectedCat(cat.label)}
                style={{
                  background: selectedCat === cat.label ? cat.color + "22" : "transparent",
                  borderColor: selectedCat === cat.label ? cat.color : "rgba(255,255,255,0.1)",
                  color: selectedCat === cat.label ? cat.color : "rgba(255,255,255,0.35)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="list">
            {filtered.length === 0 ? (
              <div className="empty">Nothing here yet — add something above.</div>
            ) : (
              filtered.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="footer">
            <span className="footer-count">
              {activeCount} task{activeCount !== 1 ? "s" : ""} remaining
            </span>
            {todos.some((t) => t.completed) && (
              <button className="clear-btn" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
