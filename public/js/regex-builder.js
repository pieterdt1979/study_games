// Regular Expression Builder Game - COS2601
// Players select the correct regex for language descriptions and test word membership

const questions = [
  {
    category: "Basic",
    description: "All words over {a, b} that begin with <strong>a</strong> and end with <strong>b</strong>.",
    examples: { yes: ["ab", "aab", "abb", "aabb", "abab"], no: ["a", "b", "ba", "bb", "aa"] },
    options: ["a(a+b)*b", "(a+b)*ab", "a(a+b)*", "ab(a+b)*"],
    answer: 0,
    explanation: "The word must start with 'a', end with 'b', and have anything in between: a(a+b)*b. The shortest word is 'ab' (zero middle characters)."
  },
  {
    category: "Substring",
    description: "All words over {a, b} that contain the <strong>aa</strong>-substring.",
    examples: { yes: ["aa", "aab", "baa", "baab", "aaaa"], no: ["a", "b", "ab", "ba", "aba", "bab"] },
    options: ["(a+b)*aa(a+b)*", "a*aa b*", "(a+b)*a(a+b)*", "aa(a+b)*"],
    answer: 0,
    explanation: "The 'aa' can appear anywhere in the word: (a+b)*aa(a+b)*. Anything before, then 'aa', then anything after."
  },
  {
    category: "Length",
    description: "All words over {a, b} of <strong>even length</strong> (including Λ).",
    examples: { yes: ["Λ", "aa", "ab", "ba", "bb", "aaaa", "abab"], no: ["a", "b", "aab", "bba", "abb"] },
    options: ["((a+b)(a+b))*", "(a+b)*(a+b)*", "(aa+ab+ba+bb)", "(a+b)(a+b)*"],
    answer: 0,
    explanation: "Group characters in pairs — each pair is (a+b)(a+b). Repeat zero or more times: ((a+b)(a+b))*."
  },
  {
    category: "Exclusion",
    description: "All words over {a, b} that do <strong>not</strong> contain the <strong>ab</strong>-substring.",
    examples: { yes: ["Λ", "a", "b", "aa", "bb", "ba", "bba", "aaa", "bbba"], no: ["ab", "aab", "abb", "bab"] },
    options: ["b*a*", "a*b*", "(a+b)*", "(ba)*"],
    answer: 0,
    explanation: "If no 'ab' can appear, then no 'a' can come before a 'b'. All b's must precede all a's: b*a*."
  },
  {
    category: "Odd/Even",
    description: "All words over {a, b} with an <strong>odd number of a's</strong>.",
    examples: { yes: ["a", "ba", "ab", "bab", "aab", "bba", "aaab"], no: ["Λ", "b", "aa", "bb", "aabb"] },
    options: ["b*a(b*ab*a)*b*", "b*(ab*a)*b*", "(a+b)*a(a+b)*", "a(a+b)*a"],
    answer: 0,
    explanation: "Start with any b's, then one 'a', then pairs of a's (each separated by b's): b*a(b*ab*a)*b*. This ensures exactly an odd count of a's."
  },
  {
    category: "Beginning",
    description: "All words over {a, b} that begin with exactly one <strong>a</strong> (i.e. the first letter is 'a' and the second, if it exists, is not 'a').",
    examples: { yes: ["a", "ab", "abb", "abba", "abbb"], no: ["aa", "aab", "b", "ba", "aaab"] },
    options: ["a(b(a+b)*+ Λ)", "a(a+b)*", "(a+b)*a", "ab*"],
    answer: 0,
    explanation: "Must start with 'a'. If there are more characters, the next must be 'b' followed by anything. Or just 'a' alone: a(b(a+b)* + Λ), which simplifies to a + ab(a+b)*."
  },
  {
    category: "Repetition",
    description: "All words over {a, b} where every <strong>a</strong> is immediately followed by a <strong>b</strong>.",
    examples: { yes: ["Λ", "b", "ab", "bb", "abb", "abab", "bab", "abbb"], no: ["a", "aa", "ba", "aba"] },
    options: ["(ab+b)*", "(a+b)*ab", "b*(ab)*", "(ab)*b*"],
    answer: 0,
    explanation: "Each character block is either 'b' alone or the pair 'ab'. Repeat any number of times: (ab+b)*."
  },
  {
    category: "Ending",
    description: "All words over {a, b} that end with <strong>bb</strong>.",
    examples: { yes: ["bb", "abb", "bbb", "aabb", "ababb"], no: ["Λ", "b", "ab", "ba", "a", "aab"] },
    options: ["(a+b)*bb", "bb(a+b)*", "(a+b)*b", "a*bb"],
    answer: 0,
    explanation: "Anything at the start, then must end with 'bb': (a+b)*bb."
  },
  {
    category: "Exact",
    description: "All words over {a, b} of length <strong>exactly 3</strong>.",
    examples: { yes: ["aaa", "aab", "aba", "abb", "baa", "bab", "bba", "bbb"], no: ["Λ", "a", "ab", "aaaa"] },
    options: ["(a+b)(a+b)(a+b)", "(a+b)*", "(a+b)³", "aaa+bbb"],
    answer: 0,
    explanation: "Exactly three characters, each is 'a' or 'b': (a+b)(a+b)(a+b). There are 2³ = 8 such words."
  },
  {
    category: "Combination",
    description: "All words over {a, b} that start with <strong>b</strong> and contain at least one <strong>a</strong>.",
    examples: { yes: ["ba", "baa", "bba", "bab", "bbba"], no: ["Λ", "a", "b", "bb", "bbb", "ab"] },
    options: ["b(a+b)*a(a+b)*", "b*(a+b)*a", "(a+b)*ba(a+b)*", "ba(a+b)*"],
    answer: 0,
    explanation: "Must start with 'b', then eventually have at least one 'a'. We can write: b(a+b)*a(a+b)* — but simpler is b + b(a+b)*a(a+b)*. The first option captures words starting with 'b' that contain 'a' somewhere after."
  },
  {
    category: "Substring",
    description: "All words over {a, b} that contain <strong>both</strong> the substring 'ab' <strong>and</strong> the substring 'ba'.",
    examples: { yes: ["aba", "bab", "abba", "baba", "aaba", "abab"], no: ["Λ", "a", "ab", "ba", "aab", "bbb"] },
    options: ["(a+b)*aba(a+b)* + (a+b)*bab(a+b)*", "(a+b)*ab(a+b)*ba(a+b)* + (a+b)*ba(a+b)*ab(a+b)*", "(a+b)*ab(a+b)*", "(ab+ba)(a+b)*"],
    answer: 1,
    explanation: "The word must contain both 'ab' and 'ba'. Either 'ab' appears first then 'ba' later, or vice versa. This gives the union of both orderings."
  },
  {
    category: "Basic",
    description: "All words over {a, b} consisting of <strong>only a's</strong> (at least one).",
    examples: { yes: ["a", "aa", "aaa", "aaaa"], no: ["Λ", "b", "ab", "ba", "aab"] },
    options: ["aa*", "a*", "(a+b)*", "a+b"],
    answer: 0,
    explanation: "At least one 'a' and nothing else: aa* (which means one 'a' followed by zero or more 'a's). Note: a* would include Λ."
  }
];

