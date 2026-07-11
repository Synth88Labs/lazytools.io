import SolverTool from './SolverTool';

export default function DensityTool() {
  return (
    <SolverTool
      formula="Density = mass ÷ volume (ρ = m/V)."
      fields={[
        { key: 'mass', label: 'Mass (m)', unit: 'g', initial: '10' },
        { key: 'volume', label: 'Volume (V)', unit: 'mL', initial: '12.7' },
        { key: 'density', label: 'Density (ρ)', unit: 'g/mL' },
      ]}
      solve={(v, t) => {
        const { mass, volume, density } = v;
        if (t === 'density' && mass != null && volume && volume !== 0) return { value: mass / volume, unit: 'g/mL' };
        if (t === 'mass' && density != null && volume != null) return { value: density * volume, unit: 'g' };
        if (t === 'volume' && mass != null && density && density !== 0) return { value: mass / density, unit: 'mL' };
        return null;
      }}
    />
  );
}
