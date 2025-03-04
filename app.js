const projectsData = {
    "1": {
        title: "Project Title 1",
        description: "Project Description 1",
        techStack: ["HTML", "CSS", "JavaScript"],
        githubUrl: "https://github.com/yourusername/project1"
    },
    // 더 많은 프로젝트 추가 가능
};


// 페이지 렌더링 함수
function renderPage(pageId) {
    const contentDiv = document.getElementById('content');

    // 로딩 상태 표시
    contentDiv.innerHTML = '<div class="loading">로딩 중...</div>';

    // 활성 네비게이션 표시
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });

    // 프로젝트 상세 페이지 처리
    if (pageId.startsWith('project-detail/')) {
        const projectId = pageId.split('/')[1];
        const project = projectsData[projectId];

        if (project) {
            fetch('views/detail.html')
                .then(response => response.text())
                .then(html => {
                    contentDiv.innerHTML = html;

                    const url = `${window.location.pathname}#${pageId}`;
                    history.pushState({ pageId }, '', url);
                });
            return;
        }
    }

    fetch(`views/${pageId}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
            // URL 업데이트
            // 질문 - 해시 라우팅이 뭐지? 왜 일반 라우팅과 다르지? /about일때는 새로고침하면 not found 나오는데 왜 그런지?
            const url = `${window.location.pathname}#${pageId}`;
            history.pushState({ pageId }, '', url);
        })
        .catch(error => {
            console.error('Error loading page:', error);
            contentDiv.innerHTML = '<p>페이지를 불러오는 데 문제가 발생했습니다.</p>';
        });
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // URL 해시에 따른 초기 페이지 로드
    const initialPage = window.location.hash.slice(1) || 'about';
    renderPage(initialPage);

    // 사이드바 네비게이션 이벤트 처리
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.page;
            renderPage(pageId);
        });
    });

    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.pageId) {
            renderPage(e.state.pageId);
        }
    });

    // 프로젝트 카드 클릭 이벤트 처리 - 수정된 부분
    document.addEventListener('click', (e) => {
        const cardLink = e.target.closest('.card-link');
        if (cardLink) {
            e.preventDefault();
            const href = cardLink.getAttribute('href');
            const pageId = href.slice(1); // '#' 제거
            renderPage(pageId);
        }
    });
});

app.get('/project/:id', (req, res) => {
    const projectId = req.params.id;
    res.render('detail', { projectId });
});