let currentQ = 0;
let score = 0;
let streak = 0;
let answered = false;
let shuffled = [];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function init() {
  shuffled = shuffle(questions).slice(0, 10);
  currentQ = 0; score = 0; streak = 0; answered = false;
  render();
  renderSidebar();
}

function renderSidebar() {
  document.getElementById('sidebar').innerHTML = `
    <div style="background:#16213e;border-radius:12px;padding:1.5rem;height:fit-content;">
      <h4 style="color:#667eea;margin-bottom:1rem;">Progress</h4>
      <div style="background:#1a1a2e;border-radius:8px;height:8px;margin:1rem 0;overflow:hidden;">
        <div id="progressFill" style="height:100%;background:linear-gradient(90deg,#667eea,#764ba2);
          border-radius:8px;transition:width 0.4s;width:${(currentQ/shuffled.length)*100}%"></div>
      </div>
      <div class="stat-row"><span>Question</span><span>${currentQ+1} / ${shuffled.length}</span></div>
      <div class="stat-row"><span>Score</span><span id="scoreVal">${score}</span></div>
      <div class="stat-row"><span>Streak</span><span id="streakVal">${streak} 🔥</span></div>
      <hr style="border-color:#2a3a5e;margin:1rem 0;">
      <h4 style="color:#667eea;margin-bottom:0.75rem;">Regex Quick Ref</h4>
      <div style="font-size:0.8rem;color:#aaa;line-height:2;">
        <div><code style="color:#f8c291;">r*</code> — zero or more</div>
        <div><code style="color:#f8c291;">r+s</code> — r or s (union)</div>
        <div><code style="color:#f8c291;">rs</code> — r then s (concat)</div>
        <div><code style="color:#f8c291;">(a+b)*</code> — any word</div>
        <div><code style="color:#f8c291;">Λ</code> — empty string</div>
      </div>
      <hr style="border-color:#2a3a5e;margin:1rem 0;">
      <button onclick="init()" style="width:100%;padding:0.75rem;border-radius:8px;border:none;
        background:#2a3a5e;color:#ccc;cursor:pointer;font-size:0.9rem;">Restart</button>
    </div>
  `;
}

