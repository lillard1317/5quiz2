// 危険物取扱者 第5類 問題演習アプリ
// questions.json を fetch して使用

const { useState, useEffect, useRef, useMemo } = React;

// ===== カテゴリカラー =====
const CATEGORY_COLORS = {
  "共通する性状": "#e74c3c",
  "共通する貯蔵・取扱い方法": "#e67e22",
  "共通する消火方法": "#2980b9",
  "有機過酸化物": "#8e44ad",
  "有機過酸化物（過酢酸）": "#9b59b6",
  "硝酸エステル類": "#27ae60",
  "ニトロ化合物": "#c0392b",
  "ニトロソ化合物": "#16a085",
  "アゾ化合物": "#d35400",
  "ジアゾ化合物": "#7f8c8d",
  "ヒドラジンの誘導体": "#1abc9c",
  "ヒドロキシルアミン": "#3498db",
  "ヒドロキシルアミン塩類": "#2ecc71",
  "その他政令で定めるもの": "#e91e63",
  "指定数量・法令": "#5d6d7e",
  "実務・緊急対応": "#922b21",
};

// ===== 暗記リファレンスデータ =====
const REFERENCE_DATA = [
  { group:"共通特性", icon:"⚡", color:"#e74c3c", items:[
    { name:"自己反応性", detail:"分子内に可燃物と酸素供給体が共存。外部酸素なしで爆発燃焼。" },
    { name:"比重", detail:"液体・固体ともに比重は1より大きい（水に沈む）。" },
    { name:"燃焼速度", detail:"極めて速い。加熱・衝撃・摩擦は絶対NG。" },
    { name:"消火原則", detail:"窒息消火（CO₂・粉末）は無効。大量の水・泡による冷却消火のみ有効。" },
  ]},
  { group:"有機過酸化物", icon:"🔴", color:"#8e44ad", items:[
    { name:"過酸化ベンゾイル", detail:"白色・粒状・無臭。水で湿らせて含水保存（乾燥厳禁）。約100℃で分解。" },
    { name:"MEKパーオキサイド", detail:"無色油状・特異臭。通気孔付きフタ必須（密閉NG）。漏洩時は布NG→けいそう土で回収。市販品はジメチルフタレートで希釈。" },
    { name:"過酢酸", detail:"無色・強刺激臭。引火点41℃。アルミ等の金属を腐食。水・アルコールに易溶。" },
  ]},
  { group:"硝酸エステル類", icon:"💧", color:"#27ae60", items:[
    { name:"共通（液体3種）", detail:"硝酸メチル・硝酸エチル・ニトログリセリン。無色・芳香・甘味・有毒。水に難溶、有機溶剤に溶ける。" },
    { name:"硝酸エチル", detail:"引火点10℃（常温で引火危険）。沸点87〜89℃。比重1.1。蒸気比重3.1。" },
    { name:"ニトログリセリン", detail:"8℃で凍結→感度激増（衝撃で爆発）。比重1.6。ダイナマイトの原料。" },
    { name:"ニトロセルロース", detail:"窒素含有量（硝化度）高いほど危険。湿綿状態（水・アルコール）で保存。乾燥すると衝撃に敏感。" },
    { name:"セルロイド", detail:"粗製品・古品は夏季に自然発火しやすい。通風・冷暗所保存必須。" },
  ]},
  { group:"ニトロ化合物", icon:"🟡", color:"#e67e22", items:[
    { name:"ピクリン酸", detail:"黄色結晶・苦味・無臭。金属と反応→爆発性金属塩生成（金属容器NG）。冷水に難溶・熱水・アルコールに溶ける。含水保存。" },
    { name:"TNT（トリニトロトルエン）", detail:"淡黄色結晶。日光で茶褐色に変色。金属とは反応しない。水に不溶。アルコール・エーテルに溶ける。" },
    { name:"ピクリン酸 vs TNT", detail:"【金属反応】ピクリン酸◯ / TNT✕　【日光変色】ピクリン酸✕ / TNT◯（茶褐色）" },
  ]},
  { group:"ニトロソ化合物", icon:"🟠", color:"#d35400", items:[
    { name:"ジニトロソペンタメチレンテトラミン", detail:"酸との接触で発火。加熱分解→窒素・アンモニア・ホルムアルデヒドを発生。" },
  ]},
  { group:"アゾ・ジアゾ化合物", icon:"🔷", color:"#2980b9", items:[
    { name:"アゾビスイソブチロニトリル", detail:"加熱で分解→窒素＋猛毒シアンガス発生。アセトン・ヘプタンと激しく反応。" },
    { name:"ジアゾジニトロフェノール", detail:"黄色粉末。雷管用起爆薬。水またはアルコール混合液中で貯蔵。日光で褐色変色。" },
  ]},
  { group:"ヒドラジン誘導体", icon:"🟤", color:"#795548", items:[
    { name:"硫酸ヒドラジン", detail:"水溶液は強酸性。強い還元性。アルコール・エーテルに不溶。温水には溶ける。" },
  ]},
  { group:"ヒドロキシルアミン・塩類", icon:"🔵", color:"#3498db", items:[
    { name:"ヒドロキシルアミン", detail:"水溶液は弱アルカリ性。NaOH（アルカリ）・鉄イオンと激しく反応→爆発危険。容器はガラス・プラスチック製。" },
    { name:"硫酸ヒドロキシルアミン", detail:"水溶液は酸性（金属腐食）。エーテル・アルコールに不溶。容器はポリエチレン・ガラス製。" },
  ]},
  { group:"アジ化ナトリウム【特別】", icon:"⛔", color:"#e91e63", items:[
    { name:"唯一の例外", detail:"第5類で唯一、分子内に酸素を含まない。" },
    { name:"消火：水・CO₂・ハロゲン化物 絶対厳禁", detail:"熱分解で金属Naが発生→水と反応して水素発生。乾燥砂のみ有効。" },
    { name:"禁忌接触", detail:"重金属（銅・鉛等）→衝撃敏感な重金属アジ化物生成。酸→猛毒・爆発性のアジ化水素発生。" },
  ]},
  { group:"試験直前チェック", icon:"✅", color:"#2ecc71", items:[
    { name:"水溶液が酸性", detail:"硫酸ヒドラジン・硫酸ヒドロキシルアミン・過酢酸" },
    { name:"含水（アルコール）保存（乾燥厳禁）", detail:"過酸化ベンゾイル・ピクリン酸・ニトロセルロース・ジアゾジニトロフェノール" },
    { name:"通気孔（ガス抜き）が必要", detail:"メチルエチルケトンパーオキサイドのみ" },
    { name:"金属容器NG", detail:"ピクリン酸・アジ化ナトリウム・過酢酸・硫酸ヒドロキシルアミン" },
    { name:"分類ミス注意", detail:"ニトログリセリン・ニトロセルロース→硝酸エステル類（ニトロ化合物ではない）" },
  ]},
  { group:"指定数量まとめ", icon:"⚖️", color:"#5d6d7e", items:[
    { name:"10kg（最少）", detail:"有機過酸化物・硝酸エステル類。危険性が最も高い2グループ。" },
    { name:"100kg", detail:"ニトロ化合物・ニトロソ化合物・アゾ化合物・ジアゾ化合物・ヒドラジン誘導体・ヒドロキシルアミン・ヒドロキシルアミン塩類・その他政令で定めるもの。" },
    { name:"倍数計算", detail:"貯蔵量 ÷ 指定数量 = 倍数。倍数が1以上で規制対象。50kg÷10kg=5倍。" },
  ]},
  { group:"実務・緊急対応", icon:"🚨", color:"#922b21", items:[
    { name:"NG！布での拭き取り", detail:"MEKPOは布・鉄さびと接触で常温発火。けいそう土・砂で吸収→石けん水で洗浄。" },
    { name:"NG！蓄熱", detail:"断熱材で包む・通風遮断は厳禁。分解熱が蓄積→自己加速的分解→爆発。" },
    { name:"NG！水（アジ化Na火災）", detail:"熱分解で金属Na生成→水と反応→水素爆発。乾燥砂・膨張ひる石のみ有効。" },
    { name:"NG！絶縁靴・化学繊維作業服", detail:"静電気蓄積→放電火花→点火源に。綿の服＋導電性靴（静電靴）が正解。" },
    { name:"NG！密栓（MEKPO）", detail:"分解ガスで内圧上昇→容器破裂。通気孔付きフタ必須。" },
    { name:"NG！金属スコップで叩く（ピクリン酸）", detail:"物理的衝撃→大規模爆発誘発。遠距離からの注水が正解。" },
    { name:"漏洩NGの処置（ニトログリセリン）", detail:"布で拭き取りNG→水酸化ナトリウムアルコール溶液で分解処理。" },
  ]},
];

