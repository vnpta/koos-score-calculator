document.addEventListener("DOMContentLoaded", function () {
  // Thêm sự kiện cho từng ô lựa chọn
  document.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", function () {
      const parent = this.parentElement;
      parent
        .querySelectorAll(".option")
        .forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  // Nhóm câu hỏi theo các mục
  const questionGroups = {
    symptoms: [1, 2, 3, 4, 5, 6, 7],
    pain: [8, 9, 10, 11, 12, 13, 14, 15, 16],
    adl: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
    sport: [34, 35, 36, 37, 38],
    qol: [39, 40, 41, 42],
  };

  // Hàm tính điểm KOOS
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

  // Hàm hiển thị kết quả KOOS
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
    document.getElementById("downloadPdfBtn").style.display = "inline-block"; // Hiển thị nút tải PDF
  }

  // Xử lý sự kiện tính toán
  document.getElementById("calculateBtn").addEventListener("click", function () {
    let firstUnansweredQuestion = null;

    // Kiểm tra câu hỏi chưa trả lời và thêm viền đỏ
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
      firstUnansweredQuestion.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      alert("Bạn phải trả lời tất cả các câu hỏi!");
    } else {
      displayKOOSResults();
    }
  });

  // Hàm tạo file PDF chỉ với kết quả KOOS
  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Lấy thông tin từ form nhập tên và năm sinh
    const name = document.getElementById("nameInput").value;
    const birthYear = document.getElementById("birthYearInput").value;

    // Kiểm tra nếu người dùng đã nhập tên và năm sinh
    if (!name || !birthYear) {
      alert("Vui lòng nhập tên và năm sinh!");
      return;
    }

    // Lấy ngày giờ tải xuống
    const downloadDate = new Date().toLocaleString(); // Ngày và giờ hiện tại

    // Thêm tiêu đề (không cài đặt font)
    doc.text("KET QUA TINH DIEM KOOS", 105, 20, { align: "center" });

    // Thêm thông tin người dùng
    doc.text(`Ho ten: ${name}`, 10, 30);
    doc.text(`Nam sinh: ${birthYear}`, 10, 40);
    doc.text(`Thoi gian: ${downloadDate}`, 10, 50);

    // Thêm một dòng phân cách
    doc.setLineWidth(0.5);
    doc.line(10, 55, 200, 55);

    // Tính toán điểm KOOS
    const scores = {
      symptoms: calculateKOOSScore(questionGroups.symptoms),
      pain: calculateKOOSScore(questionGroups.pain),
      adl: calculateKOOSScore(questionGroups.adl),
      sport: calculateKOOSScore(questionGroups.sport),
      qol: calculateKOOSScore(questionGroups.qol),
    };

    // Thêm phần tiêu đề cho kết quả
    doc.text("KOOS SCORE:", 10, 70);

    // Thêm điểm số KOOS vào file PDF
    let yPos = 80; // Tọa độ y bắt đầu cho các điểm số
    for (const [key, value] of Object.entries(scores)) {
      const scoreText = `${key.toUpperCase()}: ${value !== null ? value : "Chưa trả lời đủ câu hỏi"}`;
      doc.text(scoreText, 10, yPos);
      yPos += 10; // Tăng vị trí y cho mỗi điểm
    }

    // Thêm một dòng phân cách
    doc.setLineWidth(0.5);
    doc.line(10, yPos + 5, 200, yPos + 5);

    // Thêm watermark "KOOS" ở góc dưới bên trái
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200); // Màu xám nhạt cho watermark
    doc.text("KOOS", 15, 280); // Vị trí watermark ở dưới bên trái

    // Tải xuống file PDF
    doc.save("KOOS_Score_Report.pdf");
  }

  // Thêm sự kiện cho nút tải PDF
  document
    .getElementById("downloadPdfBtn")
    .addEventListener("click", function () {
      generatePDF(); // Gọi hàm tạo PDF
    });

  // Đảm bảo nút tải PDF ẩn mặc định
  document.getElementById("downloadPdfBtn").style.display = "none";
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCtfuF9GJMpPkcUGgqH539lbKQoiaVbOx8",
  authDomain: "koosvn-79214.firebaseapp.com",
  projectId: "koosvn-79214",
  storageBucket: "koosvn-79214.firebasestorage.app",
  messagingSenderId: "616747698087",
  appId: "1:616747698087:web:8740c4372a11ea82631882",
  measurementId: "G-6K09T94P9X"
};

// Khởi tạo Firebase và Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hàm tăng lượt hoàn thành khảo sát
async function incrementCompletionCount() {
  const docRef = doc(db, "survey_data", "complete");  // Collection 'survey_data' và document 'complete'

  // Lấy dữ liệu hiện tại từ Firestore
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let currentCount = docSnap.data().count || 0;  // Nếu đã có dữ liệu, lấy số hiện tại, nếu không thì mặc định là 0
    await setDoc(docRef, { count: currentCount + 1 });  // Cập nhật số lượt hoàn thành

    console.log("Lượt hoàn thành đã được cập nhật.");
    document.getElementById("completionCount").innerText = "Số lượt hoàn thành: " + (currentCount + 1);
  } else {
    // Nếu document chưa tồn tại, tạo mới với giá trị 1
    await setDoc(docRef, { count: 1 });

    console.log("Lượt hoàn thành đã được tạo mới.");
    document.getElementById("completionCount").innerText = "Số lượt hoàn thành: 1";
  }
}

// Gọi hàm khi người dùng hoàn thành khảo sát
document.getElementById("calculateBtn").addEventListener("click", function () {
  incrementCompletionCount();
});
