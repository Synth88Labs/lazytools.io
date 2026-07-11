import SolverTool from '../chemistry/SolverTool';

export default function WavelengthTool() {
  return (
    <SolverTool
      defaultTarget="lambda"
      formula="Wave equation: v = f·λ (speed = frequency × wavelength). For light, v = c = 3×10⁸ m/s; period T = 1/f."
      fields={[
        { key: 'v', label: 'Wave speed v', unit: 'm/s', initial: '340' },
        { key: 'f', label: 'Frequency f', unit: 'Hz', initial: '170' },
        { key: 'lambda', label: 'Wavelength λ', unit: 'm' },
      ]}
      solve={(v, t) => {
        const { v: speed, f, lambda } = v;
        if (t === 'lambda' && speed != null && f && f !== 0) return { value: speed / f, unit: 'm' };
        if (t === 'v' && f != null && lambda != null) return { value: f * lambda, unit: 'm/s' };
        if (t === 'f' && speed != null && lambda && lambda !== 0) return { value: speed / lambda, unit: 'Hz' };
        return null;
      }}
    />
  );
}
