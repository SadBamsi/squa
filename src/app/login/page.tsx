import styles from "./login.module.css";
import LoginForm from "./components/loginForm";

export default function LoginPage() {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.glassCard}>
        <div className={styles.loginHeader}>
          <h1>Вход</h1>
          <p>С возвращением! Пожалуйста, введите данные для доступа.</p>
        </div>
        
        <LoginForm />
        
        <div className={styles.loginHint}>
          <p>Для проверки используйте:</p>
          <code>emilys / emilyspass</code>
        </div>
      </div>
    </div>
  );
}
