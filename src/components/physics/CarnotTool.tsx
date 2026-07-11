import SolverTool from '../chemistry/SolverTool';

export default function CarnotTool() {
  return (
    <SolverTool
      defaultTarget="eff"
      formula="Carnot (maximum) efficiency: η = 1 − T_cold/T_hot, with temperatures in kelvin. Real engines fall below this limit."
      fields={[
        { key: 'Tc', label: 'Cold reservoir T_c', unit: 'K', initial: '300' },
        { key: 'Th', label: 'Hot reservoir T_h', unit: 'K', initial: '600' },
        { key: 'eff', label: 'Efficiency η', unit: '(0–1)' },
      ]}
      solve={(v, t) => {
        const { Tc, Th, eff } = v;
        if (t === 'eff' && Tc != null && Th && Th !== 0) { const e = 1 - Tc / Th; return { value: e, unit: `  (${(e * 100).toFixed(2)}%)` }; }
        if (t === 'Tc' && eff != null && Th != null) return { value: Th * (1 - eff), unit: 'K' };
        if (t === 'Th' && eff != null && Tc != null && eff !== 1) return { value: Tc / (1 - eff), unit: 'K' };
        return null;
      }}
    />
  );
}
