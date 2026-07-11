import SolverTool from './SolverTool';

const R = 8.314; // J/(mol·K)

export default function ArrheniusTool() {
  return (
    <SolverTool
      defaultTarget="Ea"
      formula="Two-point Arrhenius: ln(k₂/k₁) = −(Ea/R)·(1/T₂ − 1/T₁), R = 8.314 J/(mol·K). Temperatures in kelvin."
      fields={[
        { key: 'k1', label: 'Rate constant k₁', unit: '', initial: '1' },
        { key: 'T1', label: 'Temperature T₁', unit: 'K', initial: '300' },
        { key: 'k2', label: 'Rate constant k₂', unit: '', initial: '10' },
        { key: 'T2', label: 'Temperature T₂', unit: 'K', initial: '310' },
        { key: 'Ea', label: 'Activation energy Ea', unit: 'J/mol' },
      ]}
      solve={(v, t) => {
        const { k1, T1, k2, T2, Ea } = v;
        const invDiff = T1 && T2 ? 1 / T2 - 1 / T1 : NaN;
        if (t === 'Ea' && k1 && k2 && k1 > 0 && k2 > 0 && isFinite(invDiff) && invDiff !== 0)
          return { value: (-R * Math.log(k2 / k1)) / invDiff, unit: 'J/mol' };
        if (t === 'k2' && k1 && k1 > 0 && Ea != null && isFinite(invDiff))
          return { value: k1 * Math.exp((-Ea / R) * invDiff), unit: '' };
        if (t === 'k1' && k2 && k2 > 0 && Ea != null && isFinite(invDiff))
          return { value: k2 / Math.exp((-Ea / R) * invDiff), unit: '' };
        return null;
      }}
    />
  );
}
