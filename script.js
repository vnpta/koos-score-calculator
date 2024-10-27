// Ngăn chuột phải trên toàn bộ trang
document.addEventListener('contextmenu', event => event.preventDefault());

// Ngăn các phím tắt mở DevTools và xem mã nguồn
document.addEventListener('keydown', function (event) {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && event.key === "I") || 
        (event.ctrlKey && event.key === "U")) {
        event.preventDefault();
        alert("Chức năng này đã bị vô hiệu hóa.");
    }
});

// Thêm sự kiện cho từng ô lựa chọn
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function () {
        const parent = this.parentElement;
        // Xóa lớp 'selected' khỏi tất cả các ô trong cùng câu hỏi
        parent.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        // Thêm lớp 'selected' vào ô được chọn
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
    }
});
