const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWvaGyXVqeh1aK-jYdoc_InBKnIbiaueFGA0iKXMgDePYE1FLRXfOzMk8HSjgtyWs/exec";

const PROGRAM_DB = {
  0: {
    categoryName: "예술 및 창작",
    programs: [
      { id: "ART_0", title: "하루에 완성하는 디지털 드로잉" },
      { id: "ART_1", title: "(글쓰기 특강)내 ChatGPT만 왜 그럴까" },
      { id: "ART_2", title: "퍼스널퍼퓸 \"나를 표현하는 향\"" },
      { id: "ART_3", title: "핑거니팅으로 방석 만들기" },

    ]
  },
  1: {
    categoryName: "진로 및 AI 역량",
    programs: [
      { id: "CAR_0", title: "2026_2학기_신직업 멘토링" },
      { id: "CAR_1", title: "(기초)AI를 활용한 실전 사용법" },
      { id: "CAR_2", title: "생활체육학과 LINC3.0취업실무역량강화프로그램" },
      { id: "CAR_3", title: "진로해시태그" },
      { id: "CAR_4", title: "공기업 및 대기업 준비반" },
      { id: "CAR_5", title: "사히초년생을 위한 금융 경제 특강" }
    ]
  },
  2: {
    categoryName: "건강 및 웰니스",
    programs: [
      { id: "HEA_0", title: "소도구와 음악을 더한 바레 & 필라테스" },
      { id: "HEA_1", title: "건강한 생활습관 만들기" },
      { id: "HEA_2", title: "단체 헬스트레이닝" },
      { id: "HEA_3", title: "마음 건강" }

    ]

  },

  3: { 
    categoryName: "사교",
    programs : [
      { id: "SOC_0", title: "친목 도모를 위한 게임 나이트" },
      { id: "SOC_1", title: "네트워킹 이벤트" },
      { id: "SOC_2", title: "문화 체험 활동" },
      { id: "SOC_3", title: "봉사 활동 참여" }
    ]

  },

  4: {
    categoryName: "기타",
    programs : [
      { id: "OTH_0", title: "기타 프로그램 1" },
      { id: "OTH_1", title: "기타 프로그램 2" },
      { id: "OTH_2", title: "기타 프로그램 3" }
    ]
  }
};
function getrandomID() {
  const randomnumber = Math.floor(Math.random() * 3);
  const programs = PROGRAM_DB[randomnumber].programs;
  const programIndex = Math.floor(Math.random() * programs.length);
  return programs[programIndex];
}

window.addEventListener('DOMContentLoaded', () => {
  const answerBoxes = document.querySelectorAll('input[name="answer"]');
  const pickedIds = [];

  answerBoxes.forEach((box) => {
    let prog = getrandomID();
    while (pickedIds.includes(prog.id) && pickedIds.length < 5) {
      prog = getrandomID();
    }
    pickedIds.push(prog.id);

    box.value = prog.id;

    
    const linkedLabel = box.id ? document.querySelector(`label[for="${box.id}"]`) : null;
    if (linkedLabel) {
      linkedLabel.textContent = prog.title;
    } else if (box.nextSibling) {
      box.nextSibling.textContent = ` ${prog.title}`;
    }
  });
});

function getCheckedValues(questionName) {
  const checkboxes = document.querySelectorAll(`input[name="${questionName}"]`);
  return Array.from(checkboxes).map(checkbox => checkbox.checked ? 1 : 0);
}

function generateUniqueId() {
  return "USER_" + crypto.randomUUID().slice(0, 8).toUpperCase();
}

async function makeTable() {
  const userName = generateUniqueId();

  const q1 = getCheckedValues('option1');
  const q2 = getCheckedValues('option2');
  const q3 = getCheckedValues('option3');
  const q4 = getCheckedValues('option4');
  const q5 = getCheckedValues('option5');
  
  const checkedAnswer = document.querySelector('input[name="answer"]:checked');
  const selectedId = checkedAnswer ? checkedAnswer.value : "";

  if (!selectedId) {
    alert("추천 프로그램 중 하나를 선택해주세요!");
    return;
  }

  const rowData = [userName, ...q1, ...q2, ...q3, ...q4, ...q5];
  const row_data = [userName, selectedId];

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        row1: rowData,
        row2: row_data
      })
    });

    alert(`귀하의 데이터가 구글 스프레드시트로 전송되었습니다!`);
    location.reload();
  } catch (error) {
    alert("전송 중 오류가 발생했습니다: " + error);
  }
}

function submitSurvey() {
  makeTable();
}

function selectONE(checkbox) {
  if (checkbox.checked) {
    document.querySelectorAll(`input[name="${checkbox.name}"]`).forEach((otherCheckbox) => {
      if (otherCheckbox !== checkbox) {
        otherCheckbox.checked = false;
      }
    });
  }
}