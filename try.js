let totalCount = 0;

// キーが押されたときの処理
document.addEventListener('keydown', function(event) {
    totalCount++;
    //updateTotalCount();
    let totalDiv = document.getElementById('total');
    totalDiv.textContent = `${totalCount}`;
});

