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
    const questions = [
        'symptom1',
        'symptom2',
        'pain1',
        // Thêm các câu hỏi khác vào đây
    ];

    questions.forEach((question, index) => {
        const selectedOption = document.querySelectorAll(`.question:nth-child(${index + 1}) .option.selected`);
        if (selectedOption.length > 0) {
            total += parseInt(selectedOption[0].getAttribute('data-value'));
            count++;
        }
    });

    const avg = (total / (count * 4)) * 100; // Tính điểm phần trăm
    document.getElementById('result').innerText = `Điểm KOOS của bạn là: ${avg.toFixed(2)}%`;
});
