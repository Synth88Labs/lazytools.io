import SolverTool from '../chemistry/SolverTool';
import { G_GRAV } from '../../lib/physics-constants';

export default function GravitationTool() {
  return (
    <SolverTool
      defaultTarget="F"
      formula={`Newton’s law of gravitation: F = G·m₁·m₂/r², with G = 6.6743×10⁻¹¹ N·m²/kg².`}
      fields={[
        { key: 'm1', label: 'Mass 1 (m₁)', unit: 'kg', initial: '5.972e24' },
        { key: 'm2', label: 'Mass 2 (m₂)', unit: 'kg', initial: '7.348e22' },
        { key: 'r', label: 'Distance r', unit: 'm', initial: '3.844e8' },
        { key: 'F', label: 'Gravitational force F', unit: 'N' },
      ]}
      solve={(v, t) => {
        const { m1, m2, r, F } = v;
        if (t === 'F' && m1 != null && m2 != null && r && r !== 0) return { value: (G_GRAV * m1 * m2) / (r * r), unit: 'N' };
        if (t === 'm1' && F != null && m2 && r && G_GRAV * m2 !== 0) return { value: (F * r * r) / (G_GRAV * m2), unit: 'kg' };
        if (t === 'm2' && F != null && m1 && r && G_GRAV * m1 !== 0) return { value: (F * r * r) / (G_GRAV * m1), unit: 'kg' };
        if (t === 'r' && F != null && m1 && m2 && F > 0 && (G_GRAV * m1 * m2) / F >= 0) return { value: Math.sqrt((G_GRAV * m1 * m2) / F), unit: 'm' };
        return null;
      }}
    />
  );
}
