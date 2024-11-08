// Loại bỏ chức năng ngăn chuột phải (nếu muốn)
document.removeEventListener('contextmenu', event => event.preventDefault());

// Loại bỏ việc ngăn các phím tắt mở DevTools và xem mã nguồn
document.removeEventListener('keydown', function (event) {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && event.key === "I") || 
        (event.ctrlKey && event.key === "U") || 
        (event.ctrlKey && event.key === "S")) {
        event.preventDefault();
        alert("Chức năng này đã bị vô hiệu hóa.");
    }
});

// Loại bỏ ngăn trình duyệt tự động mở DevTools khi trang tải
window.onload = function() {
    console.log('Chức năng DevTools đã bị chặn.');
};

// Thêm sự kiện cho từng ô lựa chọn
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function () {
        const parent = this.parentElement;
        parent.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
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

// Hàm reset lựa chọn và kết quả
function resetForm() {
    document.querySelectorAll('.option.selected').forEach(option => option.classList.remove('selected'));
    document.getElementById('result').innerText = '';
    document.getElementById('thankYouMessage').style.display = 'none';
    document.getElementById('downloadPdfBtn').style.display = 'none';
}

// Hàm hiển thị kết quả KOOS
function displayKOOSResults() {
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
    document.getElementById('downloadPdfBtn').style.display = 'inline-block';
}

// Xử lý sự kiện tính toán
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
        displayKOOSResults();
    }
});

// Hàm gửi yêu cầu POST tới PDFShift API để tạo PDF
async function generatePDF() {
    // Tạo nội dung HTML của trang (bạn có thể thay đổi nội dung cần tạo PDF)
    const htmlContent = document.documentElement.outerHTML;  // Toàn bộ nội dung HTML trang

    const data = {
        source: htmlContent,  // Nội dung HTML trang của bạn
        options: {
            landscape: false,    // Chế độ trang giấy dọc (portrait) hoặc ngang (landscape)
            page_size: "A4",     // Kích thước trang PDF
        }
    };

    try {
        // Gửi yêu cầu POST đến API của PDFShift
        const response = await fetch('https://api.pdfshift.io/v3/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk_15d6fb4517920262f972a5ab8fd352af0cf939c8'  // Thay 'YOUR_API_KEY' bằng API key của bạn
            },
            body: JSON.stringify(data)
        });

        const pdfBlob = await response.blob();  // Nhận dữ liệu PDF từ phản hồi
        const pdfURL = URL.createObjectURL(pdfBlob);  // Tạo URL cho tệp PDF

        // Tạo một liên kết tải về PDF
        const link = document.createElement('a');
        link.href = pdfURL;
        link.download = 'KOOS_Score_Report.pdf';  // Tên tệp PDF
        link.click();  // Thực hiện tải tệp xuống
    } catch (error) {
        console.error("Có lỗi xảy ra khi tạo PDF: ", error);
    }
}

// Thêm sự kiện cho nút tải PDF
document.getElementById('downloadPdfBtn').addEventListener('click', function () {
    generatePDF();  // Gọi hàm tạo PDF
});