// ===== ユーティリティ =====
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== 効果音 =====
let _soundOn = true;

function playCorrect() {
  if (!_soundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[0,523.25,0.15],[0.1,659.25,0.15],[0.2,783.99,0.25]].forEach(([t,freq,dur]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq; o.type = "sine";
      g.gain.setValueAtTime(0.3, ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+dur);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+dur+0.05);
    });
  } catch(e){}
}

function playWrong() {
  if (!_soundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[0,300,0.15],[0.15,220,0.3]].forEach(([t,freq,dur]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq; o.type = "sawtooth";
      g.gain.setValueAtTime(0.2, ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+dur);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+dur+0.05);
    });
  } catch(e){}
}

// ===== タブバー =====
function TabBar({ onReference, onQuiz, onSettings }) {
  const btn = (label, icon, onClick, isCenter) => (
    <button onClick={onClick} style={{
      flex:1, border:"none", background:"transparent",
      color: isCenter ? "#fff" : "#888",
      cursor:"pointer", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:2,
      fontSize:10, fontWeight:700, WebkitTapHighlightColor:"transparent", padding:0,
    }}>
      {isCenter ? (
        <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#e74c3c,#c0392b)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(231,76,60,0.5)", marginTop:-16 }}>
          <span style={{ fontSize:22 }}>{icon}</span>
          <span style={{ fontSize:9, color:"#fff", fontWeight:700 }}>{label}</span>
        </div>
      ) : (
        <>
          <span style={{ fontSize:22 }}>{icon}</span>
          <span>{label}</span>
        </>
      )}
    </button>
  );
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, height:64, background:"rgba(10,10,20,0.97)", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"stretch", zIndex:100, backdropFilter:"blur(12px)" }}>
      {btn("特性","📚", onReference, false)}
      {btn("問題集","📝", onQuiz, true)}
      {btn("設定","⚙️", onSettings, false)}
    </div>
  );
}

