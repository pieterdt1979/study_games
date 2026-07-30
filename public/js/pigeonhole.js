// Pigeonhole Principle Game
// Combines quiz questions with interactive draw simulations

// ===== STYLES =====
const style = document.createElement('style');
style.textContent = `
  .game-layout { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; }
  @media (max-width: 900px) { .game-layout { grid-template-columns: 1fr; } }
  .game-box { background: #16213e; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; }
  .stat-row { display: flex; justify-content: space-between; padding: 0.5rem 0;
    border-bottom: 1px solid #2a3a5e; color: #ccc; font-size: 0.9rem; }
  .option-btn { background: #1a1a2e; border: 2px solid #4a5568; border-radius: 8px;
    padding: 1rem; color: #eee; font-size: 1rem; cursor: pointer; transition: all 0.2s;
    text-align: center; width: 100%; }
  .option-btn:hover { border-color: #667eea; background: rgba(102,126,234,0.1); }
  .option-btn.correct { border-color: #2ecc71; background: rgba(46,204,113,0.15); color: #2ecc71; }
  .option-btn.wrong { border-color: #e74c3c; background: rgba(231,76,60,0.15); color: #e74c3c; }
  .draw-area { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; min-height: 60px;
    padding: 1rem; background: #1a1a2e; border-radius: 8px; border: 2px dashed #2a3a5e; }
  .drawn-item { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 1.2rem; font-weight: bold; animation: popIn 0.3s ease; }
  @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
  .draw-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; border: none;
    padding: 0.75rem 2rem; border-radius: 8px; font-size: 1rem; cursor: pointer; font-weight: 600;
    transition: all 0.2s; }
  .draw-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(102,126,234,0.4); }
  .draw-btn:disabled { opacity: 0.5; cursor: default; transform: none; box-shadow: none; }
  .highlight { animation: pulse 0.6s ease; }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }
  .holes-display { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1rem 0; }
  .hole-box { background: #1a1a2e; border: 1px solid #2a3a5e; border-radius: 8px; padding: 0.5rem 0.75rem;
    min-width: 70px; text-align: center; font-size: 0.85rem; color: #aaa; }
  .hole-box .count { font-size: 1.3rem; font-weight: bold; color: #eee; }
  .hole-box.overflow { border-color: #2ecc71; background: rgba(46,204,113,0.1); }
  .hole-box.overflow .count { color: #2ecc71; }
`;
document.head.appendChild(style);

