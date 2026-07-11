import SolverTool from './SolverTool';

export default function PpmTool() {
  return (
    <SolverTool
      defaultTarget="ppm"
      formula="ppm = (mass of solute ÷ mass of solution) × 10⁶. Use the same mass unit for both. For dilute water, 1 ppm ≈ 1 mg/L."
      fields={[
        { key: 'solute', label: 'Mass of solute', unit: 'g', initial: '0.005' },
        { key: 'solution', label: 'Mass of solution', unit: 'g', initial: '1000' },
        { key: 'ppm', label: 'Concentration', unit: 'ppm' },
      ]}
      solve={(v, t) => {
        const { solute, solution, ppm } = v;
        if (t === 'ppm' && solute != null && solution && solution !== 0) return { value: (solute / solution) * 1e6, unit: 'ppm' };
        if (t === 'solute' && ppm != null && solution != null) return { value: (ppm / 1e6) * solution, unit: 'g' };
        if (t === 'solution' && ppm && solute != null && ppm !== 0) return { value: solute / (ppm / 1e6), unit: 'g' };
        return null;
      }}
    />
  );
}
