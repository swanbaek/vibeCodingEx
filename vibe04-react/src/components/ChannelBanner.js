import React from 'react';
import './ChannelBanner.css';

function ChannelBanner() {
    return (
        <div className="channel-banner">
            <img src="/images/유튜브채널 백그라운드 이미지.png" alt="채널 배너" className="banner-image" />
            <div className="channel-info">
                <div className="channel-avatar">C</div>
                <div className="channel-details">
                    <h1 className="channel-name">Cursor AI 무료 강의</h1>
                    <p className="channel-stats">구독자 125만명 • 동영상 10개</p>
                </div>
                <button className="subscribe-btn">구독</button>
            </div>
        </div>
    );
}

export default ChannelBanner;
