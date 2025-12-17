import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-btn">☰</button>
                <div className="logo">
                    <span className="logo-icon">▶</span>
                    <span className="logo-text">YouTube</span>
                </div>
            </div>
            <div className="header-center">
                <input type="text" placeholder="검색" className="search-input" />
                <button className="search-btn">🔍</button>
            </div>
            <div className="header-right">
                <button className="icon-btn">📹</button>
                <button className="icon-btn">🔔</button>
                <div className="user-avatar">U</div>
            </div>
        </header>
    );
}

export default Header;
