import { useState } from "react";

const BACKEND = "http://127.0.0.1:5000";

export default function App() {
  const [role, setRole] = useState("Full Stack Developer");
  const [questions, setQuestions] = useState([]);
  const [selectedQ, setSelectedQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Generate questions
  const generateQuestions = async () => {
    setLoading(true);
    setQuestions([]);
    setFeedback("");
    const res = await fetch(`${BACKEND}/generate-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    const list = data.questions.split("\n").filter((q) => q.trim() !== "");
    setQuestions(list);
    setLoading(false);
  };

  // Step 2: Evaluate answer
  const evaluateAnswer = async () => {
    if (!selectedQ || !answer) return;
    setLoading(true);
    setFeedback("");
    const res = await fetch(`${BACKEND}/evaluate-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: selectedQ, answer }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "Arial", padding: "0 20px" }}>
      
      <h1 style={{ color: "#0f3460", textAlign: "center" }}>🤖 AI Interview Prep Assistant</h1>
      <p style={{ textAlign: "center", color: "#666" }}>Practice interviews with AI-powered feedback</p>

      {/* Role Selection */}
      <div style={{ background: "#f0f4ff", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <h3>Select Job Role:</h3>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px" }}
        >
          <option>Full Stack Developer</option>
          <option>Frontend Developer</option>
          <option>Python Developer</option>
          <option>Data Analyst</option>
          <option>React Developer</option>
        </select>
        <button
          onClick={generateQuestions}
          style={{ marginTop: "12px", padding: "10px 24px", background: "#0f3460", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" }}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "20px" }}>
          <h3>📋 Interview Questions:</h3>
          {questions.map((q, i) => (
            <div
              key={i}
              onClick={() => { setSelectedQ(q); setAnswer(""); setFeedback(""); }}
              style={{
                padding: "12px", marginBottom: "8px", borderRadius: "6px", cursor: "pointer",
                background: selectedQ === q ? "#0f3460" : "#f9f9f9",
                color: selectedQ === q ? "white" : "#333",
                border: "1px solid #eee"
              }}
            >
              {q}
            </div>
          ))}
        </div>
      )}

      {/* Answer Box */}
      {selectedQ && (
        <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "20px" }}>
          <h3>✍️ Your Answer:</h3>
          <p style={{ color: "#0f3460", fontWeight: "bold" }}>{selectedQ}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            placeholder="Type your answer here..."
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" }}
          />
          <button
            onClick={evaluateAnswer}
            style={{ marginTop: "12px", padding: "10px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" }}
          >
            {loading ? "Evaluating..." : "Get AI Feedback"}
          </button>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{ background: "#f0fff4", padding: "20px", borderRadius: "10px", border: "1px solid #86efac" }}>
          <h3>💡 AI Feedback:</h3>
          <p style={{ lineHeight: "1.8", color: "#333" }}>{feedback}</p>
        </div>
      )}

    </div>
  );
}