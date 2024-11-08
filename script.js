// Thêm sự kiện cho từng ô lựa chọn
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function () {
        const parent = this.parentElement;
        parent.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Nhóm câu hỏi theo các mục
const questionGroups = {
    symptoms: [1, 2, 3, 4, 5, 6, 7],
    pain: [8, 9, 10, 11, 12, 13, 14, 15, 16],
    adl: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
    sport: [34, 35, 36, 37, 38],
    qol: [39, 40, 41, 42]
};

// Hàm tính điểm KOOS
function calculateKOOSScore(questions) {
    let total = 0;
    let answeredCount = 0;

    questions.forEach(qNum => {
        const question = document.querySelector(`.question[data-question="${qNum}"]`);
        const selectedOption = question?.querySelector('.option.selected');
        if (selectedOption) {
            total += parseInt(selectedOption.getAttribute('data-value'));
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
        qol: calculateKOOSScore(questionGroups.qol)
    };

    let resultText = 'Điểm KOOS của bạn:\n';
    for (const [key, value] of Object.entries(scores)) {
        resultText += `${key.toUpperCase()}: ${value !== null ? value : 'Chưa trả lời đủ câu hỏi'}\n`;
    }

    document.getElementById('result').innerText = resultText;
    document.getElementById('thankYouMessage').style.display = 'block';
    document.getElementById('downloadPdfBtn').style.display = 'inline-block';
}

// Xử lý sự kiện tính toán
document.getElementById('calculateBtn').addEventListener('click', function () {
    let firstUnansweredQuestion = null;

    // Kiểm tra câu hỏi chưa trả lời và thêm viền đỏ
    document.querySelectorAll('.question').forEach((question) => {
        const selectedOption = question.querySelector('.option.selected');
        if (!selectedOption) {
            question.classList.add('unanswered');
            if (!firstUnansweredQuestion) {
                firstUnansweredQuestion = question;
            }
        } else {
            question.classList.remove('unanswered');
        }
    });

    if (firstUnansweredQuestion) {
        firstUnansweredQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        alert('Bạn phải trả lời tất cả các câu hỏi!');
    } else {
        displayKOOSResults();
    }
});

// Hàm tạo file PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Thêm tiêu đề
    doc.setFontSize(16);
    doc.text("Kết quả KOOS", 10, 10);

    // Đặt font cho nội dung câu hỏi và câu trả lời
    doc.setFontSize(12);

    // Mảng lưu kết quả câu hỏi và đáp án đã chọn
    const resultContent = [];

    // Thu thập câu hỏi và đáp án đã chọn
    document.querySelectorAll('.question').forEach((question, index) => {
        const questionText = question.querySelector('.question-text').innerText;
        const selectedOption = question.querySelector('.option.selected');
        const answerText = selectedOption ? selectedOption.innerText : 'Chưa chọn';

        resultContent.push(`Câu ${index + 1}: ${questionText}`);
        resultContent.push(`Đáp án: ${answerText}`);
        resultContent.push(''); // Khoảng cách giữa các câu hỏi
    });

    // Thêm câu hỏi và đáp án vào file PDF
    resultContent.forEach((line, i) => {
        doc.text(line, 10, 20 + (i * 10)); // Thêm từng dòng vào trang PDF
    });

    // Tạo điểm KOOS
    const scores = {
        symptoms: calculateKOOSScore(questionGroups.symptoms),
        pain: calculateKOOSScore(questionGroups.pain),
        adl: calculateKOOSScore(questionGroups.adl),
        sport: calculateKOOSScore(questionGroups.sport),
        qol: calculateKOOSScore(questionGroups.qol)
    };

    let scoreText = '\nĐiểm KOOS:\n';
    for (const [key, value] of Object.entries(scores)) {
        scoreText += `${key.toUpperCase()}: ${value !== null ? value : 'Chưa trả lời đủ câu hỏi'}\n`;
    }

    doc.text(scoreText, 10, 20 + (resultContent.length * 10));  // Thêm điểm số vào cuối PDF

    // Tải xuống file PDF
    doc.save('KOOS_Score_Report.pdf');
}

// Thêm sự kiện cho nút tải PDF
document.getElementById('downloadPdfBtn').addEventListener('click', function () {
    generatePDF();  // Gọi hàm tạo PDF
});
