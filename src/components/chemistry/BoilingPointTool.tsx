import SolverTool from './SolverTool';

export default function BoilingPointTool() {
  return (
    <SolverTool
      defaultTarget="dT"
      formula="Boiling-point elevation: ΔTb = i·Kb·m. Water Kb = 0.512 °C·kg/mol. i = van’t Hoff factor, m = molality."
      fields={[
        { key: 'i', label: 'van’t Hoff factor (i)', unit: '', initial: '1' },
        { key: 'Kb', label: 'Boiling constant (Kb)', unit: '°C·kg/mol', initial: '0.512' },
        { key: 'm', label: 'Molality (m)', unit: 'mol/kg', initial: '1' },
        { key: 'dT', label: 'Boiling-point rise ΔTb', unit: '°C' },
      ]}
      solve={(v, t) => {
        const { i, Kb, m, dT } = v;
        if (t === 'dT' && i != null && Kb != null && m != null) return { value: i * Kb * m, unit: '°C' };
        if (t === 'm' && dT != null && i && Kb && i * Kb !== 0) return { value: dT / (i * Kb), unit: 'mol/kg' };
        if (t === 'i' && dT != null && Kb && m && Kb * m !== 0) return { value: dT / (Kb * m), unit: '' };
        if (t === 'Kb' && dT != null && i && m && i * m !== 0) return { value: dT / (i * m), unit: '°C·kg/mol' };
        return null;
      }}
    />
  );
}
