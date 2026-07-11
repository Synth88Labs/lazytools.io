import SolverTool from './SolverTool';

export default function FreezingPointTool() {
  return (
    <SolverTool
      defaultTarget="dT"
      formula="Freezing-point depression: ΔTf = i·Kf·m. Water Kf = 1.86 °C·kg/mol. i = van’t Hoff factor, m = molality."
      fields={[
        { key: 'i', label: 'van’t Hoff factor (i)', unit: '', initial: '1' },
        { key: 'Kf', label: 'Freezing constant (Kf)', unit: '°C·kg/mol', initial: '1.86' },
        { key: 'm', label: 'Molality (m)', unit: 'mol/kg', initial: '1' },
        { key: 'dT', label: 'Freezing-point drop ΔTf', unit: '°C' },
      ]}
      solve={(v, t) => {
        const { i, Kf, m, dT } = v;
        if (t === 'dT' && i != null && Kf != null && m != null) return { value: i * Kf * m, unit: '°C' };
        if (t === 'm' && dT != null && i && Kf && i * Kf !== 0) return { value: dT / (i * Kf), unit: 'mol/kg' };
        if (t === 'i' && dT != null && Kf && m && Kf * m !== 0) return { value: dT / (Kf * m), unit: '' };
        if (t === 'Kf' && dT != null && i && m && i * m !== 0) return { value: dT / (i * m), unit: '°C·kg/mol' };
        return null;
      }}
    />
  );
}
