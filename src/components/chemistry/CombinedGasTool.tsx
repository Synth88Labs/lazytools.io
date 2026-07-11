import SolverTool from './SolverTool';

export default function CombinedGasTool() {
  return (
    <SolverTool
      defaultTarget="V2"
      formula="Combined gas law: P₁V₁/T₁ = P₂V₂/T₂ — temperatures in kelvin. Covers Boyle’s, Charles’s and Gay-Lussac’s laws."
      fields={[
        { key: 'P1', label: 'Pressure P₁', unit: 'atm', initial: '1' },
        { key: 'V1', label: 'Volume V₁', unit: 'L', initial: '2' },
        { key: 'T1', label: 'Temp T₁', unit: 'K', initial: '273' },
        { key: 'P2', label: 'Pressure P₂', unit: 'atm', initial: '2' },
        { key: 'V2', label: 'Volume V₂', unit: 'L' },
        { key: 'T2', label: 'Temp T₂', unit: 'K', initial: '546' },
      ]}
      solve={(v, t) => {
        const { P1, V1, T1, P2, V2, T2 } = v;
        // k = P1 V1 / T1 = P2 V2 / T2
        if (t === 'P1' && V1 && T1 && P2 != null && V2 != null && T2) return { value: (P2 * V2 * T1) / (T2 * V1), unit: 'atm' };
        if (t === 'V1' && P1 && T1 && P2 != null && V2 != null && T2) return { value: (P2 * V2 * T1) / (T2 * P1), unit: 'L' };
        if (t === 'T1' && P1 != null && V1 != null && P2 && V2 && T2) return { value: (P1 * V1 * T2) / (P2 * V2), unit: 'K' };
        if (t === 'P2' && V2 && T2 && P1 != null && V1 != null && T1) return { value: (P1 * V1 * T2) / (T1 * V2), unit: 'atm' };
        if (t === 'V2' && P2 && T2 && P1 != null && V1 != null && T1) return { value: (P1 * V1 * T2) / (T1 * P2), unit: 'L' };
        if (t === 'T2' && P2 != null && V2 != null && P1 && V1 && T1) return { value: (P2 * V2 * T1) / (P1 * V1), unit: 'K' };
        return null;
      }}
    />
  );
}
