import SolverTool from '../chemistry/SolverTool';

export default function KineticEnergyTool() {
  return (
    <SolverTool
      defaultTarget="KE"
      formula="Kinetic energy KE = ½·m·v². Rearranged, v = √(2·KE/m)."
      fields={[
        { key: 'm', label: 'Mass m', unit: 'kg', initial: '2' },
        { key: 'v', label: 'Speed v', unit: 'm/s', initial: '10' },
        { key: 'KE', label: 'Kinetic energy KE', unit: 'J' },
      ]}
      solve={(v, t) => {
        const { m, v: vel, KE } = v;
        if (t === 'KE' && m != null && vel != null) return { value: 0.5 * m * vel * vel, unit: 'J' };
        if (t === 'v' && KE != null && m && m > 0 && KE >= 0) return { value: Math.sqrt((2 * KE) / m), unit: 'm/s' };
        if (t === 'm' && KE != null && vel && vel !== 0) return { value: (2 * KE) / (vel * vel), unit: 'kg' };
        return null;
      }}
    />
  );
}
