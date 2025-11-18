// FLAMES Checker script
(function(){
  const form = document.getElementById('flamesForm');
  const maleInput = document.getElementById('maleName');
  const femaleInput = document.getElementById('femaleName');
  const resultEl = document.getElementById('result');
  const effects = document.getElementById('effects');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    clearEffects();
    const male = (maleInput.value || '').trim();
    const female = (femaleInput.value || '').trim();

    if(!male || !female){
      showResult('Please enter both names.');
      return;
    }

    // If exact pair Arjun + Jyoshna (case-insensitive), force Marriage and show love symbols
    if (male.toLowerCase() === 'arjun' && female.toLowerCase() === 'jyoshna') {
      showResult('MARRIAGE 💍', true);
      spawnHearts(18);
      return;
    }

    // Otherwise compute FLAMES normally
    const flamesResult = computeFlames(male, female);
    const mapping = {
      F: 'Friends',
      L: 'Love',
      A: 'Affection',
      M: 'Marriage',
      E: 'Enemies',
      S: 'Siblings'
    };
    const label = mapping[flamesResult] || flamesResult;
    showResult(`${label} ${emojiFor(flamesResult)}`, flamesResult === 'M');
    if (flamesResult === 'M') spawnHearts(12);
  });

  function showResult(text, highlight=false){
    resultEl.innerHTML = '';
    const span = document.createElement('div');
    span.className = highlight ? 'big' : '';
    span.textContent = text;
    resultEl.appendChild(span);
  }

  function clearEffects(){
    effects.innerHTML = '';
  }

  function spawnHearts(count){
    const w = window.innerWidth;
    const h = window.innerHeight;
    for(let i=0;i<count;i++){
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.textContent = '❤️';
      const left = Math.random()*80 + 10; // percent
      heart.style.left = left + '%';
      heart.style.bottom = '-30px';
      heart.style.animationDuration = (2 + Math.random()*2.5) + 's';
      heart.style.fontSize = (18 + Math.random()*28) + 'px';
      effects.appendChild(heart);

      // remove after animation
      heart.addEventListener('animationend', ()=> heart.remove());
    }
  }

  // FLAMES algorithm: remove common letters, count remaining, eliminate letters from FLAMES
  function computeFlames(a, b){
    // normalize: remove spaces and make lowercase
    let s1 = a.replace(/\s+/g,'').toLowerCase();
    let s2 = b.replace(/\s+/g,'').toLowerCase();

    // build frequency maps
    const freq1 = {};
    for (const ch of s1) freq1[ch] = (freq1[ch]||0)+1;
    const freq2 = {};
    for (const ch of s2) freq2[ch] = (freq2[ch]||0)+1;

    // remove common letters
    for (const ch in freq1){
      if (freq2[ch]){
        const common = Math.min(freq1[ch], freq2[ch]);
        freq1[ch] -= common;
        freq2[ch] -= common;
      }
    }

    // count remaining letters
    let remaining = 0;
    for (const ch in freq1) remaining += freq1[ch];
    for (const ch in freq2) remaining += freq2[ch];

    // If no remaining letters, many implementations treat as "Siblings" or "Marriage"
    if (remaining === 0) return 'S'; // treat as Siblings when identical letters cancel out

    let arr = ['F','L','A','M','E','S'];
    let idx = 0;
    while(arr.length > 1){
      idx = (idx + remaining - 1) % arr.length;
      arr.splice(idx,1);
      // next round starts from current idx
    }
    return arr[0];
  }

  function emojiFor(letter){
    switch(letter){
      case 'F': return '🤝';
      case 'L': return '💘';
      case 'A': return '😊';
      case 'M': return '💍';
      case 'E': return '😠';
      case 'S': return '👫';
      default: return '';
    }
  }

})();