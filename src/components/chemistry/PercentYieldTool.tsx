import SolverTool from './SolverTool';

export default function PercentYieldTool() {
  return (
    <SolverTool
      formula="Percent yield = (actual yield ÷ theoretical yield) × 100."
      fields={[
        { key: 'actual', label: 'Actual yield', unit: 'g', initial: '8.2' },
        { key: 'theoretical', label: 'Theoretical yield', unit: 'g', initial: '10' },
        { key: 'percent', label: 'Percent yield', unit: '%' },
      ]}
      solve={(v, t) => {
        const { actual, theoretical, percent } = v;
        if (t === 'percent' && actual != null && theoretical && theoretical !== 0) return { value: (actual / theoretical) * 100, unit: '%' };
        if (t === 'actual' && percent != null && theoretical != null) return { value: (percent / 100) * theoretical, unit: 'g' };
        if (t === 'theoretical' && percent && actual != null && percent !== 0) return { value: actual / (percent / 100), unit: 'g' };
        return null;
      }}
    />
  );
}
