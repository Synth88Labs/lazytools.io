import SolverTool from '../chemistry/SolverTool';

export default function NewtonsSecondLawTool() {
  return (
    <SolverTool
      defaultTarget="F"
      formula="Newton’s second law: F = m·a (force = mass × acceleration). For weight, use a = g."
      fields={[
        { key: 'm', label: 'Mass m', unit: 'kg', initial: '10' },
        { key: 'a', label: 'Acceleration a', unit: 'm/s²', initial: '9.8' },
        { key: 'F', label: 'Force F', unit: 'N' },
      ]}
      solve={(v, t) => {
        const { m, a, F } = v;
        if (t === 'F' && m != null && a != null) return { value: m * a, unit: 'N' };
        if (t === 'm' && F != null && a && a !== 0) return { value: F / a, unit: 'kg' };
        if (t === 'a' && F != null && m && m !== 0) return { value: F / m, unit: 'm/s²' };
        return null;
      }}
    />
  );
}
