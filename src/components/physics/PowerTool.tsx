import SolverTool from '../chemistry/SolverTool';

export default function PowerTool() {
  return (
    <SolverTool
      defaultTarget="P"
      formula="Power P = W / t (work ÷ time). Also P = F·v (force × velocity). 1 watt = 1 J/s."
      fields={[
        { key: 'W', label: 'Work / energy W', unit: 'J', initial: '1000' },
        { key: 't', label: 'Time t', unit: 's', initial: '20' },
        { key: 'P', label: 'Power P', unit: 'W' },
      ]}
      solve={(v, t) => {
        const { W, t: time, P } = v;
        if (t === 'P' && W != null && time && time !== 0) return { value: W / time, unit: 'W' };
        if (t === 'W' && P != null && time != null) return { value: P * time, unit: 'J' };
        if (t === 't' && W != null && P && P !== 0) return { value: W / P, unit: 's' };
        return null;
      }}
    />
  );
}
