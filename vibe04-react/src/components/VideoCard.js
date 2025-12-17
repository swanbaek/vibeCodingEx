import React from 'react';
import './VideoCard.css';

function VideoCard({ video }) {
    const handleClick = () => {
        window.open(video.url, '_blank');
    };

    return (
        <div className="video-card" onClick={handleClick}>
            <div className="thumbnail-container">
                <img src={video.thumbnail} alt={video.title} className="thumbnail" />
                <span className="duration">{video.duration}</span>
            </div>
            <div className="video-info">
                <div className="video-avatar">C</div>
                <div className="video-details">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-channel">Cursor AI 무료 강의</p>
                    <p className="video-stats">조회수 {video.views}회 • {video.uploadDate}</p>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
