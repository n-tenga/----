// ゲームに使用することわざのリスト
const input_shortwords = ["いちねんのけいはがんたんにあり", "じんじをつくしててんめいをまつ", "じじつはしょうせつよりもきなり", "やまたかきがゆえにとうとからず", "むりがとおればどうりがひっこむ", "きのうはひとのみきょうはわがみ", "おんなさんにんよればかしましい", "うしにひかれてぜんこうじまいり", "かわいさあまってにくさがひゃくばい", "あおはあいよりいでてあいよりあおし"];
const display_shortwords = ["一年の計は元旦にあり", "人事を尽くして天命を待つ", "事実は小説よりも奇なり", "山高きが故に貴からず", "無理が通れば道理がひっこむ", "昨日は人の身今日は我が身", "女三人寄れば姦しい", "牛にひかれて善光寺参り", "可愛さ余って憎さが百倍", "青は藍より出でて藍より青し"];
const delaytime =[0, 1250, 800, 1750, 550, 1400, 350, 0, 1050, 200, 1600, 950, 700, 1300, 400, 1850, 600, 1100, 250, 1900, 1500, 0, 900, 300, 1700, 500, 1200, 850, 450, 1950, 650, 1150, 0, 750, 1350, 2000, 1000, 1650, 1450, 0, 1800]

// 初期化
let score = 0;
let time = 0;  // timeの初期値は0
let backspaceCount = 0;
let keystrokeCount = 0;  // キーストロークのカウント用変数を追加
let isPlaying = false;
let timerInterval;
let usedIndices = [];
let countdownTimer;
let lateModeDelay = 1000; // Late Gameモードの遅延時間（ミリ秒）
let delayTime = 0;
var currentScore = 0;
var currentTime = 0;
var currentBackspaceCount = 0;
var currentKeystrokeCount = 0;

// ワードごとの入力時間を保存する配列
let wordTimes = [];  // ワードごとの入力時間を保存


//デバッグ用です
const delayTimeDisplay = document.getElementById("delayTimeDisplay");
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
const keystrokeDisplay = document.getElementById("keystrokeCount"); // キーストロークの表示要素
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
customInput.addEventListener("keydown", handleKeyDown);

// 初期化時に入力ボックスを非表示にする
customInput.style.display = "none";

// ゲーム開始時の処理
/*
function startGame(delay = 0) {
    if (!isPlaying) {
        delayTime = delay;
        isPlaying = true;
        score = 0;
        time = 0;
        backspaceCount = 0;
        keystrokeCount = 0; // キーストロークのカウントをリセット
        usedIndices = [];
        scoreDisplay.textContent = score;
        timeDisplay.textContent = time;
        backspaceDisplay.textContent = backspaceCount;
        keystrokeDisplay.textContent = keystrokeCount; // キーストロークの表示をリセット
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
*/

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
        backspaceDisplay.textContent = backspaceCount;
        keystrokeDisplay.textContent = keystrokeCount; // キーストロークの表示をリセット
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
            timerInterval = setInterval(updateTime, 10);  // 10msごとに時間を更新
            showWord();
        } else {
            wordDisplay.textContent = `ゲーム開始まで: ${countdown}秒`;
            rubyDisplay.textContent = "";
        }
    }, 1000);
}

// ランダムなことわざを表示する
/*
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

    // ワードが表示されたタイミングでスタートタイムを記録
    wordTimes.push({ word: input_shortwords[randomIndex], startTime: Date.now() });
}
*/

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
/*function handleInput() {
    const currentWordIndex = display_shortwords.indexOf(wordDisplay.textContent);
    const userInput = customInput.value.trim();
    
    if (userInput === input_shortwords[currentWordIndex]) {
        score++;
        scoreDisplay.textContent = score;
        customInput.value = "";
        inputDisplay.textContent = "";  // 入力された内容を削除

        // 入力完了時間を計測して保存
        const wordStartTime = wordTimes.find(wt => wt.word === input_shortwords[currentWordIndex]).startTime;
        const inputTime = (Date.now() - wordStartTime) / 1000;  // 入力時間（秒）
        wordTimes.find(wt => wt.word === input_shortwords[currentWordIndex]).inputTime = inputTime;

        // 次のことわざを表示
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

}*/


