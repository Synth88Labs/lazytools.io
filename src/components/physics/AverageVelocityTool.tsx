import SolverTool from '../chemistry/SolverTool';

export default function AverageVelocityTool() {
  return (
    <SolverTool
      defaultTarget="v"
      formula="Average velocity = displacement ÷ time (v = Δx/Δt). Average acceleration works the same way: a = Δv/Δt."
      fields={[
        { key: 'dx', label: 'Displacement Δx', unit: 'm', initial: '100' },
        { key: 'dt', label: 'Time interval Δt', unit: 's', initial: '20' },
        { key: 'v', label: 'Average velocity v', unit: 'm/s' },
      ]}
      solve={(vv, t) => {
        const { dx, dt, v } = vv;
        if (t === 'v' && dx != null && dt && dt !== 0) return { value: dx / dt, unit: 'm/s' };
        if (t === 'dx' && v != null && dt != null) return { value: v * dt, unit: 'm' };
        if (t === 'dt' && dx != null && v && v !== 0) return { value: dx / v, unit: 's' };
        return null;
      }}
    />
  );
}
