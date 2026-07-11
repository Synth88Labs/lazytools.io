import SolverTool from '../chemistry/SolverTool';

export default function ThermalExpansionTool() {
  return (
    <SolverTool
      defaultTarget="dL"
      formula="Linear thermal expansion: ΔL = α·L₀·ΔT (α = coefficient, L₀ = original length, ΔT = temperature change). For area use 2α, for volume 3α."
      fields={[
        { key: 'alpha', label: 'Coefficient α', unit: '1/°C', initial: '0.000012' },
        { key: 'L0', label: 'Original length L₀', unit: 'm', initial: '10' },
        { key: 'dT', label: 'Temperature change ΔT', unit: '°C', initial: '50' },
        { key: 'dL', label: 'Expansion ΔL', unit: 'm' },
      ]}
      solve={(v, t) => {
        const { alpha, L0, dT, dL } = v;
        if (t === 'dL' && alpha != null && L0 != null && dT != null) return { value: alpha * L0 * dT, unit: 'm' };
        if (t === 'alpha' && dL != null && L0 && dT && L0 * dT !== 0) return { value: dL / (L0 * dT), unit: '1/°C' };
        if (t === 'L0' && dL != null && alpha && dT && alpha * dT !== 0) return { value: dL / (alpha * dT), unit: 'm' };
        if (t === 'dT' && dL != null && alpha && L0 && alpha * L0 !== 0) return { value: dL / (alpha * L0), unit: '°C' };
        return null;
      }}
    />
  );
}
