import SolverTool from './SolverTool';

export default function HendersonTool() {
  return (
    <SolverTool
      formula="Henderson–Hasselbalch: pH = pKa + log₁₀([A⁻] / [HA]) — buffer pH from the conjugate base/acid ratio."
      fields={[
        { key: 'pKa', label: 'pKa', unit: '', initial: '4.76' },
        { key: 'base', label: 'Conjugate base [A⁻]', unit: 'M', initial: '0.1' },
        { key: 'acid', label: 'Weak acid [HA]', unit: 'M', initial: '0.1' },
        { key: 'pH', label: 'pH', unit: '' },
      ]}
      solve={(v, t) => {
        const { pKa, base, acid, pH } = v;
        if (t === 'pH' && pKa != null && base && acid && base > 0 && acid > 0) return { value: pKa + Math.log10(base / acid), unit: '' };
        if (t === 'pKa' && pH != null && base && acid && base > 0 && acid > 0) return { value: pH - Math.log10(base / acid), unit: '' };
        if (t === 'base' && pH != null && pKa != null && acid != null) return { value: acid * Math.pow(10, pH - pKa), unit: 'M' };
        if (t === 'acid' && pH != null && pKa != null && base != null) return { value: base / Math.pow(10, pH - pKa), unit: 'M' };
        return null;
      }}
    />
  );
}
