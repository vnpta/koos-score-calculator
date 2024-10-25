document.getElementById('calculateBtn').addEventListener('click', function() {
    let total = 0;
    let count = 0;

    // Lặp qua các câu hỏi để tính điểm
    const questions = [
        'symptom1',
        // Thêm các câu hỏi khác vào đây
    ];

    questions.forEach(question => {
        const radios = document.getElementsByName(question);
        for (const radio of radios) {
            if (radio.checked) {
                total += parseInt(radio.value);
                count++;
            }
        }
    });

    const avg = (total / (count * 4)) * 100; // Tính điểm phần trăm
    document.getElementById('result').innerText = `Điểm KOOS của bạn là: ${avg.toFixed(2)}%`;
});
