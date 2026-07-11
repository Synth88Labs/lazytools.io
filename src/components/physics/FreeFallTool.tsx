import SolverTool from '../chemistry/SolverTool';

export default function FreeFallTool() {
  return (
    <SolverTool
      defaultTarget="v"
      formula="Free fall from rest: v = gt, h = ½gt², v = √(2gh). g = 9.80665 m/s² on Earth (editable)."
      fields={[
        { key: 'g', label: 'Gravity g', unit: 'm/s²', initial: '9.80665' },
        { key: 'h', label: 'Drop height h', unit: 'm', initial: '45' },
        { key: 't', label: 'Fall time t', unit: 's' },
        { key: 'v', label: 'Impact speed v', unit: 'm/s' },
      ]}
      solve={(vals, t) => {
        const { g, h, t: tt, v } = vals;
        if (!g || g <= 0) return null;
        if (t === 'v') { if (tt != null) return { value: g * tt, unit: 'm/s' }; if (h != null && h >= 0) return { value: Math.sqrt(2 * g * h), unit: 'm/s' }; }
        if (t === 'h') { if (tt != null) return { value: 0.5 * g * tt * tt, unit: 'm' }; if (v != null) return { value: (v * v) / (2 * g), unit: 'm' }; }
        if (t === 't') { if (v != null) return { value: v / g, unit: 's' }; if (h != null && h >= 0) return { value: Math.sqrt((2 * h) / g), unit: 's' }; }
        return null;
      }}
    />
  );
}
