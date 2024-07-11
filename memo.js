// ゲームに使用することわざのリスト
const input_shortwords = ["いちねんのけいはがんじつにあり", "じんじをつくしててんめいをまつ", "じじつはしょうせつよりもきなり", "やまたかきがゆえにとうとからず", "むりがとおればどうりがひっこむ", "きのうはひとのみきょうはわがみ", "おんなさんにんよればかしましい", "うしにひかれてぜんこうじまいり", "かわいさあまってにくさがひゃくばい", "あおはあいよりいでてあいよりあおし"];
const display_shortwords = ["一年の計は元旦にあり", "人事を尽くして天命を待つ", "事実は小説よりも奇なり", "山高きが故に貴からず", "無理が通れば道理がひっこむ", "昨日は人の身今日は我が身", "女三人寄れば姦しい", "牛にひかれて善光寺参り", "可愛さ余って憎さが百倍", "青は藍より出でて藍より青し"];

const input_sentence = ["それもきまりなんだ。めをとじちゃいけない。めをとじても、ものごとはちっともよくならない。めをとじてなにかがきえるわけじゃないんだ。それどころか、つぎにめをあけたときにはものごとはもっとわるくなっている。わたしたちはそういうせかいにすんでいるんだよ、なかたさん。しっかりとめをあけるんだ。めをとじるのはよわむしのやることだ。げんじつからめをそらすのはひきょうもののやることだ。きみがめをとじ、みみをふさいでいるあいだにもときはきざまれているんだ。こつこつと","",""]
const display_sentence = ["それも決まりなんだ。目を閉じちゃいけない。目を閉じても、ものごとはちっとも良くならない。目を閉じて何かが消えるわけじゃないんだ。それどころか、次に目を開けたときにはものごとはもっと悪くなっている。私たちはそういう世界に住んでいるんだよ、ナカタさん。しっかりと目を開けるんだ。目を閉じるのは弱虫のやることだ。現実から目をそらすのは卑怯もののやることだ。君が目を閉じ、耳をふさいでいるあいだにも時は刻まれているんだ。コツコツと","",""]
// 初期化
let score = 0;
let time = 0;
let backspaceCount = 0;
let keystrokeCount = 0;
let isPlaying = false;
let timer;
let usedIndices = [];
let countdownTimer;
let lateModeDelay = 1000; // Late Gameモードの遅延時間（ミリ秒）
let delayTime = 0; 

// HTML要素への参照を取得
const wordDisplay = document.getElementById("word");
const rubyDisplay = document.createElement("div");
rubyDisplay.className = "ruby";
wordDisplay.parentNode.insertBefore(rubyDisplay, wordDisplay);
const customInput = document.getElementById("customInput");
const inputDisplay = document.getElementById("inputDisplay");
const lateInputDisplay = document.getElementById("lateInputDisplay");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const backspaceDisplay = document.getElementById("backspaceCount");
//const keystrokeDisplay = document.getElementById("keystrokeCount");
const startButton = document.getElementById("startButton");
const lateStartButton = document.getElementById("lateStartButton");
const restartButton = document.getElementById("restartButton");
const resultDisplay = document.getElementById("result");

// イベントリスナーを追加
startButton.addEventListener("click", () => startGame());
lateStartButton.addEventListener("click", () => startLateGame());
lateStartButton.addEventListener("click", () => delayTime = lateModeDelay);
restartButton.addEventListener("click", () => restartGame());
customInput.addEventListener("input", handleInput);
customInput.addEventListener("keydown", () => handleKeyDown());
//customInput.addEventListener("keydown", () => keystrokeCount());


// 初期化時に入力ボックスを非表示にする
customInput.style.display = "none";

// ゲーム開始時の処理
function startGame(delay = 0) {
    if (!isPlaying) {
        delayTime = delay
        isPlaying = true;
        score = 0;
        time = 0;
        backspaceCount = 0;
        usedIndices = [];
        scoreDisplay.textContent = score;
        timeDisplay.textContent = time;
        backspaceDisplay.textContent = backspaceCount;
        //keystrokeDisplay.textContent = keystrokeCount;
        customInput.value = "";
        customInput.style.display = "none"; // 入力ボックスを非表示
        inputDisplay.textContent = ""; // 入力表示エリアを初期化
        startButton.style.display = "none";
        lateStartButton.style.display = "none";
        restartButton.style.display = "none";
        resultDisplay.style.display = "none";
        setTimeout(() => {
            startCountdown(delayTime);
        }, delay);
    }
}

