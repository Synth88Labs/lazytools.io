import SolverTool from '../chemistry/SolverTool';

export default function PotentialEnergyTool() {
  return (
    <SolverTool
      defaultTarget="PE"
      formula="Gravitational potential energy PE = m·g·h. g = 9.80665 m/s² on Earth (editable)."
      fields={[
        { key: 'm', label: 'Mass m', unit: 'kg', initial: '5' },
        { key: 'g', label: 'Gravity g', unit: 'm/s²', initial: '9.80665' },
        { key: 'h', label: 'Height h', unit: 'm', initial: '10' },
        { key: 'PE', label: 'Potential energy PE', unit: 'J' },
      ]}
      solve={(v, t) => {
        const { m, g, h, PE } = v;
        if (t === 'PE' && m != null && g != null && h != null) return { value: m * g * h, unit: 'J' };
        if (t === 'm' && PE != null && g && h && g * h !== 0) return { value: PE / (g * h), unit: 'kg' };
        if (t === 'h' && PE != null && m && g && m * g !== 0) return { value: PE / (m * g), unit: 'm' };
        if (t === 'g' && PE != null && m && h && m * h !== 0) return { value: PE / (m * h), unit: 'm/s²' };
        return null;
      }}
    />
  );
}