/*function handleInput() {
    const currentWordIndex = display_shortwords.indexOf(wordDisplay.textContent);
    const userInput = customInput.value.trim();

    // ユーザーの入力が正しい場合
    if (userInput === input_shortwords[currentWordIndex]) {
        score++;
        scoreDisplay.textContent = score;
        customInput.value = "";  // 入力ボックスの内容を削除
        inputDisplay.textContent = "";  // 入力表示エリアを削除

        // 入力完了時間を計測して保存
        const wordStartTime = wordTimes.find(wt => wt.word === input_shortwords[currentWordIndex]).startTime;
        const inputTime = (Date.now() - wordStartTime) / 1000;  // 入力時間（秒）
        wordTimes.find(wt => wt.word === input_shortwords[currentWordIndex]).inputTime = inputTime;

        // 次のことわざを表示（遅延を入れて表示）
        if (score >= 6) {
            setTimeout(endGame, delayTime);
        } else {
            // 入力が完了したら一定の遅延後に次のことわざを表示
            setTimeout(showWord, delayTime);  // 次のことわざを表示
        }
    }

    // 入力表示エリアに入力内容を反映
    inputDisplay.textContent = userInput;
}*/


/*function handleInput() {
    const currentWordIndex = display_shortwords.indexOf(wordDisplay.textContent);
    const userInput = customInput.value.trim();

    // 遅延時間を取得
    const delay = delaytime[currentWordIndex];

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

        // 次のことわざを表示（遅延を入れて表示）
        if (score >= 6) {
            setTimeout(endGame, delay);  // ゲーム終了を遅延
        } else {
            // 入力が完了したら遅延後に次のことわざを表示
            setTimeout(showWord, delay);  
        }
    }

    // ユーザーの入力を遅延して表示
    delayedInputDisplay(userInput, delay);
}*/


/*function handleInput() {
    const currentWordIndex = display_shortwords.indexOf(wordDisplay.textContent);
    const userInput = customInput.value.trim();

    // 遅延時間を取得
    const delay = delaytime[currentWordIndex];

    // 現在の遅延時間を画面に表示
    delayTimeDisplay.textContent = `現在のディレイタイム: ${delay}ms`;

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

        // 次のことわざを表示（遅延を入れて表示）
        if (score >= 6) {
            setTimeout(endGame, delay);  // ゲーム終了を遅延
        } else {
            // 入力が完了したら遅延後に次のことわざを表示
            setTimeout(showWord, delay);  
        }
    }

    // ユーザーの入力を遅延して表示
    delayedInputDisplay(userInput, delay);
}
*/

// 入力の処理
function handleInput() {
    const currentWordIndex = display_shortwords.indexOf(wordDisplay.textContent);
    const userInput = customInput.value.trim();

    // 遅延時間を取得
    const delay = delaytime[currentWordIndex];

    // 現在の遅延時間を画面に表示
    delayTimeDisplay.textContent = `現在のディレイタイム: ${delay}ms`;

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
        if (score >= 6) {
            setTimeout(endGame, 0);  // ゲーム終了を即時に実行
        } else {
            // 入力が正しく完了した場合、遅延無しで次のことわざを表示
            setTimeout(() => {
                showWord();  // 次のことわざを表示
            }, 0);  // 遅延を0に設定して即座に表示
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
        keystrokeCount++;
        keystrokeDisplay.textContent = keystrokeCount; // キーストロークの表示を更新

        if (event.key === "Backspace") {
            backspaceCount++;
            backspaceDisplay.textContent = backspaceCount;
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
    resultDisplay.textContent = "終了！ご協力ありがとうございます！お疲れ様でした！";
    resultDisplay.style.display = "block";

    customInput.style.left = "-9999px"; // ゲーム終了時に入力ボックスを画面外に移動
    startButton.style.display = "none";  // ゲーム終了時にスタートボタンを非表示
    customInput.style.display = "none"; // ゲーム終了時に入力ボックスを無効化
    inputDisplay.textContent = ""; // 入力表示エリアを初期化
    lateStartButton.style.display = "none"; //遅延モードの開始ボタン非表示

    // CSVをダウンロード
    downloadCSV(currentScore, currentTime, currentBackspaceCount, currentKeystrokeCount, wordTimes);
}

// CSVダウンロード用の関数
function downloadCSV(score, time, backspaceCount, keystrokeCount, wordTimes) {
    const headers = ["Score", "Time(s)", "Backspace Count", "Keystroke Count", "Word", "Input Time(s)"];
    let rows = [[score, (time / 1000).toFixed(2), backspaceCount, keystrokeCount]];  // ゲーム全体の結果
    wordTimes.forEach(wt => {
        rows.push([score, (time / 1000).toFixed(2), backspaceCount, keystrokeCount, wt.word, wt.inputTime ? wt.inputTime.toFixed(2) : '']);
    });

    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "game_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}