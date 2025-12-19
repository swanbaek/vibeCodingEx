import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign up failed');
      navigate('/login', { state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">회원가입</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label>이메일</label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email" 
              required 
              className="form-input"
              placeholder="example@email.com"
            />
          </div>
          <div className="form-group">
            <label>사용자명</label>
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              type="text" 
              required 
              className="form-input"
              placeholder="사용자명을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              type="password" 
              required 
              className="form-input"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary">회원가입</button>
        </form>
        <p className="auth-footer">
          이미 계정이 있나요? <a href="/login" className="auth-link">로그인</a>
        </p>
      </div>
    </div>
  );
}