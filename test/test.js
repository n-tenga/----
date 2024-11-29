// ゲームに使用することわざのリスト
const input_shortwords = ["いしばしをたたいてわたる", "いしのうえにもさんねん"];
const display_shortwords = ["石橋を叩いて渡る", "石の上にも三年"];
const delaytime =[0, 0]

// 初期化
let score = 0;
let time = 0;  // timeの初期値は0
let backspaceCount = 0;
let keystrokeCount = 0;  // キーストロークのカウント用変数を追加
let isPlaying = false;
let timerInterval;
let usedIndices = [];
let countdownTimer;
let delayTime = 0;


// ワードごとの入力時間を保存する配列
let wordTimes = [];  // ワードごとの入力時間を保存

//デバッグ用です
//const delayTimeDisplay = document.getElementById("delayTimeDisplay");
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
//const backspaceDisplay = document.getElementById("backspaceCount");
//const keystrokeDisplay = document.getElementById("keystrokeCount"); // キーストロークの表示要素
const startButton = document.getElementById("startButton");
const resultDisplay = document.getElementById("result");

// イベントリスナーを追加
startButton.addEventListener("click", () => startGame());
customInput.addEventListener("input", handleInput);
customInput.addEventListener("keydown", handleKeyDown);

// 初期化時に入力ボックスを非表示にする
customInput.style.display = "none";

// ゲーム開始時の処理
function startGame(delay = 0) {
    if (!isPlaying) {
        delayTime = delay;
        isPlaying = true;
        score = 0;
        time = 0;
        backspaceCount = 0;
        keystrokeCount = 0; // キーストロークのカウントをリセット
        currentIndex = 0;  // インデックスをリセットして順番通りに表示開始
        usedIndices = [];
        scoreDisplay.textContent = score;
        timeDisplay.textContent = time;
        //backspaceDisplay.textContent = backspaceCount;
        //keystrokeDisplay.textContent = keystrokeCount; // キーストロークの表示をリセット
        customInput.value = "";
        customInput.style.display = "none"; // 入力ボックスを非表示
        inputDisplay.textContent = ""; // 入力表示エリアを初期化
        startButton.style.display = "none";
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
            timerInterval = setInterval(updateTime, 10);  // 10msごとに時間を更新
            showWord();
        } else {
            wordDisplay.textContent = `ゲーム開始まで: ${countdown}秒`;
            rubyDisplay.textContent = "";
        }
    }, 1000);
}

// 現在表示することわざのインデックスを追跡する変数
let currentIndex = 0;

// ランダムではなく順番通りにことわざを表示する
function showWord() {
    // 次に表示するインデックスのことわざを取得
    if (currentIndex >= input_shortwords.length) {
        endGame();  // すべてのことわざが表示されたらゲーム終了
        return;
    }

    inputDisplay.textContent = "";  // 入力された内容を削除

    // 現在のことわざのインデックスを使って表示
    const currentWord = display_shortwords[currentIndex];
    const currentRuby = input_shortwords[currentIndex];

    wordDisplay.textContent = currentWord;
    rubyDisplay.textContent = currentRuby;

    // ワードが表示されたタイミングでスタートタイムを記録
    wordTimes.push({ word: currentRuby, startTime: Date.now() });

    // インデックスを進める
    currentIndex++;
}

// 時間を更新する
function updateTime() {
    if (isPlaying) {
        time += 10;  // 10msごとに加算

        // 秒単位にフォーマット（小数点以下2桁）
        let displayTime = (time / 1000).toFixed(2);

        timeDisplay.textContent = displayTime;  // 時間を秒単位で表示
    }
}

// 入力の処理
function handleInput() {
    const currentWordIndex = display_shortwords.indexOf(wordDisplay.textContent);
    const userInput = customInput.value.trim();

    // 遅延時間を取得
    const delay = delaytime[currentWordIndex];

    // 現在の遅延時間を画面に表示
    //delayTimeDisplay.textContent = `現在のディレイタイム: ${delay}ms`;


    // ユーザーの入力が正しい場合
    if (userInput === input_shortwords[currentWordIndex]) {
        score++;
        scoreDisplay.textContent = score;
        customInput.value = "";  // 入力ボックスの内容を削除

        // 入力表示エリアを削除
        inputDisplay.textContent = "";  

        // 入力完了時間を計測して保存
        const wordStartTime = wordTimes.find(wt => wt.word === input_shortwords[currentWordIndex]).startTime;
        const inputTime = (Date.now() - wordStartTime) / 1000;  // 入力時間（秒）
        wordTimes.find(wt => wt.word === input_shortwords[currentWordIndex]).inputTime = inputTime;

        // 次のことわざを表示（遅延無しで表示）
        if (score >= 2) {
            setTimeout(endGame, delay);  // ゲーム終了を即時に実行
        } else {
            // 入力が正しく完了した場合、遅延無しで次のことわざを表示
            setTimeout(() => {
                showWord();  // 次のことわざを表示
            }, 10);  // 遅延を0に設定して即座に表示
        }
    }

    // ユーザーの入力を遅延して表示
    delayedInputDisplay(userInput, delay);
}

// ユーザーの入力を遅延して表示する関数
function delayedInputDisplay(userInput, delay) {
    setTimeout(() => {
        inputDisplay.textContent = userInput;  // 遅延後に入力を表示
    }, delay);
}

// バックスペースキーの処理とキーストロークのカウント
function handleKeyDown(event) {
    if (isPlaying) {  // ゲーム中のみカウントする
        if (event.keyCode === 65) {
            // イベントのデフォルト動作をキャンセルする
            event.preventDefault();
        }
        keystrokeCount++;
        keystrokeDisplay.textContent = keystrokeCount; // キーストロークの表示を更新

        if (event.key === "Backspace") {
            backspaceCount++;
            //backspaceDisplay.textContent = backspaceCount;
        }
    }
}

// ゲーム終了時の処理
function endGame() {
    currentScore = score;
    currentTime = time;
    currentBackspaceCount = backspaceCount;
    currentKeystrokeCount = keystrokeCount;

    clearInterval(timerInterval);  // タイマーを停止
    isPlaying = false;

    wordDisplay.style.display = "none"; // ゲーム終了時にことわざを非表示
    rubyDisplay.style.display = "none"; // ゲーム終了時に読み仮名を非表示
    resultDisplay.textContent = "デモプレイ終了です！";
    resultDisplay.style.display = "block";

    customInput.style.left = "-9999px"; // ゲーム終了時に入力ボックスを画面外に移動
    startButton.style.display = "none";  // ゲーム終了時にスタートボタンを非表示
    customInput.style.display = "none"; // ゲーム終了時に入力ボックスを無効化
    inputDisplay.textContent = ""; // 入力表示エリアを初期化
}