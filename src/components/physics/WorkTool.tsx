import SolverTool from '../chemistry/SolverTool';

export default function WorkTool() {
  return (
    <SolverTool
      defaultTarget="W"
      formula="Work W = F·d·cos θ, where θ is the angle between the force and the displacement. θ = 0 gives W = F·d."
      fields={[
        { key: 'F', label: 'Force F', unit: 'N', initial: '50' },
        { key: 'd', label: 'Distance d', unit: 'm', initial: '10' },
        { key: 'theta', label: 'Angle θ', unit: '°', initial: '0' },
        { key: 'W', label: 'Work W', unit: 'J' },
      ]}
      solve={(v, t) => {
        const { F, d, theta, W } = v;
        const c = theta != null ? Math.cos((theta * Math.PI) / 180) : 1;
        if (t === 'W' && F != null && d != null && theta != null) return { value: F * d * c, unit: 'J' };
        if (t === 'F' && W != null && d && theta != null && d * c !== 0) return { value: W / (d * c), unit: 'N' };
        if (t === 'd' && W != null && F && theta != null && F * c !== 0) return { value: W / (F * c), unit: 'm' };
        return null;
      }}
    />
  );
}
