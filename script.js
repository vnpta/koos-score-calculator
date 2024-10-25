document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        // Xóa lớp 'selected' khỏi tất cả các ô trong câu hỏi
        const parent = this.parentElement;
        const options = parent.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));

        // Thêm lớp 'selected' vào ô được chọn
        this.classList.add('selected');
    });
});

document.getElementById('calculateBtn').addEventListener('click', function() {
    let total = 0;
    let count = 0;

    // Lặp qua các câu hỏi để tính điểm
    const questions = document.querySelectorAll('.question');
    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('.option.selected');
        if (selectedOption) {
            total += parseInt(selectedOption.getAttribute('data-value'));
            count++;
        }
    });

    if (count > 0) {
        const avg = (total / (count * 4)) * 100; // Tính điểm phần trăm
        document.getElementById('result').innerText = `Điểm KOOS của bạn là: ${avg.toFixed(2)}%`;
    } else {
        document.getElementById('result').innerText = "Vui lòng chọn đáp án cho mỗi câu hỏi.";
    }
});
