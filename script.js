document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function () {
        const parent = this.parentElement;
        parent.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.getElementById('calculateBtn').addEventListener('click', function () {
    let total = 0;
    let count = 0;
    let firstUnansweredQuestion = null;

    document.querySelectorAll('.question').forEach((question) => {
        const selectedOption = question.querySelector('.option.selected');
        if (selectedOption) {
            total += parseInt(selectedOption.getAttribute('data-value'));
            count++;
            question.classList.remove('unanswered');
        } else {
            question.classList.add('unanswered');
            if (!firstUnansweredQuestion) {
                firstUnansweredQuestion = question;
            }
        }
    });

    if (firstUnansweredQuestion) {
        firstUnansweredQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        alert('Bạn phải trả lời tất cả các câu hỏi!');
    } else {
        const avg = 100 - (total / (count * 4)) * 100;
        document.getElementById('result').innerText = `Điểm KOOS của bạn là: ${avg.toFixed(2)}%`;
    }
});
