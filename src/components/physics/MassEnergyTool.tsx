import SolverTool from '../chemistry/SolverTool';
import { C_LIGHT, JtoeV } from '../../lib/physics-constants';

export default function MassEnergyTool() {
  return (
    <SolverTool
      defaultTarget="E"
      formula="Mass–energy equivalence: E = m·c², with c = 299,792,458 m/s (exact). Energy also shown in eV."
      fields={[
        { key: 'm', label: 'Mass m', unit: 'kg', initial: '0.001' },
        { key: 'E', label: 'Energy E', unit: 'J' },
      ]}
      solve={(v, t) => {
        const { m, E } = v;
        if (t === 'E' && m != null) { const energy = m * C_LIGHT * C_LIGHT; return { value: energy, unit: `J  (${JtoeV(energy).toExponential(3)} eV)` }; }
        if (t === 'm' && E != null) return { value: E / (C_LIGHT * C_LIGHT), unit: 'kg' };
        return null;
      }}
    />
  );
}
