import SolverTool from './SolverTool';

export default function BeerLambertTool() {
  return (
    <SolverTool
      formula="Beer–Lambert law: A = ε·l·c (absorbance = molar absorptivity × path length × concentration)."
      fields={[
        { key: 'A', label: 'Absorbance (A)', unit: '', initial: '0.65' },
        { key: 'eps', label: 'Molar absorptivity (ε)', unit: 'M⁻¹cm⁻¹', initial: '13000' },
        { key: 'l', label: 'Path length (l)', unit: 'cm', initial: '1' },
        { key: 'c', label: 'Concentration (c)', unit: 'M' },
      ]}
      solve={(v, t) => {
        const { A, eps, l, c } = v;
        if (t === 'A' && eps != null && l != null && c != null) return { value: eps * l * c, unit: '' };
        if (t === 'eps' && A != null && l && c && l !== 0 && c !== 0) return { value: A / (l * c), unit: 'M⁻¹cm⁻¹' };
        if (t === 'l' && A != null && eps && c && eps !== 0 && c !== 0) return { value: A / (eps * c), unit: 'cm' };
        if (t === 'c' && A != null && eps && l && eps !== 0 && l !== 0) return { value: A / (eps * l), unit: 'M' };
        return null;
      }}
    />
  );
}
