import { Container } from '../../../../layouts/container/container';
import { AuthFormPanel } from './components/auth-form-panel/auth-form-panel';
import { AuthVisualPanel } from './components/auth-visual-panel/auth-visual-panel';

export function AuthContentSection() {
  return (
    <Container as="section">
      <div className="bento-card grid min-h-[600px] grid-cols-[1.08fr_0.92fr] max-[850px]:grid-cols-1 overflow-hidden rounded-3xl border border-border-gold shadow-2xl">
        <AuthFormPanel />
        <AuthVisualPanel />
      </div>
    </Container>
  );
}

export default AuthContentSection;