// ===== QUESTION DATA =====
const quizQuestions = [
  {
    text: "A drawer contains red, blue, green, and yellow socks. What is the <strong>minimum</strong> number of socks you must pull out (blindfolded) to <strong>guarantee</strong> a matching pair?",
    pigeons: "socks drawn", holes: "4 colours",
    options: ["4", "5", "8", "3"],
    answer: 1,
    explanation: "With 4 colours (holes), drawing 4 socks could give one of each. The 5th sock must match one colour. By pigeonhole: 4 + 1 = 5."
  },
  {
    text: "In any group of <strong>13 people</strong>, at least how many must share the same birth month?",
    pigeons: "13 people", holes: "12 months",
    options: ["1", "2", "3", "13"],
    answer: 1,
    explanation: "Pigeons = 13 people, holes = 12 months. By generalized pigeonhole: ⌈13/12⌉ = 2. At least 2 people share a birth month."
  },
  {
    text: "A bag contains 100 marbles in 8 different colours. What is the <strong>minimum number</strong> guaranteed to be the same colour?",
    pigeons: "100 marbles", holes: "8 colours",
    options: ["12", "13", "8", "100"],
    answer: 1,
    explanation: "By generalized pigeonhole: ⌈100/8⌉ = ⌈12.5⌉ = 13. At least 13 marbles must be the same colour."
  },
  {
    text: "From the integers 1 to 20, how many must you pick to <strong>guarantee</strong> that two of them differ by exactly 5?",
    pigeons: "integers picked", holes: "pairs differing by 5",
    options: ["6", "10", "11", "5"],
    answer: 2,
    explanation: "Pair up: {1,6},{2,7},{3,8},{4,9},{5,10},{11,16},{12,17},{13,18},{14,19},{15,20}. That's 10 pairs. Pick one from each = 10 with no match. The 11th must fall in an occupied pair."
  },
  {
    text: "A computer generates 5-bit strings. If 33 strings are generated, at least how many must be <strong>identical</strong>?",
    pigeons: "33 strings", holes: "2⁵ = 32 possible strings",
    options: ["1", "2", "3", "33"],
    answer: 1,
    explanation: "There are 2⁵ = 32 possible 5-bit strings. With 33 strings: ⌈33/32⌉ = 2. At least 2 must be the same."
  },
  {
    text: "In a class of 40 students, what is the minimum number guaranteed to have birthdays in the <strong>same week</strong> of the year? (52 weeks)",
    pigeons: "40 students", holes: "52 weeks",
    options: ["0", "1", "2", "Cannot determine"],
    answer: 1,
    explanation: "⌈40/52⌉ = 1. Since 40 < 52, pigeonhole only guarantees at least 1 per some week. Actually with 40 students in 52 weeks, we can't guarantee more than 1! (You'd need 53 students to guarantee 2.)"
  },
  {
    text: "How many cards must you draw from a standard 52-card deck to <strong>guarantee</strong> you have at least 5 cards of the <strong>same suit</strong>?",
    pigeons: "cards drawn", holes: "4 suits",
    options: ["13", "17", "20", "5"],
    answer: 1,
    explanation: "To guarantee 5 of one suit: worst case is 4 of each suit = 4 × 4 = 16 cards with no suit having 5. The 17th card must give a 5th to some suit. Answer: 4(4) + 1 = 17."
  },
  {
    text: "Choose 5 points inside a unit square (1×1). At least two points must be within distance _____ of each other.",
    pigeons: "5 points", holes: "4 sub-squares",
    options: ["1", "√2/2 ≈ 0.71", "1/2", "√2 ≈ 1.41"],
    answer: 1,
    explanation: "Divide the square into 4 equal (½×½) sub-squares. By pigeonhole, at least 2 of 5 points share a sub-square. The max distance within a ½×½ square is its diagonal = √(¼+¼) = √2/2 ≈ 0.71."
  },
  {
    text: "Among any 10 integers, at least two have the same <strong>remainder when divided by 9</strong>.",
    pigeons: "10 integers", holes: "9 possible remainders",
    options: ["True", "False"],
    answer: 0,
    explanation: "Remainders mod 9 are 0,1,...,8 — that's 9 holes. With 10 integers (pigeons), by pigeonhole at least 2 share the same remainder."
  },
  {
    text: "A shelf holds books in 6 genres. How many books are needed to guarantee at least <strong>4 books</strong> of the same genre?",
    pigeons: "books", holes: "6 genres",
    options: ["18", "19", "24", "7"],
    answer: 1,
    explanation: "Worst case: 3 books in each of 6 genres = 18 books with no genre having 4. The 19th must complete a 4th in some genre: 3(6) + 1 = 19."
  }
];

// ===== INTERACTIVE DRAW SCENARIOS =====
const drawScenarios = [
  {
    title: "Sock Drawer",
    description: "Draw socks from a drawer containing <strong>4 colours</strong>. How many draws until you're <strong>guaranteed a matching pair</strong>?",
    items: ["🔴","🔵","🟢","🟡"],
    colors: ["#e74c3c","#3498db","#2ecc71","#f1c40f"],
    labels: ["Red","Blue","Green","Yellow"],
    targetCount: 2,
    predictAnswer: 5,
    predictQuestion: "How many draws are needed to GUARANTEE a pair?"
  },
  {
    title: "Card Suits",
    description: "Draw cards from a deck. How many draws to <strong>guarantee 3 cards of the same suit</strong>?",
    items: ["♠️","♥️","♦️","♣️"],
    colors: ["#2c3e50","#e74c3c","#e67e22","#27ae60"],
    labels: ["Spades","Hearts","Diamonds","Clubs"],
    targetCount: 3,
    predictAnswer: 9,
    predictQuestion: "How many draws to GUARANTEE 3 of one suit?"
  },
  {
    title: "Dice Rolls",
    description: "Roll a die repeatedly. How many rolls to <strong>guarantee the same number appears 3 times</strong>?",
    items: ["⚀","⚁","⚂","⚃","⚄","⚅"],
    colors: ["#8e44ad","#2980b9","#16a085","#d35400","#c0392b","#2c3e50"],
    labels: ["1","2","3","4","5","6"],
    targetCount: 3,
    predictAnswer: 13,
    predictQuestion: "How many rolls to GUARANTEE a number appears 3 times?"
  }
];

