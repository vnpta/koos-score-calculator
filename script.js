function calculateScore() {
    const symptoms1 = parseInt(document.getElementById('symptoms1').value);
    const symptoms2 = parseInt(document.getElementById('symptoms2').value);
    // Lấy các giá trị khác từ các câu hỏi tương tự

    const pain1 = parseInt(document.getElementById('pain1').value);
    // Lấy các giá trị khác từ phần Đau và các phần tiếp theo
    
    // Tính điểm trung bình từ tất cả các câu hỏi
    const totalScore = (symptoms1 + symptoms2 + pain1 /*+ ... các câu hỏi khác */) / tổng số câu hỏi;
    
    // Hiển thị điểm KOOS tổng
    document.getElementById('result').innerText = `KOOS Score: ${totalScore.toFixed(2)}`;


