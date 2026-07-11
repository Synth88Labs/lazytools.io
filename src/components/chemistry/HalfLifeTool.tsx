import SolverTool from './SolverTool';

export default function HalfLifeTool() {
  return (
    <SolverTool
      defaultTarget="t"
      formula="Radioactive decay: N = N₀ · (½)^(t / t½). Use the same time unit for t and the half-life."
      fields={[
        { key: 'N0', label: 'Initial amount (N₀)', unit: '', initial: '100' },
        { key: 'N', label: 'Remaining amount (N)', unit: '', initial: '25' },
        { key: 't', label: 'Elapsed time (t)', unit: 'time', initial: '' },
        { key: 'thalf', label: 'Half-life (t½)', unit: 'time', initial: '5730' },
      ]}
      solve={(v, t) => {
        const { N0, N, t: time, thalf } = v;
        if (t === 'N' && N0 != null && time != null && thalf && thalf !== 0) return { value: N0 * Math.pow(0.5, time / thalf), unit: '' };
        if (t === 'N0' && N != null && time != null && thalf && thalf !== 0) return { value: N * Math.pow(2, time / thalf), unit: '' };
        if (t === 't' && N0 && N && thalf != null && N0 > 0 && N > 0) return { value: thalf * Math.log2(N0 / N), unit: 'time' };
        if (t === 'thalf' && N0 && N && time != null && N0 > 0 && N > 0 && Math.log2(N0 / N) !== 0) return { value: time / Math.log2(N0 / N), unit: 'time' };
        return null;
      }}
    />
  );
}
