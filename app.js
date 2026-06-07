// 危険物取扱者 第5類 問題演習アプリ
// questions.json を fetch して使用する

const { useState, useRef, useEffect } = React;

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
  const isAllSelected = selected.length === 0;
  const pool = isAllSelected ? allQuestions : allQuestions.filter(q => selected.includes(q.category));
  const maxQ = Math.min(50, pool.length);
  const safeNum = Math.min(numQ, maxQ);
  const [catOpen, setCatOpen] = useState(false);

  const toggleCat = (cat) => {
    setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const toggleAll = () => { setSelected([]); setCatOpen(false); };
  const catColor = (cat) => CATEGORY_COLORS[cat] || "#555";

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)", fontFamily:"-apple-system,Hiragino Sans,sans-serif", padding:"24px 20px 100px" }}>
      <div style={{ maxWidth:460, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🔥</div>
          <h1 style={{ color:"#fff", fontSize:22, fontWeight:900, margin:0, letterSpacing:1 }}>危険物取扱者</h1>
          <p style={{ color:"#e74c3c", fontSize:14, fontWeight:700, margin:"4px 0 0" }}>第5類 問題演習</p>
          <p style={{ marginTop:8, color:"#aaa", fontSize:13 }}>全{allQuestions.length}問収録</p>
        </div>

        {/* カテゴリ選択 */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:16, padding:16, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ color:"#fff", fontWeight:700, fontSize:15 }}>📂 カテゴリ</span>
            <button onClick={() => setCatOpen(v => !v)} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", borderRadius:8, padding:"4px 12px", cursor:"pointer", fontSize:12 }}>
              {catOpen ? "▲ 閉じる" : "▼ 選択する"}
            </button>
          </div>
          <div onClick={toggleAll} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:10, background: isAllSelected ? "rgba(231,76,60,0.2)" : "rgba(255,255,255,0.05)", border: isAllSelected ? "1.5px solid #e74c3c" : "1.5px solid transparent", cursor:"pointer", marginBottom: catOpen ? 8 : 0 }}>
            <span style={{ fontSize:16 }}>{isAllSelected ? "✅" : "⬜"}</span>
            <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>すべてのカテゴリ</span>
            <span style={{ marginLeft:"auto", color:"#aaa", fontSize:12 }}>{allQuestions.length}問</span>
          </div>
          {catOpen && categories.map(cat => {
            const cnt = allQuestions.filter(q => q.category === cat).length;
            const isOn = selected.includes(cat);
            return (
              <div key={cat} onClick={() => toggleCat(cat)} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:10, background: isOn ? `${catColor(cat)}22` : "rgba(255,255,255,0.03)", border: isOn ? `1.5px solid ${catColor(cat)}` : "1.5px solid transparent", cursor:"pointer", marginBottom:4 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:catColor(cat), flexShrink:0 }} />
                <span style={{ color:"#ddd", fontSize:13, flex:1 }}>{cat}</span>
                <span style={{ color:"#888", fontSize:11 }}>{cnt}問</span>
              </div>
            );
          })}
        </div>

        {/* 出題数 */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:16, padding:16, marginBottom:24 }}>
          <p style={{ color:"#aaa", fontSize:13, margin:"0 0 8px" }}>
            📝 出題数：<span style={{ color:"#e74c3c", fontSize:18, fontWeight:900 }}>{safeNum}</span> 問
          </p>
          <input type="range" min={5} max={maxQ} value={safeNum}
            onChange={e => setNumQ(Number(e.target.value))}
            style={{ width:"100%", accentColor:"#e74c3c" }} />
          <div style={{ display:"flex", justifyContent:"space-between", color:"#666", fontSize:11 }}>
            <span>5問</span><span>{maxQ}問</span>
          </div>
        </div>

        <button onClick={() => onStart(shuffle(pool).slice(0, safeNum))} style={{ width:"100%", padding:"16px", background:"linear-gradient(135deg,#e74c3c,#c0392b)", border:"none", borderRadius:16, color:"#fff", fontSize:18, fontWeight:900, cursor:"pointer", boxShadow:"0 4px 20px rgba(231,76,60,0.4)", letterSpacing:1 }}>
          開始する 🔥
        </button>
      </div>
    </div>
  );
}

