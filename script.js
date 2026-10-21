
const initialMenus = [
    // 한식
    "김치찌개", "된장찌개", "제육볶음", "불고기", "비빔밥",
    "돌솥비빔밥", "삼겹살", "갈비탕", "순두부찌개", "부대찌개",
    "닭갈비", "찜닭", "감자탕", "국밥", "냉면", "칼국수",
    "김치볶음밥", "오므라이스",

    // 중식
    "짜장면", "짬뽕", "탕수육", "마라탕", "마라샹궈",
    "양꼬치", "볶음밥", "깐풍기", "마파두부", "울면",

    // 일식
    "초밥", "돈까스", "라멘", "우동", "소바", "규동",
    "가츠동", "텐동", "오코노미야끼", "회덮밥", "연어덮밥",
    "카레라이스",

    // 양식
    "파스타", "토마토 파스타", "크림 파스타", "스테이크",
    "피자", "리조또", "라자냐", "필라프", "그라탕", "샌드위치",

    // 분식
    "떡볶이", "라볶이", "김밥", "라면", "순대", "튀김",
    "쫄면", "잔치국수", "주먹밥",

    // 패스트푸드 및 기타
    "햄버거", "치킨", "핫도그", "타코", "부리또", "포케",
    "샐러드", "샤브샤브", "월남쌈", "쌀국수", "팟타이",
    "카레", "토스트", "베이글"
];

// 배열을 무작위 순서로 섞기
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

// 처음부터 무작위 순서로 메뉴 표시
let menus = shuffle([...initialMenus]);

const MENUS_PER_PAGE = 5;
let currentPage = 0;

const menuForm = document.getElementById("menuForm");
const menuInput = document.getElementById("menuInput");
const menuList = document.getElementById("menuList");
const menuCount = document.getElementById("menuCount");
const message = document.getElementById("message");

const recommendBtn = document.getElementById("recommendBtn");
const recommendResult = document.getElementById("recommendResult");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// 전체 페이지 수 계산
function getTotalPages() {
    return Math.ceil(menus.length / MENUS_PER_PAGE);
}

// 메뉴 목록 화면 표시
function renderMenus() {
    menuList.replaceChildren();

    const totalPages = getTotalPages();

    // 삭제 후 현재 페이지가 범위를 벗어나지 않도록 조정
    if (totalPages === 0) {
        currentPage = 0;
    } else if (currentPage >= totalPages) {
        currentPage = totalPages - 1;
    }

    menuCount.textContent = `전체 ${menus.length}개`;

    // 메뉴가 없는 경우
    if (menus.length === 0) {
        const li = document.createElement("li");
        li.className = "empty-message";
        li.textContent = "등록된 메뉴가 없습니다. 메뉴를 추가해 주세요!";
        menuList.appendChild(li);
    } else {
        // 현재 페이지의 메뉴 5개만 선택
        const start = currentPage * MENUS_PER_PAGE;
        const visibleMenus = menus.slice(
            start,
            start + MENUS_PER_PAGE
        );

        visibleMenus.forEach((menu, index) => {
            const li = document.createElement("li");

            const name = document.createElement("span");
            name.className = "menu-name";
            name.textContent = menu;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.type = "button";
            deleteBtn.textContent = "삭제";
            deleteBtn.setAttribute("aria-label", `${menu} 삭제`);

            // 전체 메뉴 배열에서 실제 위치를 계산
            const actualIndex = start + index;

            deleteBtn.addEventListener("click", () => {
                deleteMenu(actualIndex);
            });

            li.append(name, deleteBtn);
            menuList.appendChild(li);
        });
    }

    // 페이지 번호 및 이동 버튼 갱신
    pageInfo.textContent =
        `${totalPages === 0 ? 0 : currentPage + 1} / ${totalPages}`;

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled =
        totalPages === 0 || currentPage >= totalPages - 1;
}

// 메뉴 추가
menuForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newMenu = menuInput.value.trim();

    // 빈칸 검사
    if (newMenu === "") {
        message.textContent = "메뉴 이름을 입력해 주세요!";
        menuInput.focus();
        return;
    }

    // 중복 검사: 대소문자와 앞뒤 공백 무시
    const isDuplicate = menus.some(
        menu => menu.toLowerCase() === newMenu.toLowerCase()
    );

    if (isDuplicate) {
        message.textContent = "이미 등록된 메뉴입니다!";
        menuInput.focus();
        return;
    }

    menus.push(newMenu);

    // 새 메뉴가 추가된 마지막 페이지로 이동
    currentPage = getTotalPages() - 1;

    menuInput.value = "";
    message.textContent = `${newMenu} 메뉴를 추가했습니다!`;

    recommendResult.textContent = "메뉴가 추가되었습니다! 🎉";

    renderMenus();
    menuInput.focus();
});

// 메뉴 삭제
function deleteMenu(index) {
    const deletedMenu = menus[index];

    if (deletedMenu === undefined) return;

    menus.splice(index, 1);

    message.textContent = `${deletedMenu} 메뉴를 삭제했습니다.`;

    if (menus.length === 0) {
        recommendResult.textContent =
            "추천할 메뉴가 없습니다. 먼저 메뉴를 등록해 주세요!";
    }

    renderMenus();
}

// 이전 페이지
prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        message.textContent = "";
        renderMenus();
    }
});

// 다음 페이지
nextBtn.addEventListener("click", () => {
    if (currentPage < getTotalPages() - 1) {
        currentPage++;
        message.textContent = "";
        renderMenus();
    }
});

// 전체 메뉴 중 하나를 무작위 추천
recommendBtn.addEventListener("click", () => {
    if (menus.length === 0) {
        recommendResult.textContent =
            "추천할 메뉴가 없습니다. 먼저 메뉴를 등록해 주세요!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * menus.length);
    recommendResult.textContent =
        `🍽️ 오늘의 메뉴는 ${menus[randomIndex]}!`;
});

// 첫 화면 표시
renderMenus();