// ===== メニュー画面 =====
function MenuScreen({ allQuestions, onStart }) {
  const categories = Array.from(new Set(allQuestions.map(q => q.category)));
  const [selected, setSelected] = useState([]);
  const [numQ, setNumQ] = useState(10);
  const [catOpen, setCatOpen] = useState(false);

  const isAllSelected = selected.length === 0;
  const pool = isAllSelected ? allQuestions : allQuestions.filter(q => selected.includes(q.category));
  const maxQ = Math.min(50, pool.length);
  const safeNum = Math.min(numQ, maxQ);

  const toggleCat = (cat) => {
    setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const toggleAll = () => { setSelected([]); setCatOpen(false); };
  const catColor = (cat) => CATEGORY_COLORS[cat] || "#555";

  return (
    <div style={{ height:"100vh", background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)", fontFamily:"-apple-system,Hiragino Sans,sans-serif", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ maxWidth:460, width:"100%", margin:"0 auto", flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 20px 80px" }}>

        {/* タイトル */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:13, color:"#aaa", letterSpacing:2, marginBottom:8, fontWeight:600 }}>乙種 科目免除者用</div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#fff", margin:0, lineHeight:1.3 }}>
            危険物取扱者<br/><span style={{ color:"#e74c3c" }}>第5類</span> 問題演習
          </h1>
          <p style={{ marginTop:8, color:"#aaa", fontSize:13 }}>全{allQuestions.length}問収録</p>
        </div>

        {/* カテゴリ選択 */}
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, marginBottom:16, overflow:"hidden" }}>
          <div style={{ padding:"14px 16px" }}>
            <label style={{ fontSize:12, color:"#aaa", fontWeight:700 }}>📂 カテゴリ（複数選択可）</label>
            {!isAllSelected && (
              <span style={{ fontSize:11, color:"#aaa", marginLeft:8 }}>{selected.length}カテゴリ選択中</span>
            )}
          </div>

          {/* すべてボタン */}
          <button onClick={() => setCatOpen(o => !o)}
            style={{ width:"100%", padding:"12px 16px", background:isAllSelected?"rgba(231,76,60,0.15)":"rgba(255,255,255,0.04)", border:"none", borderTop:"1px solid rgba(255,255,255,0.07)", color:isAllSelected?"#e74c3c":"#bbb", fontSize:14, fontWeight:700, cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>🗂 すべて</span>
            <span style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, opacity:0.7 }}>{allQuestions.length}問</span>
              <span style={{ fontSize:12, color:"#555", transform:catOpen?"rotate(180deg)":"none", transition:"transform 0.2s", display:"inline-block" }}>▼</span>
            </span>
          </button>

          {/* 展開：各カテゴリ一覧（スクロール可能） */}
          {catOpen && (
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", maxHeight:"35vh", overflowY:"auto" }}>
              {!isAllSelected && (
                <button onClick={toggleAll}
                  style={{ width:"100%", padding:"10px 16px", background:"rgba(231,76,60,0.08)", border:"none", borderBottom:"1px solid rgba(255,255,255,0.06)", color:"#e74c3c", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
                  ✕ 選択をリセット（すべてに戻す）
                </button>
              )}
              {categories.map(cat => {
                const isOn = selected.includes(cat);
                const count = allQuestions.filter(q => q.category === cat).length;
                const cc = catColor(cat);
                return (
                  <button key={cat} onClick={() => toggleCat(cat)}
                    style={{ width:"100%", padding:"12px 16px", background:isOn?`${cc}18`:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.05)", color:isOn?cc:"#aaa", fontSize:13, fontWeight:isOn?700:400, cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:10, height:10, borderRadius:"50%", background:cc, display:"inline-block", flexShrink:0 }}/>
                      {cat}
                    </span>
                    <span style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                      <span style={{ fontSize:11, color:"#555" }}>{count}問</span>
                      <span style={{ width:20, height:20, borderRadius:5, border:`2px solid ${isOn?cc:"rgba(255,255,255,0.2)"}`, background:isOn?cc:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", fontWeight:900, flexShrink:0 }}>
                        {isOn?"✓":""}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 出題数スライダー */}
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:"18px 16px", marginBottom:16 }}>
          <label style={{ display:"block", fontSize:12, color:"#aaa", marginBottom:8, fontWeight:700 }}>
            📝 出題数：<span style={{ color:"#e74c3c", fontSize:18, fontWeight:900 }}>{safeNum}</span> 問
            <span style={{ fontSize:11, color:"#555", marginLeft:8 }}>（対象 {pool.length}問中）</span>
          </label>
          <input type="range" min={5} max={maxQ} value={safeNum}
            onChange={ev => setNumQ(Number(ev.target.value))}
            style={{ width:"100%", accentColor:"#e74c3c" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#555", marginTop:4 }}>
            <span>5問</span><span>{maxQ}問</span>
          </div>
        </div>

        {/* STARTボタン */}
        <button onClick={() => onStart(selected, safeNum)}
          style={{ width:"100%", padding:18, borderRadius:14, border:"none", background:"linear-gradient(135deg,#e74c3c,#c0392b)", color:"#fff", fontSize:18, fontWeight:900, cursor:"pointer", letterSpacing:3, boxShadow:"0 6px 24px rgba(231,76,60,0.45)" }}>
          START
        </button>
      </div>
    </div>
  );
}

// ===== クイズ画面 =====
function QuizScreen({ questions, onFinish, onMenu }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const scoreRef = useRef(0);
  const historyRef = useRef([]);
  const nextBtnRef = useRef(null);

  // 問題ごとに選択肢をシャッフル（currentが変わるたびに再生成）
  const shuffledChoices = useMemo(() => {
    const q = questions[current];
    const indexed = q.choices.map((text, i) => ({ text, origIndex: i }));
    const arr = [...indexed];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [current, questions]);

  const q = questions[current];
  const progress = (current / questions.length) * 100;
  // シャッフル後の正解インデックス
  const correctShuffledIdx = shuffledChoices.findIndex(c => c.origIndex === q.answer - 1);
  const isCorrect = answered && selected === correctShuffledIdx;
  const catColor = CATEGORY_COLORS[q.category] || "#555";

  const smoothScrollTo = (targetY, duration = 900) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();
    const ease = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    const step = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!answered) return;
    const timer = setTimeout(() => {
      if (nextBtnRef.current) {
        const rect = nextBtnRef.current.getBoundingClientRect();
        const targetY = window.scrollY + rect.bottom - window.innerHeight + 24;
        smoothScrollTo(Math.max(0, targetY), 900);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [answered]);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === correctShuffledIdx;
    if (correct) { scoreRef.current += 1; setScore(s => s+1); playCorrect(); } else { playWrong(); }
    const entry = { question:q, selected:idx, correct, shuffledChoices:[...shuffledChoices] };
    historyRef.current = [...historyRef.current, entry];
    setHistory(h => [...h, entry]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      window.scrollTo({ top: 0, behavior: "instant" });
      onFinish(historyRef.current, scoreRef.current);
    } else {
      setCurrent(c => c+1);
      setSelected(null);
      setAnswered(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f1a", fontFamily:"-apple-system,Hiragino Sans,sans-serif", color:"#eee" }}>
      {/* ヘッダー */}
      <div style={{ background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"48px 16px 12px" }}>
        <div style={{ marginBottom:10 }}>
          <button onClick={() => { window.scrollTo({ top:0, behavior:"instant" }); onMenu(); }} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", padding:"8px 14px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700 }}>← 戻る</button>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:13, color:"#aaa" }}>問題 <strong style={{ color:"#fff", fontSize:16 }}>{current+1}</strong> / {questions.length}</span>
          <span style={{ fontSize:14, color:"#2ecc71", fontWeight:700 }}>正解 {score}問</span>
        </div>
        <div style={{ height:5, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
          <div style={{ height:5, borderRadius:3, background:"#e74c3c", width:`${progress}%`, transition:"width 0.4s" }}/>
        </div>
      </div>

      {/* 本文 */}
      <div style={{ padding:"16px 16px 32px", paddingBottom: answered ? 32 : 90 }}>
        <div style={{ marginBottom:12 }}>
          <span style={{ display:"inline-block", background:catColor, color:"#fff", fontSize:11, padding:"4px 12px", borderRadius:20, fontWeight:700 }}>{q.category}</span>
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"18px 16px", marginBottom:16 }}>
          <p style={{ fontSize:14, lineHeight:2.0, whiteSpace:"pre-wrap", margin:0 }}>{q.question}</p>
        </div>

        {/* 選択肢 */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:12 }}>
          {shuffledChoices.map((c, i) => {
            const isCor = i === correctShuffledIdx, isSel = i === selected;
            let bg="rgba(255,255,255,0.04)", border="1px solid rgba(255,255,255,0.1)", tc="#ccc";
            if (answered) {
              if (isCor) { bg="rgba(46,204,113,0.15)"; border="2px solid #2ecc71"; tc="#2ecc71"; }
              else if (isSel) { bg="rgba(231,76,60,0.15)"; border="2px solid #e74c3c"; tc="#e74c3c"; }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={answered}
                style={{ background:bg, border, color:tc, padding:"14px 16px", borderRadius:12, textAlign:"left", cursor:answered?"default":"pointer", fontSize:14, lineHeight:1.6, fontFamily:"-apple-system,Hiragino Sans,sans-serif", display:"flex", alignItems:"flex-start", gap:12 }}>
                <span style={{ width:26, height:26, minWidth:26, borderRadius:"50%", background:answered&&isCor?"#2ecc71":answered&&isSel?"#e74c3c":"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff", marginTop:1 }}>
                  {answered&&isCor?"✓":answered&&isSel&&!isCor?"✗":String(i+1)}
                </span>
                <span style={{ flex:1 }}>{c.text}</span>
              </button>
            );
          })}
        </div>

        {/* 回答後エリア */}
        {answered && (
          <div>
            <div style={{ background:isCorrect?"rgba(46,204,113,0.08)":"rgba(231,76,60,0.08)", border:`1px solid ${isCorrect?"rgba(46,204,113,0.3)":"rgba(231,76,60,0.3)"}`, borderRadius:14, padding:16, marginBottom:4 }}>
              <div style={{ fontSize:16, fontWeight:900, marginBottom:8, color:isCorrect?"#2ecc71":"#e74c3c" }}>{isCorrect?"✅ 正解！":"❌ 不正解"}</div>
              <p style={{ fontSize:13, lineHeight:1.8, color:"#bbb", margin:0 }}>💡 {q.explanation}</p>
            </div>
            <div ref={nextBtnRef} style={{ paddingBottom:24, marginTop:12 }}>
              <button onClick={handleNext}
                style={{ width:"100%", padding:16, borderRadius:14, border:"none", background:"linear-gradient(135deg,#e74c3c,#c0392b)", color:"#fff", fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:1, boxShadow:"0 4px 20px rgba(231,76,60,0.4)" }}>
                {current+1 >= questions.length ? "結果を見る" : "次の問題 →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== 解説レビュー画面 =====
function ReviewScreen({ history, startIdx, onBack }) {
  const [idx, setIdx] = useState(startIdx || 0);
  const rh = history[idx];
  const catColor = CATEGORY_COLORS[rh.question.category] || "#555";

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f1a", fontFamily:"-apple-system,Hiragino Sans,sans-serif", color:"#eee" }}>
      <div style={{ background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"48px 16px 12px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => { window.scrollTo({ top:0, behavior:"instant" }); onBack(); }} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", padding:"8px 14px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700 }}>← 戻る</button>
        <span style={{ color:"#aaa", fontSize:14 }}>{idx+1} / {history.length}</span>
        <span style={{ marginLeft:"auto", fontSize:12, color:rh.correct?"#2ecc71":"#e74c3c", fontWeight:700 }}>{rh.correct?"✅ 正解":"❌ 不正解"}</span>
      </div>
      <div style={{ padding:"16px 16px 100px" }}>
        <div style={{ marginBottom:12 }}>
          <span style={{ display:"inline-block", background:catColor, color:"#fff", fontSize:11, padding:"4px 12px", borderRadius:20, fontWeight:700 }}>{rh.question.category}</span>
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"18px 16px", marginBottom:16 }}>
          <p style={{ fontSize:14, lineHeight:2.0, whiteSpace:"pre-wrap", margin:0 }}>{rh.question.question}</p>
        </div>
        {(rh.shuffledChoices || rh.question.choices.map((text,i)=>({text,origIndex:i}))).map((c, i) => {
          const isCor = i === (rh.shuffledChoices ? rh.shuffledChoices.findIndex(x => x.origIndex === rh.question.answer-1) : rh.question.answer-1);
          const isSel = i === rh.selected;
          return (
            <div key={i} style={{ padding:"12px 16px", borderRadius:12, marginBottom:8, fontSize:14, background:isCor?"rgba(46,204,113,0.15)":isSel&&!isCor?"rgba(231,76,60,0.15)":"rgba(255,255,255,0.03)", border:`1px solid ${isCor?"#2ecc71":isSel&&!isCor?"#e74c3c":"rgba(255,255,255,0.08)"}`, color:isCor?"#2ecc71":isSel&&!isCor?"#e74c3c":"#bbb", display:"flex", alignItems:"flex-start", gap:10 }}>
              <span style={{ fontWeight:900, minWidth:20 }}>{isCor?"✅":isSel&&!isCor?"❌":`${i+1}.`}</span>
              <span>{c.text}</span>
            </div>
          );
        })}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:16, marginTop:16 }}>
          <div style={{ fontSize:12, color:"#aaa", fontWeight:700, marginBottom:6 }}>💡 解説</div>
          <p style={{ fontSize:13, lineHeight:1.8, color:"#ccc", margin:0 }}>{rh.question.explanation}</p>
        </div>
      </div>
      <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"12px 16px", background:"rgba(15,15,26,0.95)", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", gap:10 }}>
        <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={idx===0}
          style={{ flex:1, padding:14, borderRadius:12, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:15, cursor:"pointer", fontWeight:700, opacity:idx===0?0.4:1 }}>◀ 前へ</button>
        <button onClick={() => setIdx(i => Math.min(history.length-1,i+1))} disabled={idx===history.length-1}
          style={{ flex:1, padding:14, borderRadius:12, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:15, cursor:"pointer", fontWeight:700, opacity:idx===history.length-1?0.4:1 }}>次へ ▶</button>
      </div>
    </div>
  );
}

// ===== 結果画面 =====
function ResultScreen({ history, score, totalQ, onRetry, onReview }) {
  const percent = Math.round((score / totalQ) * 100);
  const gc = percent >= 80 ? "#2ecc71" : percent >= 60 ? "#f39c12" : "#e74c3c";
  const gt = percent >= 80 ? "合格圏内！" : percent >= 60 ? "もう少し！" : "要復習";
  const wrongCount = history.filter(h => !h.correct).length;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)", fontFamily:"-apple-system,Hiragino Sans,sans-serif", color:"#eee", padding:"56px 20px", overflowY:"auto" }}>
      <div style={{ maxWidth:460, margin:"0 auto" }}>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:24, padding:28, marginBottom:16, textAlign:"center" }}>
          <h2 style={{ fontSize:30, fontWeight:900, color:gc, margin:"0 0 4px" }}>{gt}</h2>
          <p style={{ color:"#aaa", fontSize:14, margin:"0 0 20px" }}>{totalQ}問中 <strong style={{ color:"#fff", fontSize:22 }}>{score}</strong> 問正解</p>
          <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:16, padding:20, marginBottom:16 }}>
            <div style={{ fontSize:52, fontWeight:900, color:gc, lineHeight:1 }}>{percent}<span style={{ fontSize:24 }}>%</span></div>
            <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:4, marginTop:12 }}>
              <div style={{ height:8, borderRadius:4, background:gc, width:`${percent}%` }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <div style={{ background:"rgba(46,204,113,0.1)", border:"1px solid rgba(46,204,113,0.3)", borderRadius:12, padding:"10px 20px" }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#2ecc71" }}>{score}</div>
              <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>正解</div>
            </div>
            <div style={{ background:"rgba(231,76,60,0.1)", border:"1px solid rgba(231,76,60,0.3)", borderRadius:12, padding:"10px 20px" }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#e74c3c" }}>{wrongCount}</div>
              <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>不正解</div>
            </div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:20, marginBottom:16 }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:"#aaa", marginBottom:14 }}>問題一覧（タップで解説）</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {history.map((h, i) => (
              <button key={i} onClick={() => { window.scrollTo({ top:0, behavior:"instant" }); onReview(i); }}
                style={{ width:40, height:40, borderRadius:10, border:`1px solid ${h.correct?"rgba(46,204,113,0.4)":"rgba(231,76,60,0.4)"}`, background:h.correct?"rgba(46,204,113,0.2)":"rgba(231,76,60,0.2)", color:h.correct?"#2ecc71":"#e74c3c", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                {i+1}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={() => { window.scrollTo({ top:0, behavior:"instant" }); onReview(0); }} style={{ flex:1, padding:16, borderRadius:14, border:"1px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.07)", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>解説を見る</button>
          <button onClick={onRetry} style={{ flex:1, padding:16, borderRadius:14, border:"none", background:"linear-gradient(135deg,#e74c3c,#c0392b)", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>もう一度</button>
        </div>
      </div>
    </div>
  );
}

// ===== 暗記リファレンス画面 =====
function ReferenceScreen({ onBack }) {
  const [openGroup, setOpenGroup] = useState(null);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a14", fontFamily:"-apple-system,Hiragino Sans,sans-serif", color:"#eee", paddingBottom:80 }}>
      <div style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"48px 16px 14px", display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:10, backdropFilter:"blur(10px)" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", padding:"8px 14px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700 }}>← 戻る</button>
        <div>
          <h2 style={{ fontSize:16, fontWeight:900, color:"#fff", margin:0 }}>📚 各物質の特性</h2>
          <p style={{ fontSize:11, color:"#aaa", margin:0 }}>17物質 完全暗記シート</p>
        </div>
      </div>
      <div style={{ padding:"12px 16px" }}>
        {REFERENCE_DATA.map((group, gi) => {
          const isOpen = openGroup === gi;
          return (
            <div key={gi} style={{ marginBottom:10, borderRadius:14, overflow:"hidden", border:`1px solid ${group.color}44` }}>
              <button onClick={() => setOpenGroup(isOpen ? null : gi)}
                style={{ width:"100%", padding:"14px 16px", background:isOpen?`${group.color}22`:"rgba(255,255,255,0.04)", border:"none", color:"#fff", display:"flex", alignItems:"center", gap:10, cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontSize:20 }}>{group.icon}</span>
                <span style={{ flex:1, fontSize:15, fontWeight:800 }}>{group.group}</span>
                <span style={{ fontSize:12, color:isOpen?group.color:"#666", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s", display:"inline-block" }}>▼</span>
              </button>
              {isOpen && (
                <div style={{ background:"rgba(0,0,0,0.3)" }}>
                  {group.items.map((item, ii) => (
                    <div key={ii} style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize:13, fontWeight:800, color:group.color, marginBottom:5, display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:group.color, display:"inline-block", flexShrink:0 }}/>
                        {item.name}
                      </div>
                      <div style={{ fontSize:13, lineHeight:1.7, color:"#ccc", paddingLeft:12 }}>{item.detail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== 設定画面 =====
function SettingsScreen({ onBack, allQCount }) {
  const [soundOn, setSoundOn] = useState(_soundOn);

  const toggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    _soundOn = next;
    if (next) playCorrect();
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a14", fontFamily:"-apple-system,Hiragino Sans,sans-serif", color:"#eee", paddingBottom:80 }}>
      <div style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"48px 16px 14px", display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:10, backdropFilter:"blur(10px)" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", padding:"8px 14px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700 }}>← 戻る</button>
        <h2 style={{ fontSize:16, fontWeight:900, color:"#fff", margin:0 }}>⚙️ 設定</h2>
      </div>
      <div style={{ padding:"20px 16px" }}>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, overflow:"hidden" }}>
          <div style={{ padding:"18px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>🔊 効果音</div>
            <button onClick={toggle}
              style={{ width:56, height:30, borderRadius:15, border:"none", background:soundOn?"#2ecc71":"rgba(255,255,255,0.15)", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
              <span style={{ position:"absolute", top:3, left:soundOn?28:3, width:24, height:24, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 2px 6px rgba(0,0,0,0.4)" }}/>
            </button>
          </div>
        </div>
        <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, textAlign:"center" }}>
          <div style={{ fontSize:12, color:"#555", lineHeight:1.8 }}>
            危険物取扱者 第5類 問題演習<br/>全{allQCount}問収録
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== メインApp =====
function App() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("menu");
  const [questions, setQuestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(0);
  const [reviewStartIdx, setReviewStartIdx] = useState(0);

  useEffect(() => {
    fetch('questions.json')
      .then(r => r.json())
      .then(data => { setAllQuestions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleStart = (cats, num) => {
    const pool = cats.length === 0
      ? allQuestions
      : allQuestions.filter(q => cats.includes(q.category));
    setQuestions(shuffle(pool).slice(0, num));
    setHistory([]); setScore(0); setMode("quiz");
  };

  const handleFinish = (hist, finalScore) => {
    setHistory(hist); setScore(finalScore); setMode("result");
  };

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", background:"#1a1a2e", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, fontFamily:"-apple-system,Hiragino Sans,sans-serif" }}>
        <p style={{ color:"#fff", fontSize:16 }}>読み込み中...</p>
      </div>
    );
  }

  const tabBar = (
    <TabBar
      onReference={() => { window.scrollTo({ top:0, behavior:"instant" }); setMode("reference"); }}
      onQuiz={() => { window.scrollTo({ top:0, behavior:"instant" }); setMode("menu"); }}
      onSettings={() => { window.scrollTo({ top:0, behavior:"instant" }); setMode("settings"); }}
    />
  );

  if (mode === "reference") return <><ReferenceScreen onBack={() => { window.scrollTo({ top:0, behavior:"instant" }); setMode("menu"); }} />{tabBar}</>;
  if (mode === "settings") return <><SettingsScreen onBack={() => { window.scrollTo({ top:0, behavior:"instant" }); setMode("menu"); }} allQCount={allQuestions.length} />{tabBar}</>;
  if (mode === "menu") return <><MenuScreen allQuestions={allQuestions} onStart={handleStart} />{tabBar}</>;
  if (mode === "quiz") return <QuizScreen questions={questions} onFinish={handleFinish} onMenu={() => { window.scrollTo({ top:0, behavior:"instant" }); setMode("menu"); }} />;
  if (mode === "result") return <ResultScreen history={history} score={score} totalQ={questions.length} onRetry={() => { window.scrollTo({ top:0, behavior:"instant" }); setMode("menu"); }} onReview={(i) => { setReviewStartIdx(i); setMode("review"); }} />;
  if (mode === "review") return <ReviewScreen history={history} startIdx={reviewStartIdx} onBack={() => { window.scrollTo({ top:0, behavior:"instant" }); setMode("result"); }} />;
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
