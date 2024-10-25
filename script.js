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

document.getElementById('calculateBtn').addEventListener('click', function () {
    let total = 0;
    let count = 0;
    let unansweredQuestions = []; // Mảng lưu trữ các câu hỏi chưa trả lời

    // Lặp qua các câu hỏi và tính điểm
    document.querySelectorAll('.question').forEach((question, index) => {
        const selectedOption = question.querySelector('.option.selected');
        if (selectedOption) {
            total += parseInt(selectedOption.getAttribute('data-value'));
            count++;
            question.classList.remove('unanswered'); // Gỡ bỏ viền đỏ nếu đã trả lời
        } else {
            unansweredQuestions.push(index + 1); // Lưu lại số thứ tự câu hỏi chưa trả lời
            question.classList.add('unanswered'); // Thêm viền đỏ cho câu hỏi chưa trả lời
        }
    });

    if (unansweredQuestions.length > 0) {
        // Thông báo nếu còn câu hỏi chưa trả lời
        document.getElementById('result').innerText = 
            `Bạn phải trả lời tất cả các câu hỏi! Câu hỏi chưa trả lời: ${unansweredQuestions.join(', ')}`;
    } else {
        // Tính điểm nếu tất cả câu hỏi đã được trả lời
        const avg = 100 - (total / (count * 4)) * 100; // Tính điểm phần trăm theo công thức mới
        document.getElementById('result').innerText = `Điểm KOOS của bạn là: ${avg.toFixed(2)}%`;
    }
});
