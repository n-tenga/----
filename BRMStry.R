# 必要なパッケージのインストールと読み込み
library(brms)

# データの準備
data <- read.csv("/Users/tenga/graduation-research/try1.csv")  # データを読み込み
print(data)
# BRMSでのモデル定義
model <- brm(
  formula = InputTime.s. ~ 1 + DelayTime.ms.,       # モデル式: 1は切片(β1)を表す
  data = data,
  family = gaussian(),         # 正規分布を仮定
  prior = c(
    prior(normal(0, 1), class = "Intercept"), # β1 (切片)の事前分布
    prior(normal(0, 1), class = "b")          # β2 (tauの係数)の事前分布
  ),
  iter = 2000,                 # サンプリング回数
  warmup = 500,                # ウォームアップ回数
  chains = 4,                  # チェーン数
  seed = 123                   # 再現性のための乱数シード
)

# モデルの要約
summary(model)

# プロットでの確認
plot(model)

# 事後予測チェック
pp_check(model)
