import React, { useEffect, useState } from 'react';

function MemoForm({ onAdd }) {
  const [content, setContent] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content.trim());
    setContent('');
  };
  return (
    <div className="memo-form">
      <form onSubmit={submit} className="memo-input-wrapper">
        <input
          placeholder="한줄 메모를 입력하세요"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="memo-input"
        />
        <button type="submit" className="btn-add">추가</button>
      </form>
    </div>
  );
}

function MemoCard({ memo, onDelete }) {
  return (
    <div className="memo-card">
      <div className="memo-date">{new Date(memo.createdAt).toLocaleString('ko-KR')}</div>
      <div className="memo-content">{memo.content}</div>
      <div className="memo-actions">
        <button onClick={() => onDelete(memo.id)} className="btn-delete">삭제</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [memos, setMemos] = useState([]);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
    
    (async () => {
      try {
        const res = await fetch('/api/memos', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load memos');
        setMemos(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [token]);

  const addMemo = async (content) => {
    try {
      const res = await fetch('/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add memo');
      setMemos(prev => [data, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteMemo = async (id) => {
    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete memo');
      setMemos(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="home-title">한줄 메모장</h1>
          <div className="header-user">
            <span className="user-email">{userEmail}님</span>
            <button onClick={logout} className="btn-logout">로그아웃</button>
          </div>
        </div>
      </header>
      <div className="home-content">
        {error && <div className="error-message">{error}</div>}
        <MemoForm onAdd={addMemo} />
        <div className="memo-grid">
          {memos.map(memo => (
            <MemoCard key={memo.id} memo={memo} onDelete={deleteMemo} />
          ))}
        </div>
      </div>
    </div>
  );
}