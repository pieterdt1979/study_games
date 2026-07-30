// Natural Deduction Proof Game - COS3761
// Players complete proofs by choosing the correct justification for each step

const proofs = [
  {
    name: "And Elimination",
    sequent: "p ∧ q, r ⊢ q ∧ r",
    lines: [
      { num: 1, formula: "p ∧ q", rule: "premise", refs: "" },
      { num: 2, formula: "r", rule: "premise", refs: "" },
      { num: 3, formula: "q", rule: "∧e₂", refs: "1" },
      { num: 4, formula: "q ∧ r", rule: "∧i", refs: "3, 2" }
    ],
    blanks: [2, 3] // indices to hide (0-based)
  },
  {
    name: "Modus Ponens Chain",
    sequent: "p → (q → r), p, ¬r ⊢ ¬q",
    lines: [
      { num: 1, formula: "p → (q → r)", rule: "premise", refs: "" },
      { num: 2, formula: "p", rule: "premise", refs: "" },
      { num: 3, formula: "¬r", rule: "premise", refs: "" },
      { num: 4, formula: "q → r", rule: "→e", refs: "1, 2" },
      { num: 5, formula: "¬q", rule: "MT", refs: "4, 3" }
    ],
    blanks: [3, 4]
  },
  {
    name: "Double Negation",
    sequent: "p, ¬¬(q ∧ r) ⊢ ¬¬p ∧ r",
    lines: [
      { num: 1, formula: "p", rule: "premise", refs: "" },
      { num: 2, formula: "¬¬(q ∧ r)", rule: "premise", refs: "" },
      { num: 3, formula: "¬¬p", rule: "¬¬i", refs: "1" },
      { num: 4, formula: "q ∧ r", rule: "¬¬e", refs: "2" },
      { num: 5, formula: "r", rule: "∧e₂", refs: "4" },
      { num: 6, formula: "¬¬p ∧ r", rule: "∧i", refs: "3, 5" }
    ],
    blanks: [2, 3, 4, 5]
  },
  {
    name: "Implication Introduction",
    sequent: "p → q ⊢ ¬q → ¬p",
    lines: [
      { num: 1, formula: "p → q", rule: "premise", refs: "" },
      { num: 2, formula: "¬q", rule: "assumption", refs: "" },
      { num: 3, formula: "¬p", rule: "MT", refs: "1, 2" },
      { num: 4, formula: "¬q → ¬p", rule: "→i", refs: "2–3" }
    ],
    blanks: [2, 3]
  },
  {
    name: "Negation Introduction",
    sequent: "p → q, p → ¬q ⊢ ¬p",
    lines: [
      { num: 1, formula: "p → q", rule: "premise", refs: "" },
      { num: 2, formula: "p → ¬q", rule: "premise", refs: "" },
      { num: 3, formula: "p", rule: "assumption", refs: "" },
      { num: 4, formula: "q", rule: "→e", refs: "1, 3" },
      { num: 5, formula: "¬q", rule: "→e", refs: "2, 3" },
      { num: 6, formula: "⊥", rule: "¬e", refs: "4, 5" },
      { num: 7, formula: "¬p", rule: "¬i", refs: "3–6" }
    ],
    blanks: [3, 4, 5, 6]
  },
  {
    name: "Disjunction Commutativity",
    sequent: "p ∨ q ⊢ q ∨ p",
    lines: [
      { num: 1, formula: "p ∨ q", rule: "premise", refs: "" },
      { num: 2, formula: "p", rule: "assumption", refs: "" },
      { num: 3, formula: "q ∨ p", rule: "∨i₂", refs: "2" },
      { num: 4, formula: "q", rule: "assumption", refs: "" },
      { num: 5, formula: "q ∨ p", rule: "∨i₁", refs: "4" },
      { num: 6, formula: "q ∨ p", rule: "∨e", refs: "1, 2–3, 4–5" }
    ],
    blanks: [2, 4, 5]
  },
  {
    name: "Conjunction Decomposition",
    sequent: "(p ∧ q) ∧ r, s ∧ t ⊢ q ∧ s",
    lines: [
      { num: 1, formula: "(p ∧ q) ∧ r", rule: "premise", refs: "" },
      { num: 2, formula: "s ∧ t", rule: "premise", refs: "" },
      { num: 3, formula: "p ∧ q", rule: "∧e₁", refs: "1" },
      { num: 4, formula: "q", rule: "∧e₂", refs: "3" },
      { num: 5, formula: "s", rule: "∧e₁", refs: "2" },
      { num: 6, formula: "q ∧ s", rule: "∧i", refs: "4, 5" }
    ],
    blanks: [2, 3, 4, 5]
  },
  {
    name: "Currying",
    sequent: "p ∧ q → r ⊢ p → (q → r)",
    lines: [
      { num: 1, formula: "p ∧ q → r", rule: "premise", refs: "" },
      { num: 2, formula: "p", rule: "assumption", refs: "" },
      { num: 3, formula: "q", rule: "assumption", refs: "" },
      { num: 4, formula: "p ∧ q", rule: "∧i", refs: "2, 3" },
      { num: 5, formula: "r", rule: "→e", refs: "1, 4" },
      { num: 6, formula: "q → r", rule: "→i", refs: "3–5" },
      { num: 7, formula: "p → (q → r)", rule: "→i", refs: "2–6" }
    ],
    blanks: [3, 4, 5, 6]
  }
];

