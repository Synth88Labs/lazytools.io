import SolverTool from '../chemistry/SolverTool';

export default function HookesLawTool() {
  return (
    <SolverTool
      defaultTarget="F"
      formula="Hooke’s law: F = k·x (restoring force = spring constant × extension). Elastic PE = ½·k·x²."
      fields={[
        { key: 'k', label: 'Spring constant k', unit: 'N/m', initial: '200' },
        { key: 'x', label: 'Extension x', unit: 'm', initial: '0.05' },
        { key: 'F', label: 'Force F', unit: 'N' },
      ]}
      solve={(v, t) => {
        const { k, x, F } = v;
        if (t === 'F' && k != null && x != null) return { value: k * x, unit: 'N' };
        if (t === 'k' && F != null && x && x !== 0) return { value: F / x, unit: 'N/m' };
        if (t === 'x' && F != null && k && k !== 0) return { value: F / k, unit: 'm' };
        return null;
      }}
    />
  );
}
