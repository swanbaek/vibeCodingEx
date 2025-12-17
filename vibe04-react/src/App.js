import React from 'react';
import Header from './components/Header';
import ChannelBanner from './components/ChannelBanner';
import VideoCard from './components/VideoCard';
import { videos } from './data/videos';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <ChannelBanner />
      <div className="content">
        <div className="tabs">
          <button className="tab active">홈</button>
          <button className="tab">동영상</button>
          <button className="tab">재생목록</button>
          <button className="tab">커뮤니티</button>
          <button className="tab">정보</button>
        </div>
        <div className="video-grid">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