// ===== クイズ画面 =====
function QuizScreen({ questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const scoreRef = useRef(0);
  const historyRef = useRef([]);

  const q = questions[current];
  const catColor = CATEGORY_COLORS[q.category] || "#555";

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx + 1 === q.answer;
    if (correct) { scoreRef.current += 1; setScore(s => s+1); playCorrect(); } else { playWrong(); }
    const entry = { question:q, selected:idx, correct };
    historyRef.current = [...historyRef.current, entry];
    setHistory(h => [...h, entry]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      onFinish(historyRef.current, scoreRef.current);
    } else {
      setCurrent(c => c+1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const lines = q.question.split('\n');
  const questionText = lines[0];
  const optionLines = lines.slice(1).filter(l => l.trim());

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)", fontFamily:"-apple-system,Hiragino Sans,sans-serif", padding:"20px 16px 100px" }}>
      <div style={{ maxWidth:460, margin:"0 auto" }}>
        {/* ヘッダー */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ background:`${catColor}33`, color:catColor, borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{q.category}</span>
          <span style={{ color:"#aaa", fontSize:13 }}>{current+1} / {questions.length}</span>
        </div>

        {/* プログレスバー */}
        <div style={{ height:4, background:"rgba(255,255,255,0.1)", borderRadius:2, marginBottom:20 }}>
          <div style={{ height:"100%", width:`${((current+1)/questions.length)*100}%`, background:`linear-gradient(90deg,${catColor},#e74c3c)`, borderRadius:2, transition:"width 0.3s" }} />
        </div>

        {/* 問題文 */}
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:16, padding:20, marginBottom:16 }}>
          <p style={{ color:"#fff", fontSize:15, lineHeight:1.7, margin:0, fontWeight:600 }}>{questionText}</p>
        </div>

        {/* 選択肢 */}
        {q.choices.map((choice, idx) => {
          const isCorrect = idx + 1 === q.answer;
          const isSelected = selected === idx;
          let bg = "rgba(255,255,255,0.05)";
          let border = "1.5px solid rgba(255,255,255,0.1)";
          let color = "#ccc";
          if (answered) {
            if (isCorrect) { bg="rgba(46,204,113,0.2)"; border="1.5px solid #2ecc71"; color="#2ecc71"; }
            else if (isSelected) { bg="rgba(231,76,60,0.2)"; border="1.5px solid #e74c3c"; color="#e74c3c"; }
          } else if (isSelected) {
            bg="rgba(255,255,255,0.15)"; border="1.5px solid #fff";
          }
          return (
            <div key={idx} onClick={() => handleSelect(idx)} style={{ background:bg, border, borderRadius:12, padding:"12px 16px", marginBottom:8, cursor:answered?"default":"pointer", transition:"all 0.2s", display:"flex", alignItems:"flex-start", gap:10 }}>
              <span style={{ color:answered?(isCorrect?"#2ecc71":isSelected?"#e74c3c":"#666"):"#888", fontWeight:700, fontSize:14, minWidth:20, marginTop:1 }}>{idx+1}.</span>
              <span style={{ color, fontSize:14, lineHeight:1.6 }}>{choice}</span>
              {answered && isCorrect && <span style={{ marginLeft:"auto", fontSize:16 }}>✅</span>}
              {answered && isSelected && !isCorrect && <span style={{ marginLeft:"auto", fontSize:16 }}>❌</span>}
            </div>
          );
        })}

        {/* 解説 */}
        {answered && (
          <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:14, padding:16, marginTop:12, marginBottom:16 }}>
            <p style={{ color:"#f39c12", fontSize:12, fontWeight:700, margin:"0 0 6px" }}>💡 解説</p>
            <p style={{ color:"#ddd", fontSize:13, lineHeight:1.7, margin:0 }}>{q.explanation}</p>
          </div>
        )}

        {/* 次へボタン */}
        {answered && (
          <button onClick={handleNext} style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#e74c3c,#c0392b)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:900, cursor:"pointer", marginTop:8 }}>
            {current + 1 >= questions.length ? "結果を見る 📊" : "次の問題 →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ===== 結果画面 =====
function ResultScreen({ history, score, onRetry, onMenu }) {
  const total = history.length;
  const pct = Math.round((score / total) * 100);
  const gc = pct >= 80 ? "#2ecc71" : pct >= 60 ? "#f39c12" : "#e74c3c";
  const gt = pct >= 80 ? "合格圏内！" : pct >= 60 ? "もう少し！" : "要復習";

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)", fontFamily:"-apple-system,Hiragino Sans,sans-serif", padding:"32px 20px 100px" }}>
      <div style={{ maxWidth:460, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:8 }}>{pct >= 80 ? "🎉" : pct >= 60 ? "💪" : "📚"}</div>
        <h2 style={{ fontSize:30, fontWeight:900, color:gc, margin:"0 0 4px" }}>{gt}</h2>
        <p style={{ color:"#fff", fontSize:48, fontWeight:900, margin:"12px 0" }}>{pct}<span style={{ fontSize:24 }}>%</span></p>
        <p style={{ color:"#aaa", fontSize:16 }}>{total}問中 <span style={{ color:"#fff", fontWeight:700 }}>{score}問</span> 正解</p>

        {/* 正誤一覧 */}
        <div style={{ textAlign:"left", marginTop:24 }}>
          {history.map((h, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18 }}>{h.correct ? "✅" : "❌"}</span>
              <span style={{ color:"#ccc", fontSize:12, flex:1, lineHeight:1.5 }}>{h.question.question.split('\n')[0]}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:12, marginTop:24 }}>
          <button onClick={onRetry} style={{ flex:1, padding:"14px", background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:14, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>
            もう一度
          </button>
          <button onClick={onMenu} style={{ flex:1, padding:"14px", background:"linear-gradient(135deg,#e74c3c,#c0392b)", border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>
            メニューへ
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== リファレンス画面 =====
function ReferenceScreen() {
  const [open, setOpen] = useState({});
  const toggle = (i) => setOpen(prev => ({ ...prev, [i]: !prev[i] }));
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)", fontFamily:"-apple-system,Hiragino Sans,sans-serif", padding:"24px 16px 100px" }}>
      <div style={{ maxWidth:460, margin:"0 auto" }}>
        <h2 style={{ color:"#fff", fontSize:18, fontWeight:900, marginBottom:4 }}>📚 特性リファレンス</h2>
        <p style={{ color:"#aaa", fontSize:11, margin:"0 0 20px" }}>17物質 完全暗記シート</p>
        {REFERENCE_DATA.map((group, gi) => (
          <div key={gi} style={{ marginBottom:10 }}>
            <div onClick={() => toggle(gi)} style={{ background:`${group.color}22`, border:`1.5px solid ${group.color}55`, borderRadius:12, padding:"12px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>{group.icon}</span>
              <span style={{ color:"#fff", fontWeight:700, fontSize:15, flex:1 }}>{group.group}</span>
              <span style={{ color:group.color, fontSize:12 }}>{open[gi] ? "▲" : "▼"}</span>
            </div>
            {open[gi] && (
              <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:"0 0 12px 12px", padding:"8px 12px" }}>
                {group.items.map((item, ii) => (
                  <div key={ii} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"10px 4px" }}>
                    <p style={{ color:group.color, fontSize:12, fontWeight:700, margin:"0 0 4px" }}>▶ {item.name}</p>
                    <p style={{ color:"#bbb", fontSize:12, lineHeight:1.7, margin:0 }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== 設定画面 =====
function SettingsScreen({ soundOn, onToggleSound }) {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)", fontFamily:"-apple-system,Hiragino Sans,sans-serif", padding:"24px 20px 100px" }}>
      <div style={{ maxWidth:460, margin:"0 auto" }}>
        <h2 style={{ color:"#fff", fontSize:18, fontWeight:900, marginBottom:20 }}>⚙️ 設定</h2>
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:16, padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ color:"#fff", fontWeight:700, margin:"0 0 2px" }}>🔊 効果音</p>
              <p style={{ color:"#888", fontSize:12, margin:0 }}>正解・不正解時のサウンド</p>
            </div>
            <button onClick={onToggleSound} style={{ width:56, height:30, borderRadius:15, border:"none", background:soundOn?"#2ecc71":"rgba(255,255,255,0.15)", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:"#fff", position:"absolute", top:4, left:soundOn?30:4, transition:"left 0.2s" }} />
            </button>
          </div>
        </div>
        <div style={{ marginTop:24, textAlign:"center" }}>
          <p style={{ color:"#555", fontSize:11 }}>危険物取扱者 第5類 問題演習</p>
          <p style={{ color:"#555", fontSize:11 }}>全340問収録</p>
        </div>
      </div>
    </div>
  );
}

// ===== メインアプリ =====
function App() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("menu");
  const [mode, setMode] = useState("menu");
  const [questions, setQuestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    fetch('questions.json')
      .then(r => r.json())
      .then(data => {
        setAllQuestions(data);
        setLoading(false);
      })
      .catch(e => {
        console.error('questions.json の読み込みに失敗しました', e);
        setLoading(false);
      });
  }, []);

  const handleToggleSound = () => {
    _soundOn = !_soundOn;
    setSoundOn(_soundOn);
  };

  const handleStart = (qs) => {
    setQuestions(qs);
    setMode("quiz");
    setTab("quiz");
  };

  const handleFinish = (hist, sc) => {
    setHistory(hist);
    setScore(sc);
    setMode("result");
  };

  const handleRetry = () => {
    setMode("quiz");
    setQuestions(q => shuffle([...q]));
    setHistory([]);
    setScore(0);
  };

  const handleMenu = () => {
    setMode("menu");
    setTab("menu");
    setHistory([]);
    setScore(0);
  };

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
        <div style={{ fontSize:48 }}>🔥</div>
        <p style={{ color:"#fff", fontSize:16 }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      {tab === "reference" && mode !== "quiz" && mode !== "result" && <ReferenceScreen />}
      {(tab === "menu" || tab === "quiz") && mode === "menu" && <MenuScreen allQuestions={allQuestions} onStart={handleStart} />}
      {mode === "quiz" && <QuizScreen questions={questions} onFinish={handleFinish} />}
      {mode === "result" && <ResultScreen history={history} score={score} onRetry={handleRetry} onMenu={handleMenu} />}
      {(tab === "settings") && mode !== "quiz" && mode !== "result" && <SettingsScreen soundOn={soundOn} onToggleSound={handleToggleSound} />}
      {mode !== "quiz" && mode !== "result" && (
        <TabBar
          onReference={() => { setTab("reference"); setMode("menu"); }}
          onQuiz={() => { setTab("menu"); setMode("menu"); }}
          onSettings={() => { setTab("settings"); setMode("menu"); }}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