function render() {
  const q = shuffled[currentQ];
  const yesWords = q.examples.yes.slice(0, 5).join(', ');
  const noWords = q.examples.no.slice(0, 5).join(', ');

  let html = `
    <span style="display:inline-block;background:rgba(102,126,234,0.2);color:#667eea;
      padding:0.25rem 0.75rem;border-radius:12px;font-size:0.8rem;margin-bottom:0.5rem;">
      ${q.category}</span>
    <h3 style="color:#667eea;margin-bottom:1rem;">Question ${currentQ+1} of ${shuffled.length}</h3>
    <div style="font-size:1.1rem;line-height:1.8;color:#eee;margin-bottom:1rem;">
      ${q.description}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0;">
      <div style="background:#1a2744;border-radius:8px;padding:0.75rem 1rem;">
        <div style="color:#2ecc71;font-size:0.8rem;font-weight:bold;margin-bottom:0.3rem;">✓ In language:</div>
        <div style="color:#ccc;font-size:0.9rem;font-family:'Courier New',monospace;">${yesWords}</div>
      </div>
      <div style="background:#2a1a1a;border-radius:8px;padding:0.75rem 1rem;">
        <div style="color:#e74c3c;font-size:0.8rem;font-weight:bold;margin-bottom:0.3rem;">✗ Not in language:</div>
        <div style="color:#ccc;font-size:0.9rem;font-family:'Courier New',monospace;">${noWords}</div>
      </div>
    </div>
    <p style="color:#aaa;font-size:0.9rem;margin:1rem 0;">Select the regular expression that generates <em>exactly</em> this language:</p>
    <div style="display:grid;grid-template-columns:1fr;gap:0.6rem;margin:1rem 0;">
  `;

  q.options.forEach((opt, i) => {
    html += `<button class="opt-btn" id="opt_${i}" onclick="selectOpt(${i})"
      style="background:#1a1a2e;border:2px solid #4a5568;border-radius:8px;padding:1rem;
      color:#eee;font-size:1rem;cursor:pointer;text-align:left;
      font-family:'Courier New',monospace;transition:all 0.2s;">
      ${opt}</button>`;
  });

  html += `</div>
    <div id="explanation" style="background:#1a2744;border-left:4px solid #667eea;padding:1rem 1.5rem;
      border-radius:0 8px 8px 0;margin-top:1rem;display:none;line-height:1.7;color:#ccc;"></div>
    <button id="nextBtn" onclick="next()" style="display:none;margin-top:1.5rem;
      padding:0.75rem 1.5rem;border-radius:8px;border:none;font-size:1rem;cursor:pointer;
      font-weight:600;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">
      Next Question →</button>
  `;

  document.getElementById('questionBox').innerHTML = html;
}

function selectOpt(idx) {
  if (answered) return;
  answered = true;
  const q = shuffled[currentQ];

  const correctBtn = document.getElementById(`opt_${q.answer}`);
  correctBtn.style.borderColor = '#2ecc71';
  correctBtn.style.background = 'rgba(46,204,113,0.15)';
  correctBtn.style.color = '#2ecc71';

  if (idx !== q.answer) {
    const wrongBtn = document.getElementById(`opt_${idx}`);
    wrongBtn.style.borderColor = '#e74c3c';
    wrongBtn.style.background = 'rgba(231,76,60,0.15)';
    wrongBtn.style.color = '#e74c3c';
    streak = 0;
  } else {
    score++;
    streak++;
  }

  // Disable all buttons
  q.options.forEach((_, i) => {
    document.getElementById(`opt_${i}`).style.cursor = 'default';
  });

  const expl = document.getElementById('explanation');
  expl.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
  expl.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'inline-block';
  document.getElementById('scoreVal').textContent = score;
  document.getElementById('streakVal').textContent = `${streak} 🔥`;
}

function next() {
  currentQ++;
  answered = false;
  if (currentQ >= shuffled.length) {
    showResults();
    return;
  }
  render();
  renderSidebar();
}

function showResults() {
  const pct = Math.round((score / shuffled.length) * 100);
  const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';
  document.getElementById('questionBox').innerHTML = `
    <h3 style="color:#667eea;">${emoji} Quiz Complete!</h3>
    <div style="color:#eee;line-height:1.8;margin-top:1rem;">
      <p>You scored <strong>${score}</strong> out of <strong>${shuffled.length}</strong> (${pct}%).</p>
      <p style="margin-top:1rem;">${pct >= 80 ?
        'Excellent! You can reliably translate language descriptions into regular expressions.' :
        pct >= 60 ? 'Good work! Review the ones you missed — pay attention to Kleene star placement and boundary conditions.' :
        'Keep practicing! Start by listing example words, identify patterns (start, end, repetition), and build the regex piece by piece.'}</p>
    </div>
    <button onclick="init()" style="margin-top:1.5rem;padding:0.75rem 1.5rem;border-radius:8px;
      border:none;font-size:1rem;cursor:pointer;font-weight:600;
      background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">Try Again</button>
  `;
  document.getElementById('progressFill').style.width = '100%';
}

// Inject styles
const style = document.createElement('style');
style.textContent = `
  .game-layout { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; }
  @media (max-width: 900px) { .game-layout { grid-template-columns: 1fr; } }
  .question-box { background: #16213e; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; }
  .stat-row { display: flex; justify-content: space-between; padding: 0.5rem 0;
    border-bottom: 1px solid #2a3a5e; color: #ccc; font-size: 0.9rem; }
  .opt-btn:hover { border-color: #667eea !important; background: rgba(102,126,234,0.1) !important; }
`;
document.head.appendChild(style);

init();
