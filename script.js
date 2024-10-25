function calculateScore() {
    const form = document.getElementById('koos-form');
    const formData = new FormData(form);
    let totalScore = 0;

    for (let value of formData.values()) {
        totalScore += parseInt(value);
    }

    document.getElementById('result').innerText = `Điểm tổng cộng: ${totalScore}`;
}
