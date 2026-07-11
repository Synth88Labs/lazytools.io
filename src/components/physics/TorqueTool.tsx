import SolverTool from '../chemistry/SolverTool';

export default function TorqueTool() {
  return (
    <SolverTool
      defaultTarget="tau"
      formula="Torque τ = r·F·sin θ, where r is the lever arm, F the force and θ the angle between them. θ = 90° gives maximum torque."
      fields={[
        { key: 'r', label: 'Lever arm r', unit: 'm', initial: '0.5' },
        { key: 'F', label: 'Force F', unit: 'N', initial: '40' },
        { key: 'theta', label: 'Angle θ', unit: '°', initial: '90' },
        { key: 'tau', label: 'Torque τ', unit: 'N·m' },
      ]}
      solve={(v, t) => {
        const { r, F, theta, tau } = v;
        const s = theta != null ? Math.sin((theta * Math.PI) / 180) : 1;
        if (t === 'tau' && r != null && F != null && theta != null) return { value: r * F * s, unit: 'N·m' };
        if (t === 'r' && tau != null && F && theta != null && F * s !== 0) return { value: tau / (F * s), unit: 'm' };
        if (t === 'F' && tau != null && r && theta != null && r * s !== 0) return { value: tau / (r * s), unit: 'N' };
        if (t === 'theta' && tau != null && r && F && r * F !== 0) { const x = tau / (r * F); if (x >= -1 && x <= 1) return { value: (Math.asin(x) * 180) / Math.PI, unit: '°' }; }
        return null;
      }}
    />
  );
}
