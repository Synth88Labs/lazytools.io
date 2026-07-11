import SolverTool from './SolverTool';

export default function GibbsFreeEnergyTool() {
  return (
    <SolverTool
      defaultTarget="dG"
      formula="ΔG = ΔH − TΔS. Enter ΔH in kJ/mol, ΔS in J/(mol·K), T in kelvin. ΔG < 0 ⇒ spontaneous."
      fields={[
        { key: 'dH', label: 'Enthalpy change ΔH', unit: 'kJ/mol', initial: '-100' },
        { key: 'T', label: 'Temperature T', unit: 'K', initial: '298' },
        { key: 'dS', label: 'Entropy change ΔS', unit: 'J/(mol·K)', initial: '-100' },
        { key: 'dG', label: 'Gibbs free energy ΔG', unit: 'kJ/mol' },
      ]}
      solve={(v, t) => {
        const { dH, T, dS, dG } = v;
        if (t === 'dG' && dH != null && T != null && dS != null) return { value: dH - (T * dS) / 1000, unit: 'kJ/mol' };
        if (t === 'dH' && dG != null && T != null && dS != null) return { value: dG + (T * dS) / 1000, unit: 'kJ/mol' };
        if (t === 'dS' && dH != null && dG != null && T && T !== 0) return { value: ((dH - dG) * 1000) / T, unit: 'J/(mol·K)' };
        if (t === 'T' && dH != null && dG != null && dS && dS !== 0) return { value: ((dH - dG) * 1000) / dS, unit: 'K' };
        return null;
      }}
    />
  );
}
