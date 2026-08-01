import { useEffect, useRef, useState } from 'react';
import { botR } from '../data.js';

function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

const INITIAL_MSG = "Welcome to LibraryHub. I'm Sage — your guide through five centuries of the world's finest stories. 📚 Tell me what you're looking for: a genre, a classic, a mood, or even a single word. I'll find something that will stay with you.";

export default function ChatWidget() {
  const [msgs, setMsgs] = useState([{ role: 'bot', text: INITIAL_MSG }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, typing]);

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function send() {
    const val = input.trim();
    if (!val) return;
    setMsgs(prev => [...prev, { role: 'user', text: val }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const l = val.toLowerCase();
      let r;
      if (/hi|hello|hey/.test(l)) r = pick(botR.greet);
      else if (/fantasy|dragon|magic|tolkien/.test(l)) r = pick(botR.fantasy);
      else if (/sci.?fi|space|robot|orwell|1984/.test(l)) r = botR.scifi[0];
      else if (/mystery|detective|sherlock/.test(l)) r = botR.mystery[0];
      else if (/horror|ghost|haunt/.test(l)) r = botR.horror[0];
      else if (/romance|love|austen/.test(l)) r = botR.romance[0];
      else if (/adventure|quest|journey/.test(l)) r = botR.adventure[0];
      else if (/child|kid|family/.test(l)) r = botR.children[0];
      else if (/dark|gothic|grim/.test(l)) r = botR.dark[0];
      else r = pick(botR.default);
      setMsgs(prev => [...prev, { role: 'bot', text: r }]);
    }, 1300);
  }

  return (
    <div className="chat-shell">
      <div className="chat-head">
        <div className="chat-gem">S</div>
        <div className="chat-head-info"><strong>Sage · AI Story Guide</strong><span>🟢 Online — ready to find your next obsession</span></div>
      </div>
      <div className="chat-msgs" ref={boxRef}>
        {msgs.map((m, i) => (
          <div className={`msg ${m.role === 'bot' ? 'b' : 'u'}`} key={i}>
            <div className="msg-av">{m.role === 'bot' ? 'S' : 'Me'}</div>
            <div className="msg-bub">{renderBold(m.text)}</div>
          </div>
        ))}
      </div>
      <div className="chat-type" style={{ display: typing ? 'flex' : 'none' }}>
        <div className="tdots"><span></span><span></span><span></span></div><span>Sage is thinking…</span>
      </div>
      <div className="chat-in-row">
        <input
          type="text"
          placeholder="e.g. I want something dark and mysterious…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
        />
        <button className="chat-send" onClick={send}>Send ➤</button>
      </div>
    </div>
  );
}
