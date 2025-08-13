import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi — I am Nova Assist. How can I help today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input) return;
    const user = { role: 'user', text: input };
    setMessages(m => [...m, user]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/rag/respond', { message: input });
      const assistant = { role: 'assistant', text: res.data.answer || 'Sorry, no answer' };
      setMessages(m => [...m, assistant]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: 'Error: ' + (e?.message || 'unknown') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Customer Support RAG with Sentiment Analysis</h1>
      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={'msg ' + (m.role === 'assistant' ? 'assistant' : 'user')}>
            <div className="role">{m.role}</div>
            <div className="text">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="composer">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} placeholder="Type a customer message..." />
        <button onClick={send} disabled={loading}>{loading ? 'Thinking...' : 'Send'}</button>
      </div>
    </div>
  );
}