// ===== GAME STATE =====
let mode = 'menu'; // menu | quiz | draw | results
let currentQ = 0;
let score = 0;
let totalQ = 0;
let answered = false;
let drawState = null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== RENDER =====
function renderSidebar() {
  document.getElementById('sidebar').innerHTML = `
    <div style="background:#16213e;border-radius:12px;padding:1.5rem;height:fit-content;">
      <h4 style="color:#667eea;margin-bottom:1rem;">Pigeonhole Principle</h4>
      <div style="background:#1a1a2e;border-radius:8px;padding:1rem;margin-bottom:1rem;">
        <div style="color:#f8c291;font-family:'Courier New',monospace;font-size:0.9rem;text-align:center;">
          If n items are put into m<br>containers and n > m,<br>then at least one container<br>has more than one item.
        </div>
      </div>
      <div style="background:#1a1a2e;border-radius:8px;padding:1rem;margin-bottom:1rem;">
        <div style="color:#aaa;font-size:0.82rem;line-height:1.7;">
          <strong style="color:#667eea;">Generalized:</strong><br>
          If n pigeons go into k holes,<br>
          some hole has at least ⌈n/k⌉ pigeons.
        </div>
      </div>
      <div class="stat-row"><span>Score</span><span id="sideScore">${score} / ${totalQ}</span></div>
      <hr style="border-color:#2a3a5e;margin:1rem 0;">
      <button onclick="showMenu()" style="width:100%;padding:0.75rem;border-radius:8px;border:none;
        background:#2a3a5e;color:#ccc;cursor:pointer;font-size:0.9rem;">Main Menu</button>
    </div>
  `;
}

function showMenu() {
  mode = 'menu';
  score = 0; totalQ = 0;
  document.getElementById('gameBox').innerHTML = `
    <h3 style="color:#667eea;margin-bottom:1.5rem;">Choose a Mode</h3>
    <div style="display:grid;gap:1rem;">
      <button class="option-btn" onclick="startQuiz()" style="text-align:left;padding:1.5rem;">
        <div style="font-size:1.3rem;margin-bottom:0.3rem;">🧠 Quiz Mode</div>
        <div style="color:#aaa;font-size:0.9rem;">10 questions — identify pigeons, holes, and compute minimum guarantees</div>
      </button>
      <button class="option-btn" onclick="startDraw(0)" style="text-align:left;padding:1.5rem;">
        <div style="font-size:1.3rem;margin-bottom:0.3rem;">🧦 Sock Drawer Simulation</div>
        <div style="color:#aaa;font-size:0.9rem;">Draw socks and see pigeonhole in action — predict then verify</div>
      </button>
      <button class="option-btn" onclick="startDraw(1)" style="text-align:left;padding:1.5rem;">
        <div style="font-size:1.3rem;margin-bottom:0.3rem;">🃏 Card Suit Simulation</div>
        <div style="color:#aaa;font-size:0.9rem;">Draw cards until 3 of one suit — how many needed?</div>
      </button>
      <button class="option-btn" onclick="startDraw(2)" style="text-align:left;padding:1.5rem;">
        <div style="font-size:1.3rem;margin-bottom:0.3rem;">🎲 Dice Roll Simulation</div>
        <div style="color:#aaa;font-size:0.9rem;">Roll until one number appears 3 times — find the guarantee</div>
      </button>
    </div>
  `;
  renderSidebar();
}

// ===== QUIZ MODE =====
let quizOrder = [];

function startQuiz() {
  mode = 'quiz';
  quizOrder = shuffle(quizQuestions).slice(0, 10);
  currentQ = 0; score = 0; totalQ = 0; answered = false;
  renderQuizQuestion();
  renderSidebar();
}