const allRules = [
  "premise", "assumption", "∧i", "∧e₁", "∧e₂",
  "→e", "→i", "MT", "¬¬i", "¬¬e",
  "∨i₁", "∨i₂", "∨e", "¬e", "¬i", "⊥e", "PBC", "copy"
];

let currentProof = 0;
let score = 0;
let totalAttempts = 0;
let correctAnswers = 0;
let proofOrder = [];
let blankStates = {}; // index -> 'pending'|'correct'|'wrong'

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function init() {
  proofOrder = shuffle(Array.from({length: proofs.length}, (_, i) => i));
  currentProof = 0;
  score = 0;
  totalAttempts = 0;
  correctAnswers = 0;
  renderProof();
  renderSidebar();
}

function renderSidebar() {
  document.getElementById('sidebar').innerHTML = `
    <div style="background:#16213e;border-radius:12px;padding:1.5rem;height:fit-content;">
      <h4 style="color:#667eea;margin-bottom:1rem;">Progress</h4>
      <div style="background:#1a1a2e;border-radius:8px;height:8px;margin:1rem 0;overflow:hidden;">
        <div id="progressFill" style="height:100%;background:linear-gradient(90deg,#667eea,#764ba2);
          border-radius:8px;transition:width 0.4s;width:${(currentProof/proofs.length)*100}%"></div>
      </div>
      <div class="stat-row"><span>Proof</span><span>${currentProof+1} / ${proofs.length}</span></div>
      <div class="stat-row"><span>Score</span><span>${score}</span></div>
      <hr style="border-color:#2a3a5e;margin:1rem 0;">
      <h4 style="color:#667eea;margin-bottom:0.75rem;">Rules Reference</h4>
      <div style="font-size:0.8rem;color:#aaa;line-height:2;">
        <div><code style="color:#f8c291;">∧i</code> — And Introduction</div>
        <div><code style="color:#f8c291;">∧e₁/∧e₂</code> — And Elimination</div>
        <div><code style="color:#f8c291;">→e</code> — Modus Ponens</div>
        <div><code style="color:#f8c291;">→i</code> — Implies Introduction</div>
        <div><code style="color:#f8c291;">MT</code> — Modus Tollens</div>
        <div><code style="color:#f8c291;">¬¬i/¬¬e</code> — Double Negation</div>
        <div><code style="color:#f8c291;">∨i₁/∨i₂</code> — Or Introduction</div>
        <div><code style="color:#f8c291;">∨e</code> — Or Elimination</div>
        <div><code style="color:#f8c291;">¬e</code> — Not Elim (⊥ intro)</div>
        <div><code style="color:#f8c291;">¬i</code> — Not Introduction</div>
        <div><code style="color:#f8c291;">⊥e</code> — Contradiction Elim</div>
        <div><code style="color:#f8c291;">PBC</code> — Proof by Contradiction</div>
      </div>
      <hr style="border-color:#2a3a5e;margin:1rem 0;">
      <button onclick="init()" style="width:100%;padding:0.75rem;border-radius:8px;border:none;
        background:#2a3a5e;color:#ccc;cursor:pointer;font-size:0.9rem;">Restart</button>
    </div>
  `;
}

