import SolverTool from '../chemistry/SolverTool';

export default function MomentumTool() {
  return (
    <SolverTool
      defaultTarget="p"
      formula="Momentum p = m·v. Impulse J = F·Δt equals the change in momentum (J = Δp)."
      fields={[
        { key: 'm', label: 'Mass m', unit: 'kg', initial: '2' },
        { key: 'v', label: 'Velocity v', unit: 'm/s', initial: '15' },
        { key: 'p', label: 'Momentum p', unit: 'kg·m/s' },
      ]}
      solve={(v, t) => {
        const { m, v: vel, p } = v;
        if (t === 'p' && m != null && vel != null) return { value: m * vel, unit: 'kg·m/s' };
        if (t === 'm' && p != null && vel && vel !== 0) return { value: p / vel, unit: 'kg' };
        if (t === 'v' && p != null && m && m !== 0) return { value: p / m, unit: 'm/s' };
        return null;
      }}
    />
  );
}
