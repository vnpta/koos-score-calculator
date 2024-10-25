const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
        // Bỏ chọn các checkbox khác trong cùng nhóm
        if (this.checked) {
            checkboxes.forEach((other) => {
                if (other !== this) {
                    other.checked = false;
                }
            });
        }
    });
});

function calculateScore() {
    const form = document.getElementById('koos-form');
    const formData = new FormData(form);
    let totalScore = 0;

    for (let value of formData.values()) {
        totalScore += parseInt(value);
    }

    document.getElementById('result').innerText = `Điểm tổng cộng: ${totalScore}`;
}
