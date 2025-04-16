<script>
document.addEventListener("DOMContentLoaded", function () {
  // ==== 1. Hiển thị số lượt khảo sát ====
  function updateCounterDisplay() {
    fetch("https://counterapi.dev/api/v1/counter/get?name=koosvn2025&app=koosvn")
      .then((response) => {
        if (!response.ok) throw new Error("Không phản hồi hợp lệ");
        return response.json();
      })
      .then((data) => {
        document.getElementById("counterDisplay").innerText =
          `Số lượt hoàn thành khảo sát: ${data.Count}`;
      })
      .catch((error) => {
        console.error("Lỗi khi tải số lượt:", error);
        document.getElementById("counterDisplay").innerText =
          "Không thể tải lượt khảo sát.";
      });
  }

  // ==== 2. Sự kiện chọn đáp án ====
  document.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", function () {
      const parent = this.parentElement;
      parent.querySelectorAll(".option").forEach((opt) =>
        opt.classList.remove("selected")
      );
      this.classList.add("selected");
    });
  });

  // ==== 3. Cấu trúc nhóm câu hỏi ====
  const questionGroups = {
    symptoms: [1, 2, 3, 4, 5, 6, 7],
    pain: [8, 9, 10, 11, 12, 13, 14, 15, 16],
    adl: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
    sport: [34, 35, 36, 37, 38],
    qol: [39, 40, 41, 42],
  };

  // ==== 4. Tính điểm KOOS ====
  function calculateKOOSScore(questions) {
    let total = 0;
    let answeredCount = 0;

    questions.forEach((qNum) => {
      const question = document.querySelector(
        `.question[data-question="${qNum}"]`
      );
      const selectedOption = question?.querySelector(".option.selected");
      if (selectedOption) {
        total += parseInt(selectedOption.getAttribute("data-value"));
        answeredCount++;
      }
    });

    if (answeredCount === 0) return null;
    const averageScore = total / answeredCount;
    return Math.round(100 - (averageScore / 4) * 100);
  }

  // ==== 5. Hiển thị kết quả KOOS ====
  function displayKOOSResults() {
    const scores = {
      symptoms: calculateKOOSScore(questionGroups.symptoms),
      pain: calculateKOOSScore(questionGroups.pain),
      adl: calculateKOOSScore(questionGroups.adl),
      sport: calculateKOOSScore(questionGroups.sport),
      qol: calculateKOOSScore(questionGroups.qol),
    };

    let resultText = "Điểm KOOS của bạn:\n";
    for (const [key, value] of Object.entries(scores)) {
      resultText += `${key.toUpperCase()}: ${value !== null ? value : "Chưa trả lời đủ câu hỏi"}\n`;
    }

    document.getElementById("result").innerText = resultText;
    document.getElementById("thankYouMessage").style.display = "block";
    document.getElementById("downloadPdfBtn").style.display = "inline-block";

    // Gửi lên CounterAPI
    fetch("https://counterapi.dev/api/v1/counter/up?name=koosvn2025&app=koosvn")
      .then((res) => res.json())
      .then(() => updateCounterDisplay())
      .catch((err) => console.error("Không thể cập nhật lượt:", err));
  }

  // ==== 6. Nút tính toán ====
  document.getElementById("calculateBtn").addEventListener("click", function () {
    let firstUnansweredQuestion = null;

    document.querySelectorAll(".question").forEach((question) => {
      const selectedOption = question.querySelector(".option.selected");
      if (!selectedOption) {
        question.classList.add("unanswered");
        if (!firstUnansweredQuestion) {
          firstUnansweredQuestion = question;
        }
      } else {
        question.classList.remove("unanswered");
      }
    });

    if (firstUnansweredQuestion) {
      firstUnansweredQuestion.scrollIntoView({ behavior: "smooth", block: "center" });
      alert("Bạn phải trả lời tất cả các câu hỏi!");
    } else {
      displayKOOSResults();
    }
  });

  // ==== 7. Tạo PDF ====
  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById("nameInput").value;
    const birthYear = document.getElementById("birthYearInput").value;

    if (!name || !birthYear) {
      alert("Vui lòng nhập tên và năm sinh!");
      return;
    }

    const downloadDate = new Date().toLocaleString();

    doc.text("KET QUA TINH DIEM KOOS", 105, 20, { align: "center" });
    doc.text(`Ho ten: ${name}`, 10, 30);
    doc.text(`Nam sinh: ${birthYear}`, 10, 40);
    doc.text(`Thoi gian: ${downloadDate}`, 10, 50);

    doc.setLineWidth(0.5);
    doc.line(10, 55, 200, 55);

    const scores = {
      symptoms: calculateKOOSScore(questionGroups.symptoms),
      pain: calculateKOOSScore(questionGroups.pain),
      adl: calculateKOOSScore(questionGroups.adl),
      sport: calculateKOOSScore(questionGroups.sport),
      qol: calculateKOOSScore(questionGroups.qol),
    };

    doc.text("KOOS SCORE:", 10, 70);

    let yPos = 80;
    for (const [key, value] of Object.entries(scores)) {
      const scoreText = `${key.toUpperCase()}: ${value !== null ? value : "Chưa trả lời đủ câu hỏi"}`;
      doc.text(scoreText, 10, yPos);
      yPos += 10;
    }

    doc.setLineWidth(0.5);
    doc.line(10, yPos + 5, 200, yPos + 5);

    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.text("KOOS", 15, 280);

    doc.save("KOOS_Score_Report.pdf");
  }

  document.getElementById("downloadPdfBtn").addEventListener("click", function () {
    generatePDF();
  });

  document.getElementById("downloadPdfBtn").style.display = "none";

  // Gọi lần đầu để hiển thị số lượt
  updateCounterDisplay();
});
</script>
