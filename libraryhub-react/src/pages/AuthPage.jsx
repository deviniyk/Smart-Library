import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const STRENGTH_LEVELS = [
  { w: '20%', c: '#C0392B', l: 'Weak' },
  { w: '40%', c: '#E67E22', l: 'Fair' },
  { w: '60%', c: '#F1C40F', l: 'Good' },
  { w: '80%', c: '#27AE60', l: 'Strong' },
  { w: '100%', c: '#1ABC9C', l: 'Very Strong' },
];

function strengthOf(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return STRENGTH_LEVELS[Math.min(score, 4)];
}

export default function AuthPage() {
  const { loginUser, goPage } = useApp();
  const [tab, setTab] = useState('login');

  // login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginPwVisible, setLoginPwVisible] = useState(false);
  const [loginErrs, setLoginErrs] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(null);

  // signup state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const [terms, setTerms] = useState(false);
  const [signupErrs, setSignupErrs] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  function doLogin() {
    const errs = {};
    if (!loginEmail.trim() || !loginEmail.includes('@')) errs.email = true;
    if (loginPw.length < 6) errs.pw = true;
    setLoginErrs(errs);
    if (Object.keys(errs).length) return;
    const uname = loginEmail.split('@')[0];
    loginUser(uname, loginEmail.trim());
    setLoginSuccess(`Welcome back, ${uname}! Taking you to your stories…`);
    setTimeout(() => { setLoginSuccess(null); goPage('home'); }, 2000);
  }

  function doSignup() {
    const errs = {};
    if (!name.trim()) errs.name = true;
    if (!email.trim() || !email.includes('@')) errs.email = true;
    if (pw.length < 6) errs.pw = true;
    if (pw !== pw2) errs.pw2 = true;
    if (!terms) errs.terms = true;
    setSignupErrs(errs);
    if (Object.keys(errs).length) return;
    loginUser(name.trim(), email.trim());
    setSignupSuccess(true);
    setTimeout(() => { setSignupSuccess(false); goPage('home'); }, 2200);
  }

  function socialLogin(provider) {
    const fakeName = provider === 'Google' ? 'Reader' : 'StoryFan';
    loginUser(fakeName, `${fakeName.toLowerCase()}@${provider.toLowerCase()}.com`);
    alert(`Signed in with ${provider}! Welcome to LibraryHub.`);
    goPage('home');
  }

  const strength = pw ? strengthOf(pw) : null;

  return (
    <div id="page-auth" className="page active">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-mark">📖</div>
          <h2><em>Library</em>Hub</h2>
          <p>Your personal portal into the university library</p>
        </div>
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Create Account</button>
          </div>

          {/* LOGIN PANEL */}
          <div className={`auth-panel${tab === 'login' ? ' active' : ''}`}>
            <div className="auth-form-row">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <input
                  type="email" placeholder="your@email.com" value={loginEmail}
                  className={loginErrs.email ? 'input-err' : ''}
                  onChange={e => { setLoginEmail(e.target.value); setLoginErrs(p => ({ ...p, email: false })); }}
                />
                <span className="auth-input-icon">✉️</span>
              </div>
              <div className={`field-error${loginErrs.email ? ' show' : ''}`}>Please enter a valid email address.</div>
            </div>
            <div className="auth-form-row">
              <label>Password</label>
              <div className="auth-input-wrap">
                <input
                  type={loginPwVisible ? 'text' : 'password'} placeholder="Your password" value={loginPw}
                  className={loginErrs.pw ? 'input-err' : ''}
                  onChange={e => { setLoginPw(e.target.value); setLoginErrs(p => ({ ...p, pw: false })); }}
                />
                <span className="auth-input-icon">🔒</span>
                <button className="show-pw" type="button" onClick={() => setLoginPwVisible(v => !v)}>{loginPwVisible ? '🙈' : '👁'}</button>
              </div>
              <div className={`field-error${loginErrs.pw ? ' show' : ''}`}>Password must be at least 6 characters.</div>
            </div>
            <div className="auth-options">
              <label className="remember-wrap">
                <input type="checkbox" /><span>Remember me</span>
              </label>
              <a className="forgot-link" onClick={() => alert('Password reset link would be sent to your email in a real application.')}>Forgot password?</a>
            </div>
            <button className="auth-btn" onClick={doLogin}>Sign In to LibraryHub</button>
            <div className="auth-divider"><span>or continue with</span></div>
            <div className="social-btns">
              <button className="social-btn" onClick={() => socialLogin('Google')}>🌐 Google</button>
              <button className="social-btn" onClick={() => socialLogin('Facebook')}>📘 Facebook</button>
            </div>
            <div className="auth-footer-note">Don't have an account? <a onClick={() => setTab('signup')}>Create one free →</a></div>
            <div className="auth-success" style={{ display: loginSuccess ? 'block' : 'none' }}>
              <span className="success-icon">🎉</span>
              <h3>Welcome Back!</h3>
              <p>{loginSuccess}</p>
            </div>
          </div>

          {/* SIGNUP PANEL */}
          <div className={`auth-panel${tab === 'signup' ? ' active' : ''}`}>
            <div className="auth-form-row">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <input
                  type="text" placeholder="Your full name" value={name}
                  className={signupErrs.name ? 'input-err' : ''}
                  onChange={e => { setName(e.target.value); setSignupErrs(p => ({ ...p, name: false })); }}
                />
                <span className="auth-input-icon">👤</span>
              </div>
              <div className={`field-error${signupErrs.name ? ' show' : ''}`}>Please enter your name.</div>
            </div>
            <div className="auth-form-row">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <input
                  type="email" placeholder="your@email.com" value={email}
                  className={signupErrs.email ? 'input-err' : ''}
                  onChange={e => { setEmail(e.target.value); setSignupErrs(p => ({ ...p, email: false })); }}
                />
                <span className="auth-input-icon">✉️</span>
              </div>
              <div className={`field-error${signupErrs.email ? ' show' : ''}`}>Please enter a valid email address.</div>
            </div>
            <div className="auth-form-row">
              <label>Password</label>
              <div className="auth-input-wrap">
                <input
                  type={pwVisible ? 'text' : 'password'} placeholder="Create a strong password" value={pw}
                  className={signupErrs.pw ? 'input-err' : ''}
                  onChange={e => { setPw(e.target.value); setSignupErrs(p => ({ ...p, pw: false })); }}
                />
                <span className="auth-input-icon">🔒</span>
                <button className="show-pw" type="button" onClick={() => setPwVisible(v => !v)}>{pwVisible ? '🙈' : '👁'}</button>
              </div>
              <div className="pw-strength" style={{ display: pw ? 'block' : 'none' }}>
                <div className="pw-strength-bar"><div className="pw-strength-fill" style={{ width: strength?.w, background: strength?.c }}></div></div>
                <div className="pw-strength-label" style={{ color: strength?.c }}>{strength?.l}</div>
              </div>
              <div className={`field-error${signupErrs.pw ? ' show' : ''}`}>Password must be at least 6 characters.</div>
            </div>
            <div className="auth-form-row">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <input
                  type="password" placeholder="Repeat your password" value={pw2}
                  className={signupErrs.pw2 ? 'input-err' : ''}
                  onChange={e => { setPw2(e.target.value); setSignupErrs(p => ({ ...p, pw2: false })); }}
                />
                <span className="auth-input-icon">🔑</span>
              </div>
              <div className={`field-error${signupErrs.pw2 ? ' show' : ''}`}>Passwords do not match.</div>
            </div>
            <label className="terms-row">
              <input type="checkbox" checked={terms} onChange={e => { setTerms(e.target.checked); setSignupErrs(p => ({ ...p, terms: false })); }} />
              <span>I agree to LibraryHub's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
            <div className={`field-error${signupErrs.terms ? ' show' : ''}`}>You must agree to the terms to continue.</div>
            <button className="auth-btn" onClick={doSignup}>Create My Account</button>
            <div className="auth-divider"><span>or sign up with</span></div>
            <div className="social-btns">
              <button className="social-btn" onClick={() => socialLogin('Google')}>🌐 Google</button>
              <button className="social-btn" onClick={() => socialLogin('Facebook')}>📘 Facebook</button>
            </div>
            <div className="auth-footer-note">Already have an account? <a onClick={() => setTab('login')}>Sign in →</a></div>
            <div className="auth-success" style={{ display: signupSuccess ? 'block' : 'none' }}>
              <span className="success-icon">✨</span>
              <h3>Account Created!</h3>
              <p>Welcome to LibraryHub. Your reading adventure begins now — taking you to the library…</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