// カウントダウンの処理
function startCountdown() {
    let countdown = 5;
    wordDisplay.style.display = "block";
    rubyDisplay.style.display = "block";
    wordDisplay.textContent = `ゲーム開始まで: ${countdown}秒`;
    rubyDisplay.textContent = "";
    countdownTimer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(countdownTimer);
            customInput.style.display = "block";  // 入力ボックスを表示
            customInput.focus();  // カスタム入力ボックスにフォーカスを設定
            timer = setInterval(updateTime, 1000);
            showWord();
        } else {
            wordDisplay.textContent = `ゲーム開始まで: ${countdown}秒`;
            rubyDisplay.textContent = "";
        }
    }, 1000);
}

// ランダムなことわざを表示する
function showWord() {
    inputDisplay.textContent = "";  // 入力された内容を削除

    if (usedIndices.length === input_shortwords.length) {
        usedIndices = [];
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * input_shortwords.length);
    } while (usedIndices.includes(randomIndex));

    usedIndices.push(randomIndex);
    wordDisplay.textContent = display_shortwords[randomIndex];
    rubyDisplay.textContent = input_shortwords[randomIndex];

}

// 時間を更新する
function updateTime() {
    time++;
    timeDisplay.textContent = time;
}

// 入力の処理
function handleInput() {
    const currentWordIndex = display_shortwords.indexOf(wordDisplay.textContent);
    const userInput = customInput.value.trim();
    if (userInput === input_shortwords[currentWordIndex]) {
        score++;
        scoreDisplay.textContent = score;
        customInput.value = "";
        inputDisplay.value = "none";
        inputDisplay.textContent = "";  // 入力された内容を削除

        if (score >= 2) {
            endGame();
        }
        
        if(inputDisplay.textContent === ""){
        setTimeout(showWord(), delay);  // 次のことわざを表示
        }
    }
    // 入力表示エリアに入力内容を反映
    function inputWordDisplay(){
        inputDisplay.textContent = userInput
    }
    setTimeout(inputWordDisplay, delayTime);
}

// バックスペースキーの処理
function handleKeyDown(event) {
    if (isPlaying && event.key === "Backspace") {  // ゲーム中のみカウントする
        backspaceCount++;
        backspaceDisplay.textContent = backspaceCount;
    }
}

// キーが押されたときの処理
/*function keystrokeCount(event) {
    totalCount++;
    keystrokeDisplay.textContent = keystrokeCount;
    //updateTotalCount();
    if (isPlaying && event.key === "") {  // ゲーム中のみカウントする
        backspaceCount++;
        backspaceDisplay.textContent = backspaceCount;
    }
}*/

// 入力ボックスがフォーカスを失ったときに再度フォーカスを設定する
customInput.addEventListener("blur", function() {
    customInput.focus();
});


// ゲーム終了時の処理
function endGame() {
    clearInterval(timer);
    isPlaying = false;

    wordDisplay.style.display = "none"; // ゲーム終了時にことわざを非表示
    rubyDisplay.style.display = "none"; // ゲーム終了時に読み仮名を非表示
    resultDisplay.textContent = "終了！ご協力ありがとうございます！お疲れ様でした！";
    resultDisplay.style.display = "block";

    customInput.style.left = "-9999px"; // ゲーム終了時に入力ボックスを画面外に移動
    startButton.style.display = "none";  // ゲーム終了時にスタートボタンを非表示
    customInput.style.display = "none"; //ゲーム時終了時に入力ボックスを無効化
    inputDisplay.textContent = ""; // 入力表示エリアを初期化
    lateStartButton.style.display = "none";
    restartButton.style.display = "inline-block";

    // タイムラグを軽減するため、要素の表示を非同期化
    //setTimeout(() => {
        //wordDisplay.style.display = "none"; // ゲーム終了時にことわざを非表示
        //rubyDisplay.style.display = "none"; // ゲーム終了時に読み仮名を非表示
        //resultDisplay.textContent = "終了！ご協力ありがとうございます！お疲れ様でした！";
        //resultDisplay.style.display = "block";
    //}, 10); // 適切な遅延時間を調整してください
}

// リスタートボタンの処理
function restartGame() {
    score = 0;
    time = 0;
    backspaceCount = 0;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    backspaceDisplay.textContent = backspaceCount;
    customInput.value = "";
    startButton.style.display = "inline-block";
    lateStartButton.style.display = "inline-block";
    restartButton.style.display = "none";
    resultDisplay.style.display = "none";
    startButton.disabled = false;
    clearInterval(timer);
    clearInterval(countdownTimer);
    wordDisplay.style.display = "none";
    rubyDisplay.style.display = "none";
    customInput.style.display = "none";
}

// Late Gameモードの処理
function startLateGame() {
    startGame(); // 遅延時間を指定してゲームを開始
}