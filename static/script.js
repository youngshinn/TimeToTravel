// 사진 슬라이드 기능 초기화 함수
function initPhotoSlides() {
    const photoSlides = document.querySelector('#photoSlides');
    const photoIndicators = document.querySelectorAll('#photoIndicators span');
    let photoIndex = 0;
    const totalSlides = photoSlides.children.length;

    function showNextPhotoSlide() {
        photoIndex++;
        photoSlides.style.transform = `translateX(${-photoIndex * 100}%)`;
        updatePhotoIndicators();

        if (photoIndex === totalSlides - 1) {
            setTimeout(() => {
                photoSlides.style.transition = 'none';
                photoSlides.style.transform = 'translateX(0)';
                photoIndex = 0;
                updatePhotoIndicators();
                setTimeout(() => {
                    photoSlides.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }, 500);
        }
    }

    function updatePhotoIndicators() {
        let currentSlide = photoIndex === totalSlides - 1 ? 0 : photoIndex;
        photoIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentSlide);
        });
    }

    setInterval(showNextPhotoSlide, 3000);

    photoIndicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            photoIndex = i;
            photoSlides.style.transform = `translateX(${-photoIndex * 100}%)`;
            updatePhotoIndicators();
        });
    });
}

// 지도 슬라이드 기능 초기화 함수
function initMapSlides() {
    const mapSlides = document.querySelectorAll('.map-slide');
    let activeMapIndex = null;

    function toggleMap(index) {
        if (activeMapIndex === index) {
            closeMap();
        } else {
            showMap(index);
        }
    }

    function showMap(index) {
        closeMap();
        const currentOrder = Array.from(mapSlides).map(slide => slide.style.order);
        if (index === 0) {
            mapSlides[0].style.order = currentOrder[1];
            mapSlides[1].style.order = currentOrder[2];
            mapSlides[2].style.order = currentOrder[0];
        } else if (index === 1) {
            mapSlides[0].style.order = currentOrder[2];
            mapSlides[1].style.order = currentOrder[0];
            mapSlides[2].style.order = currentOrder[1];
        } else if (index === 2) {
            mapSlides[0].style.order = currentOrder[1];
            mapSlides[1].style.order = currentOrder[2];
            mapSlides[2].style.order = currentOrder[0];
        }
        mapSlides[index].classList.add('active');
        activeMapIndex = index;
    }

    function closeMap() {
        mapSlides.forEach(slide => slide.classList.remove('active'));
        activeMapIndex = null;
    }

    mapSlides.forEach((slide, index) => {
        slide.addEventListener('click', () => toggleMap(index));
    });
}
// 자동 완성 기능 초기화 함수
function initAutocomplete() {
    const searchInput = document.querySelector('#searchInput');
    const autocompleteResults = document.querySelector('#autocomplete-results');

    searchInput.addEventListener('input', function() {
        const query = this.value;

        if (query.length > 1) { // 최소 두 글자 이상 입력해야 자동 완성 시작
            fetch(`/autocomplete?query=${encodeURIComponent(query)}`) // 서버에서 자동 완성 제안 요청
                .then(response => response.json())
                .then(data => {
                    autocompleteResults.innerHTML = '';
                    data.suggestions.forEach(suggestion => {
                        const div = document.createElement('div');
                        div.textContent = suggestion;
                        div.addEventListener('click', () => {
                            searchInput.value = suggestion;
                            autocompleteResults.innerHTML = '';
                        });
                        autocompleteResults.appendChild(div);
                    });
                    autocompleteResults.style.display = 'block'; // 결과 보이기
                })
                .catch(error => console.error('자동 완성 오류:', error));
        } else {
            autocompleteResults.innerHTML = '';
            autocompleteResults.style.display = 'none'; // 입력이 두 글자 미만일 때 결과 숨기기
        }
    });

    document.addEventListener('click', function(e) {
        if (!autocompleteResults.contains(e.target) && e.target !== searchInput) {
            autocompleteResults.innerHTML = '';
            autocompleteResults.style.display = 'none';
        }
    });
}

// 페이지 전환 시 스크립트 초기화
function reapplyScripts() {
    initPhotoSlides(); // 사진 슬라이드 기능 초기화
    initMapSlides(); // 지도 슬라이드 기능 초기화
    initAutocomplete(); // 자동 완성 기능 초기화
}

// 페이지 전환 스크립트
document.querySelectorAll('.load-page').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('data-url'); // 클릭된 링크의 data-url 속성 값 가져오기

        fetch(url) // Fetch API를 통해 외부 URL의 콘텐츠 가져오기
            .then(response => response.text())
            .then(data => {
                // 페이지 전체를 교체하기 위해 전체 HTML을 문서에 적용
                document.open();
                document.write(data);
                document.close();

                // URL 업데이트 (사용자에게 페이지가 전환된 것처럼 보이도록)
                history.pushState({ path: url }, '', url);

                // 새 페이지에서 스크립트 재적용
                reapplyScripts();
            })
            .catch(error => console.error('페이지 로딩 오류:', error)); // 오류 처리
    });
});

// 뒤로 가기/앞으로 가기 버튼 처리
window.addEventListener('popstate', () => {
    const currentPath = window.location.pathname; // 현재 경로 가져오기
    fetch(currentPath)
        .then(response => response.text())
        .then(data => {
            // 페이지 전체를 교체하기 위해 전체 HTML을 문서에 적용
            document.open();
            document.write(data);
            document.close();

            // 새 페이지에서 스크립트 재적용
            reapplyScripts();
        })
        .catch(error => console.error('페이지 로딩 오류:', error)); // 오류 처리
});

// 페이지가 처음 로드될 때 스크립트 적용
reapplyScripts();

