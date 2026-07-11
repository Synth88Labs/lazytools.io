import SolverTool from './SolverTool';

export default function DilutionTool() {
  return (
    <SolverTool
      defaultTarget="V1"
      formula="C₁V₁ = C₂V₂ — stock concentration × stock volume = final concentration × final volume."
      fields={[
        { key: 'C1', label: 'Stock conc. (C₁)', unit: 'M', initial: '2' },
        { key: 'V1', label: 'Stock volume (V₁)', unit: 'mL' },
        { key: 'C2', label: 'Final conc. (C₂)', unit: 'M', initial: '0.5' },
        { key: 'V2', label: 'Final volume (V₂)', unit: 'mL', initial: '100' },
      ]}
      solve={(v, t) => {
        const { C1, V1, C2, V2 } = v;
        if (t === 'C1' && V1 && C2 != null && V2 != null && V1 !== 0) return { value: (C2 * V2) / V1, unit: 'M' };
        if (t === 'V1' && C1 && C2 != null && V2 != null && C1 !== 0) return { value: (C2 * V2) / C1, unit: 'mL' };
        if (t === 'C2' && V2 && C1 != null && V1 != null && V2 !== 0) return { value: (C1 * V1) / V2, unit: 'M' };
        if (t === 'V2' && C2 && C1 != null && V1 != null && C2 !== 0) return { value: (C1 * V1) / C2, unit: 'mL' };
        return null;
      }}
    />
  );
}
