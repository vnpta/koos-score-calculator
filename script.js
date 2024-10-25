document.getElementById('calculateBtn').addEventListener('click', function() {
    let total = 0;
    let count = 0;

    // Mảng chứa tên các câu hỏi
    const questions = [
        'symptom1',
        'symptom2',
        'pain1',
        // Thêm các câu hỏi khác vào đây
    ];

    questions.forEach(question => {
        const select = document.getElementsByName(question)[0];
        total += parseInt(select.value);
        count++;
    });

    const avg = (total / (count * 4)) * 100; // Tính điểm phần trăm
    document.getElementById('result').innerText = `Điểm KOOS của bạn là: ${avg.toFixed(2)}%`;
});

