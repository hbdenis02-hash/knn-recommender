
    const table = {};
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyx48rf9IWEp-d0OjpiKaVjRuCrkF2olFQY7pTjlOhp6OKpx-y6etLicW7O0Djrlx1X/exec";

    function getCheckedValues(questionName) {
      const checkboxes = document.querySelectorAll(`input[name="${questionName}"]`);
      return Array.from(checkboxes).map(checkbox => checkbox.checked ? 1 : 0);
    }

    function makeTable() {
      const userName = document.getElementById('name').value.trim();

      if (!userName) {
        alert("성함을 먼저 입력해주세요!");
        return;
      }

      const q1 = getCheckedValues('option1');
      const q2 = getCheckedValues('option2');
      const q3 = getCheckedValues('option3');

      table[userName] = {
        질문1: q1,
        질문2: q2,
        질문3: q3
      };

      alert(`${userName}님의 선택이 저장되었습니다!\n질문1: [${q1}]\n질문2: [${q2}]\n질문3: [${q3}]`);
      console.table(table);
    }

    async function saveToGoogleSheet() {
      const userName = document.getElementById('name').value.trim();

      if (!userName) {
        alert("성함을 먼저 입력해주세요!");
        return;
      }

      const q1 = getCheckedValues('option1');
      const q2 = getCheckedValues('option2');
      const q3 = getCheckedValues('option3');

      const rowData = [userName, ...q1, ...q2, ...q3];

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8
          },
          body: JSON.stringify({
            row: rowData
          })
        });

        if (!response.ok) {
          throw new Error("저장 실패");
        }

        alert("구글 시트에 저장되었습니다.");
      } catch (error) {
        alert(`구글 시트 저장 중 오류가 발생했습니다: ${error.message}`);
        console.error(error);
      }
    }


    function toCSV() {
      const userNames = Object.keys(table);
      if (userNames.length === 0) {
        alert("저장된 데이터가 없습니다. 먼저 이름을 적고 '1. 선택된 옵션 저장하기'를 눌러주세요!");
        return;
      }


      const headers = [
        "성함",
        "Q1_1", "Q1_2", "Q1_3", "Q1_4", "Q1_5",
        "Q2_1", "Q2_2", "Q2_3", "Q2_4", "Q2_5",
        "Q3_1", "Q3_2", "Q3_3", "Q3_4", "Q3_5"
      ];
      let csvContent = headers.join(",") + "\n";

 
      userNames.forEach(name => {
        const row = [
          name,
          ...table[name].질문1,
          ...table[name].질문2,
          ...table[name].질문3
        ];
        csvContent += row.join(",") + "\n";
      });

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "survey_result.csv";
      link.click();
      URL.revokeObjectURL(url);

    }
