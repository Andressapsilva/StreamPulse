import { useState, type FormEvent } from 'react';
import { users } from '../data/users';

interface LoginPageProps {
  error: string;
  onLogin: (email: string, password: string) => void;
}

export function LoginPage({ error, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onLogin(email.trim(), password);
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <span className="brand__logo" aria-hidden="true">▶</span>
          <h1>StreamPulse</h1>
        </div>
        <p className="login-eyebrow">LABORATÓRIO PUB/SUB</p>
        <h2>Entre na plataforma</h2>
        <p className="login-copy">Acesse como espectador ou criador para explorar o fluxo de mensagens.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@streampulse.com"
            />
          </label>
          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
            />
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit">Entrar <span aria-hidden="true">→</span></button>
        </form>

        <div className="demo-access">
          <div className="demo-access__heading">
            <span>ACESSO DE DEMONSTRAÇÃO</span>
            <code>senha: 123456</code>
          </div>
          <div className="demo-access__users">
            {users.map((user) => (
              <button
                type="button"
                key={user.id}
                onClick={() => setEmail(user.email)}
                aria-label={`Usar conta de ${user.name}`}
              >
                <span>{user.name}</span>
                <small>{user.role === 'subscriber' ? 'Espectadora' : 'Criador'}</small>
              </button>
            ))}
          </div>
        </div>
      </section>
      <div className="login-side-note" aria-hidden="true">
        <span>01 / PUBLISH</span>
        <span className="login-side-note__line" />
        <span>02 / BROKER</span>
        <span className="login-side-note__line" />
        <span>03 / SUBSCRIBE</span>
      </div>
    </main>
  );
}
