import SolverTool from './SolverTool';

export default function NernstTool() {
  return (
    <SolverTool
      defaultTarget="E"
      formula="Nernst equation at 25 °C: E = E° − (0.0592/n)·log₁₀(Q). n = electrons transferred, Q = reaction quotient."
      fields={[
        { key: 'E0', label: 'Standard potential E°', unit: 'V', initial: '1.10' },
        { key: 'n', label: 'Electrons transferred (n)', unit: '', initial: '2' },
        { key: 'Q', label: 'Reaction quotient (Q)', unit: '', initial: '0.01' },
        { key: 'E', label: 'Cell potential E', unit: 'V' },
      ]}
      solve={(v, t) => {
        const { E0, n, Q, E } = v;
        if (t === 'E' && E0 != null && n && Q && n !== 0 && Q > 0) return { value: E0 - (0.0592 / n) * Math.log10(Q), unit: 'V' };
        if (t === 'E0' && E != null && n && Q && n !== 0 && Q > 0) return { value: E + (0.0592 / n) * Math.log10(Q), unit: 'V' };
        if (t === 'Q' && E != null && E0 != null && n) return { value: Math.pow(10, ((E0 - E) * n) / 0.0592), unit: '' };
        if (t === 'n' && E != null && E0 != null && Q && Q > 0 && E0 - E !== 0) return { value: (0.0592 * Math.log10(Q)) / (E0 - E), unit: '' };
        return null;
      }}
    />
  );
}