function renderProof() {
  const pIdx = proofOrder[currentProof];
  const proof = proofs[pIdx];
  blankStates = {};
  proof.blanks.forEach(b => blankStates[b] = 'pending');

  let html = `
    <h3 style="color:#667eea;margin-bottom:0.5rem;">${proof.name}</h3>
    <p style="color:#aaa;font-size:0.9rem;margin-bottom:1rem;">Fill in the missing justifications (rules + references).</p>
    <div style="background:#1a1a2e;border-radius:8px;padding:1rem 1.5rem;margin:1rem 0;
      font-family:'Courier New',monospace;font-size:1.1rem;color:#f8c291;text-align:center;
      border:1px solid #2a3a5e;">${proof.sequent}</div>
    <div style="margin:1.5rem 0;">
  `;

  proof.lines.forEach((line, idx) => {
    const isBlank = proof.blanks.includes(idx);
    const state = blankStates[idx];
    const bgColor = state === 'correct' ? 'rgba(46,204,113,0.1)' :
                    state === 'wrong' ? 'rgba(231,76,60,0.1)' : 'transparent';
    const borderLeft = line.rule === 'assumption' ? '3px solid #e67e22' : '3px solid transparent';

    html += `<div style="display:grid;grid-template-columns:35px 1fr 200px;gap:0.75rem;
      align-items:center;padding:0.6rem 0.75rem;border-radius:6px;margin:4px 0;
      font-family:'Courier New',monospace;font-size:0.92rem;background:${bgColor};
      border-left:${borderLeft};">
      <span style="color:#667eea;font-weight:bold;">${line.num}</span>
      <span style="color:#eee;">${line.formula}</span>`;

    if (isBlank && state === 'pending') {
      html += `<select id="sel_${idx}" onchange="checkRule(${idx})" style="background:#1a1a2e;
        border:2px solid #4a5568;border-radius:6px;padding:0.4rem;color:#eee;font-size:0.85rem;
        cursor:pointer;">
        <option value="">— select rule —</option>`;
      allRules.forEach(r => { html += `<option value="${r}">${r}</option>`; });
      html += `</select>`;
    } else if (isBlank && state === 'correct') {
      html += `<span style="color:#2ecc71;font-weight:bold;">${line.rule} ${line.refs}</span>`;
    } else if (isBlank && state === 'wrong') {
      html += `<span style="color:#e74c3c;">${line.rule} ${line.refs} ✓</span>`;
    } else {
      html += `<span style="color:#aaa;">${line.rule} ${line.refs}</span>`;
    }

    html += `</div>`;
  });

  html += `</div>
    <div id="proofFeedback" style="margin-top:1rem;"></div>
    <button id="nextProofBtn" onclick="nextProof()" style="display:none;margin-top:1rem;
      padding:0.75rem 1.5rem;border-radius:8px;border:none;font-size:1rem;cursor:pointer;
      font-weight:600;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">
      Next Proof →</button>
  `;

  document.getElementById('proofBox').innerHTML = html;
}

function checkRule(idx) {
  const pIdx = proofOrder[currentProof];
  const proof = proofs[pIdx];
  const line = proof.lines[idx];
  const sel = document.getElementById(`sel_${idx}`);
  const chosen = sel.value;

  if (!chosen) return;
  totalAttempts++;

  if (chosen === line.rule) {
    blankStates[idx] = 'correct';
    score++;
    correctAnswers++;
  } else {
    blankStates[idx] = 'wrong';
  }

  renderProof();

  // Check if all blanks are done
  const allDone = proof.blanks.every(b => blankStates[b] !== 'pending');
  if (allDone) {
    const allCorrect = proof.blanks.every(b => blankStates[b] === 'correct');
    const fb = document.getElementById('proofFeedback');
    if (allCorrect) {
      fb.innerHTML = `<div style="background:rgba(46,204,113,0.15);border:1px solid #2ecc71;
        border-radius:8px;padding:1rem;color:#2ecc71;">✓ Proof completed correctly!</div>`;
    } else {
      fb.innerHTML = `<div style="background:rgba(231,76,60,0.15);border:1px solid #e74c3c;
        border-radius:8px;padding:1rem;color:#e74c3c;">Some rules were incorrect. The correct rules are shown above.</div>`;
    }
    document.getElementById('nextProofBtn').style.display = 'inline-block';
  }
}

function nextProof() {
  currentProof++;
  if (currentProof >= proofs.length) {
    showFinalResults();
    return;
  }
  renderProof();
  renderSidebar();
}

function showFinalResults() {
  const pct = Math.round((score / (totalAttempts || 1)) * 100);
  const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';
  document.getElementById('proofBox').innerHTML = `
    <h3 style="color:#667eea;">${emoji} All Proofs Complete!</h3>
    <div style="color:#eee;line-height:1.8;margin-top:1rem;">
      <p>Correct rule selections: <strong>${correctAnswers}</strong> / <strong>${totalAttempts}</strong> (${pct}%)</p>
      <p style="margin-top:1rem;">${pct >= 80 ?
        'Excellent! You have a strong grasp of natural deduction rules.' :
        pct >= 60 ? 'Good work! Review the rules you missed — pay attention to when →i vs →e applies.' :
        'Keep practicing! Focus on understanding what each rule requires as premises and what it produces.'}</p>
    </div>
    <button onclick="init()" style="margin-top:1.5rem;padding:0.75rem 1.5rem;border-radius:8px;
      border:none;font-size:1rem;cursor:pointer;font-weight:600;
      background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">Try Again</button>
  `;
  document.getElementById('progressFill').style.width = '100%';
}

// Add needed styles
const style = document.createElement('style');
style.textContent = `
  .game-layout { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; }
  @media (max-width: 900px) { .game-layout { grid-template-columns: 1fr; } }
  .proof-box { background: #16213e; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; }
  .stat-row { display: flex; justify-content: space-between; padding: 0.5rem 0;
    border-bottom: 1px solid #2a3a5e; color: #ccc; font-size: 0.9rem; }
`;
document.head.appendChild(style);

init();
