// 각 페이지의 컨텐츠를 정의
const pages = {
    about: `
        <h2>소개</h2>
        <p>소개 페이지 content</p>
    `,
    project: `
        <h2>프로젝트</h2>
        <p>프로젝트 페이지 content</p>
    `
};

// 페이지 렌더링 함수
function renderPage(pageId) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = pages[pageId] || pages.home;
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 초기 페이지 로드
    renderPage('about');

    // 사이드바 네비게이션 이벤트 처리
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.page;
            renderPage(pageId);
        });
    });
});