function renderQuizQuestion() {
  const q = quizOrder[currentQ];
  answered = false;

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <span style="background:rgba(102,126,234,0.2);color:#667eea;padding:0.25rem 0.75rem;
        border-radius:12px;font-size:0.8rem;">Quiz ${currentQ+1}/${quizOrder.length}</span>
      <span style="color:#aaa;font-size:0.85rem;">🕊️ Pigeons: ${q.pigeons} &nbsp;|&nbsp; 📦 Holes: ${q.holes}</span>
    </div>
    <div style="font-size:1.1rem;line-height:1.8;color:#eee;margin-bottom:1.5rem;">${q.text}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;" id="quizOptions">
  `;
  q.options.forEach((opt, i) => {
    html += `<button class="option-btn" id="qopt_${i}" onclick="quizAnswer(${i})">${opt}</button>`;
  });
  html += `</div>
    <div id="quizExpl" style="background:#1a2744;border-left:4px solid #667eea;padding:1rem 1.5rem;
      border-radius:0 8px 8px 0;margin-top:1.5rem;display:none;line-height:1.7;color:#ccc;"></div>
    <button id="quizNext" onclick="nextQuizQ()" style="display:none;margin-top:1.5rem;padding:0.75rem 1.5rem;
      border-radius:8px;border:none;font-size:1rem;cursor:pointer;font-weight:600;
      background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">Next →</button>
  `;
  document.getElementById('gameBox').innerHTML = html;
}

function quizAnswer(idx) {
  if (answered) return;
  answered = true;
  totalQ++;
  const q = quizOrder[currentQ];
  document.getElementById(`qopt_${q.answer}`).classList.add('correct');
  if (idx === q.answer) { score++; }
  else { document.getElementById(`qopt_${idx}`).classList.add('wrong'); }

  document.getElementById('quizExpl').innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
  document.getElementById('quizExpl').style.display = 'block';
  document.getElementById('quizNext').style.display = 'inline-block';
  document.getElementById('sideScore').textContent = `${score} / ${totalQ}`;
}

function nextQuizQ() {
  currentQ++;
  if (currentQ >= quizOrder.length) { showQuizResults(); return; }
  renderQuizQuestion();
}

function showQuizResults() {
  const pct = Math.round((score / quizOrder.length) * 100);
  const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';
  document.getElementById('gameBox').innerHTML = `
    <h3 style="color:#667eea;">${emoji} Quiz Complete!</h3>
    <div style="color:#eee;line-height:1.8;margin-top:1rem;">
      <p>Score: <strong>${score}</strong> / <strong>${quizOrder.length}</strong> (${pct}%)</p>
      <p style="margin-top:1rem;">${pct >= 80 ? 'Excellent! You understand the pigeonhole principle well.' :
        pct >= 60 ? 'Good work! Remember: worst case = fill every hole evenly, then one more forces a repeat.' :
        'Keep practicing! The key insight: if n > m, putting n items in m boxes forces at least one box to have 2+.'}</p>
    </div>
    <div style="margin-top:1.5rem;display:flex;gap:1rem;">
      <button class="draw-btn" onclick="startQuiz()">Try Again</button>
      <button class="draw-btn" onclick="showMenu()" style="background:#2a3a5e;">Menu</button>
    </div>
  `;
}

// ===== DRAW SIMULATION MODE =====
function startDraw(scenarioIdx) {
  mode = 'draw';
  const s = drawScenarios[scenarioIdx];
  drawState = {
    scenario: s,
    drawn: [],
    counts: new Array(s.items.length).fill(0),
    done: false,
    predicted: false,
    prediction: null
  };
  renderDrawPrediction();
  renderSidebar();
}

function renderDrawPrediction() {
  const s = drawState.scenario;
  document.getElementById('gameBox').innerHTML = `
    <h3 style="color:#667eea;margin-bottom:0.5rem;">${s.title} Simulation</h3>
    <div style="color:#eee;line-height:1.7;margin-bottom:1.5rem;">${s.description}</div>
    <div style="background:#1a1a2e;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem;">
      <p style="color:#f8c291;font-weight:bold;margin-bottom:1rem;">${s.predictQuestion}</p>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;" id="predOptions">
        ${generatePredictionOptions(s.predictAnswer)}
      </div>
    </div>
  `;
}

function generatePredictionOptions(correctAnswer) {
  let opts = new Set([correctAnswer]);
  while (opts.size < 4) {
    const off = correctAnswer + (Math.floor(Math.random() * 7) - 3);
    if (off > 0 && off !== correctAnswer) opts.add(off);
  }
  const arr = shuffle([...opts]);
  return arr.map(v =>
    `<button class="option-btn" style="width:auto;padding:0.75rem 1.5rem;" onclick="makePrediction(${v})">${v}</button>`
  ).join('');
}

function makePrediction(val) {
  drawState.predicted = true;
  drawState.prediction = val;
  totalQ++;
  const correct = val === drawState.scenario.predictAnswer;
  if (correct) score++;
  document.getElementById('sideScore').textContent = `${score} / ${totalQ}`;
  renderDrawArea(correct);
}

function renderDrawArea(predCorrect) {
  const s = drawState.scenario;
  const correctAns = s.predictAnswer;
  const predFeedback = predCorrect
    ? `<span style="color:#2ecc71;">✓ Correct! The answer is ${correctAns}.</span>`
    : `<span style="color:#e74c3c;">✗ The correct answer is ${correctAns}.</span> (You said ${drawState.prediction})`;

  let html = `
    <h3 style="color:#667eea;margin-bottom:0.5rem;">${s.title} — Draw!</h3>
    <p style="color:#aaa;margin-bottom:0.5rem;">${predFeedback}</p>
    <p style="color:#eee;margin-bottom:1rem;">Now draw items one at a time and watch the pigeonhole principle in action. Target: <strong>${s.targetCount} of the same type</strong>.</p>
    <div class="holes-display" id="holesDisplay">
      ${s.labels.map((l, i) => `
        <div class="hole-box" id="hole_${i}">
          <div class="count" id="hcount_${i}">0</div>
          <div>${s.items[i]} ${l}</div>
        </div>
      `).join('')}
    </div>
    <div class="draw-area" id="drawArea"></div>
    <div style="display:flex;gap:1rem;align-items:center;margin-top:1rem;">
      <button class="draw-btn" id="drawBtn" onclick="drawOne()">Draw! 🎲</button>
      <span style="color:#aaa;" id="drawCount">Drawn: 0</span>
    </div>
    <div id="drawResult" style="margin-top:1rem;"></div>
  `;
  document.getElementById('gameBox').innerHTML = html;
}

function drawOne() {
  if (drawState.done) return;
  const s = drawState.scenario;
  const idx = Math.floor(Math.random() * s.items.length);
  drawState.drawn.push(idx);
  drawState.counts[idx]++;

  // Render drawn item
  const area = document.getElementById('drawArea');
  const el = document.createElement('div');
  el.className = 'drawn-item';
  el.style.background = s.colors[idx];
  el.textContent = s.items[idx];
  area.appendChild(el);

  // Update hole counts
  document.getElementById(`hcount_${idx}`).textContent = drawState.counts[idx];

  // Check if target reached
  if (drawState.counts[idx] >= s.targetCount) {
    document.getElementById(`hole_${idx}`).classList.add('overflow');
    drawState.done = true;
    document.getElementById('drawBtn').disabled = true;
    document.getElementById('drawResult').innerHTML = `
      <div style="background:rgba(46,204,113,0.15);border:1px solid #2ecc71;border-radius:8px;
        padding:1rem;color:#2ecc71;margin-top:1rem;">
        🎉 <strong>${s.targetCount} ${s.labels[idx]}!</strong> Achieved in <strong>${drawState.drawn.length}</strong> draws.
        ${drawState.drawn.length <= s.predictAnswer
          ? `<br>The worst-case guarantee was ${s.predictAnswer} — you got lucky (or it matched)!`
          : `<br>This shouldn't happen — worst case is ${s.predictAnswer}!`}
      </div>
      <div style="margin-top:1rem;display:flex;gap:1rem;">
        <button class="draw-btn" onclick="showMenu()">Menu</button>
      </div>
    `;
  }

  document.getElementById('drawCount').textContent = `Drawn: ${drawState.drawn.length}`;
}

// ===== INIT =====
showMenu();
