import SolverTool from '../chemistry/SolverTool';

export default function FrictionTool() {
  return (
    <SolverTool
      defaultTarget="f"
      formula="Friction force f = μ·N. On a flat surface N = mg; on an incline N = mg·cosθ. Supply your own μ (static or kinetic)."
      fields={[
        { key: 'mu', label: 'Coefficient μ', unit: '', initial: '0.3' },
        { key: 'N', label: 'Normal force N', unit: 'N', initial: '100' },
        { key: 'f', label: 'Friction force f', unit: 'N' },
      ]}
      solve={(v, t) => {
        const { mu, N, f } = v;
        if (t === 'f' && mu != null && N != null) return { value: mu * N, unit: 'N' };
        if (t === 'mu' && f != null && N && N !== 0) return { value: f / N, unit: '' };
        if (t === 'N' && f != null && mu && mu !== 0) return { value: f / mu, unit: 'N' };
        return null;
      }}
    />
  );
}
