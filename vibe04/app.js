const { useState } = React;

// 비디오 데이터
const videos = [
    {
        id: 1,
        thumbnail: 'images/유튜브 섬네일 01.png',
        title: 'Cursor AI 시작하기 - 설치부터 기본 사용법까지',
        views: '15,234',
        uploadDate: '2개월 전',
        duration: '12:34',
        description: 'AI 코딩 도구 Cursor의 기초를 배워봅니다. 설치 방법과 기본적인 사용법을 알려드립니다.'
    },
    {
        id: 2,
        thumbnail: 'images/유튜브 섬네일 02.png',
        title: 'Cursor AI로 HTML/CSS 코딩하기 - 실전 프로젝트',
        views: '12,891',
        uploadDate: '1개월 전',
        duration: '18:45',
        description: 'Cursor를 활용해서 실제 웹사이트를 만들어봅니다. HTML과 CSS 작성이 얼마나 쉬워지는지 체험해보세요.'
    },
    {
        id: 3,
        thumbnail: 'images/유튜브 섬네일 03.png',
        title: 'JavaScript 자동 완성의 신세계 - Cursor AI 꿀팁',
        views: '18,456',
        uploadDate: '3주 전',
        duration: '15:22',
        description: 'JavaScript 코딩이 10배 빨라지는 Cursor AI의 자동완성 기능을 알아봅니다.'
    },
    {
        id: 4,
        thumbnail: 'images/유튜브 섬네일 04.png',
        title: 'React 컴포넌트를 AI로 만들기',
        views: '22,109',
        uploadDate: '2주 전',
        duration: '20:15',
        description: 'Cursor AI를 사용해서 React 컴포넌트를 빠르게 생성하고 수정하는 방법을 배웁니다.'
    },
    {
        id: 5,
        thumbnail: 'images/유튜브 섬네일 05.png',
        title: 'Cursor Composer 완벽 가이드',
        views: '25,678',
        uploadDate: '1주 전',
        duration: '22:30',
        description: 'Cursor의 강력한 기능인 Composer를 마스터해봅시다. 여러 파일을 동시에 편집하는 방법을 알려드립니다.'
    },
    {
        id: 6,
        thumbnail: 'images/유튜브 섬네일 06.png',
        title: '버그 찾기가 이렇게 쉬웠나? Cursor 디버깅',
        views: '19,234',
        uploadDate: '5일 전',
        duration: '16:45',
        description: 'AI의 도움으로 버그를 찾고 수정하는 과정을 실시간으로 보여드립니다.'
    },
    {
        id: 7,
        thumbnail: 'images/유튜브 섬네일 07.png',
        title: 'Cursor로 API 연동하기 - 실전 튜토리얼',
        views: '17,892',
        uploadDate: '3일 전',
        duration: '19:10',
        description: 'REST API를 연동하는 코드를 Cursor AI와 함께 작성해봅니다.'
    },
    {
        id: 8,
        thumbnail: 'images/유튜브 섬네일 08.png',
        title: '데이터베이스 연결부터 CRUD까지',
        views: '21,456',
        uploadDate: '2일 전',
        duration: '25:30',
        description: 'Cursor를 활용해서 데이터베이스 연동 코드를 작성하고 CRUD 기능을 구현합니다.'
    },
    {
        id: 9,
        thumbnail: 'images/유튜브 섬네일 09.png',
        title: '풀스택 개발자가 되는 가장 빠른 길',
        views: '28,901',
        uploadDate: '1일 전',
        duration: '30:15',
        description: '프론트엔드부터 백엔드까지, Cursor AI와 함께라면 풀스택 개발이 어렵지 않습니다.'
    },
    {
        id: 10,
        thumbnail: 'images/유튜브 섬네일 10.png',
        title: 'Cursor AI 고급 기능 총정리 - 프로처럼 사용하기',
        views: '32,567',
        uploadDate: '12시간 전',
        duration: '28:40',
        description: 'Cursor의 모든 고급 기능을 총정리합니다. 이 영상 하나면 Cursor 마스터!'
    }
];

// 헤더 컴포넌트
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

// 채널 배너 컴포넌트
function ChannelBanner() {
    return (
        <div className="channel-banner">
            <img src="images/유튜브채널 백그라운드 이미지.png" alt="채널 배너" className="banner-image" />
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

// 비디오 카드 컴포넌트
function VideoCard({ video }) {
    return (
        <div className="video-card">
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

// 메인 앱 컴포넌트
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

// 앱 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
