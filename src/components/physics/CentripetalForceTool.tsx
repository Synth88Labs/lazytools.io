import SolverTool from '../chemistry/SolverTool';

export default function CentripetalForceTool() {
  return (
    <SolverTool
      defaultTarget="F"
      formula="Centripetal force F = m·v²/r; centripetal acceleration a = v²/r points toward the centre."
      fields={[
        { key: 'm', label: 'Mass m', unit: 'kg', initial: '2' },
        { key: 'v', label: 'Speed v', unit: 'm/s', initial: '10' },
        { key: 'r', label: 'Radius r', unit: 'm', initial: '5' },
        { key: 'F', label: 'Centripetal force F', unit: 'N' },
      ]}
      solve={(v, t) => {
        const { m, v: vel, r, F } = v;
        if (t === 'F' && m != null && vel != null && r && r !== 0) return { value: (m * vel * vel) / r, unit: 'N' };
        if (t === 'm' && F != null && vel && r && vel !== 0) return { value: (F * r) / (vel * vel), unit: 'kg' };
        if (t === 'v' && F != null && m && r && m > 0 && (F * r) / m >= 0) return { value: Math.sqrt((F * r) / m), unit: 'm/s' };
        if (t === 'r' && F != null && m && vel && F !== 0) return { value: (m * vel * vel) / F, unit: 'm' };
        return null;
      }}
    />
  );
}
