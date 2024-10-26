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
    symptoms: [1, 2, 3, 4, 5, 6, 7],          // Triệu chứng
    pain: [8, 9, 10, 11, 12, 13, 14, 15, 16], // Đau
    adl: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], // Hoạt động sinh hoạt
    sport: [34, 35, 36, 37, 38],               // Thể thao và giải trí
    qol: [39, 40, 41, 42]                      // Chất lượng cuộc sống
};

// Hàm tính điểm cho từng mục
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

    if (answeredCount === 0) return null; // Nếu không có câu trả lời nào, trả về null
    const averageScore = total / answeredCount; // Tính trung bình cộng
    return Math.round(100 - (averageScore / 4) * 100); // Làm tròn và tính điểm KOOS theo công thức
}

document.getElementById('calculateBtn').addEventListener('click', function () {
    let firstUnansweredQuestion = null; // Lưu câu hỏi chưa trả lời đầu tiên

    // Kiểm tra câu hỏi chưa trả lời và thêm viền đỏ nếu có
    document.querySelectorAll('.question').forEach((question) => {
        const selectedOption = question.querySelector('.option.selected');
        if (!selectedOption) {
            question.classList.add('unanswered'); // Thêm viền đỏ cho câu hỏi chưa trả lời
            if (!firstUnansweredQuestion) {
                firstUnansweredQuestion = question; // Lưu lại câu hỏi chưa trả lời đầu tiên
            }
        } else {
            question.classList.remove('unanswered'); // Gỡ bỏ viền đỏ nếu đã trả lời
        }
    });

    if (firstUnansweredQuestion) {
        // Cuộn đến câu hỏi chưa trả lời đầu tiên
        firstUnansweredQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        alert('Bạn phải trả lời tất cả các câu hỏi!');
    } else {
        // Tính điểm KOOS cho từng mục
        const scores = {
            symptoms: calculateKOOSScore(questionGroups.symptoms),
            pain: calculateKOOSScore(questionGroups.pain),
            adl: calculateKOOSScore(questionGroups.adl),
            sport: calculateKOOSScore(questionGroups.sport),
            qol: calculateKOOSScore(questionGroups.qol)
        };

        // Hiển thị kết quả
        let resultText = 'Điểm KOOS của bạn:\n';
        for (const [key, value] of Object.entries(scores)) {
            resultText += `${key.toUpperCase()}: ${value !== null ? value : 'Chưa trả lời đủ câu hỏi'}\n`;
        }

        document.getElementById('result').innerText = resultText;
    }
});
