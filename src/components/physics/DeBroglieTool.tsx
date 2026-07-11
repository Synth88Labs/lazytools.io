import SolverTool from '../chemistry/SolverTool';
import { H_PLANCK, M_ELECTRON, M_PROTON } from '../../lib/physics-constants';

export default function DeBroglieTool() {
  return (
    <SolverTool
      defaultTarget="lambda"
      formula={`de Broglie wavelength: λ = h/(m·v), with h = 6.626×10⁻³⁴ J·s. Electron mass ≈ ${M_ELECTRON.toExponential(2)} kg, proton ≈ ${M_PROTON.toExponential(2)} kg.`}
      fields={[
        { key: 'm', label: 'Mass m', unit: 'kg', initial: '9.109e-31', placeholder: 'e.g. 9.109e-31 (electron)' },
        { key: 'v', label: 'Speed v', unit: 'm/s', initial: '1e6' },
        { key: 'lambda', label: 'Wavelength λ', unit: 'm' },
      ]}
      solve={(vv, t) => {
        const { m, v, lambda } = vv;
        if (t === 'lambda' && m && v && m !== 0 && v !== 0) return { value: H_PLANCK / (m * v), unit: 'm' };
        if (t === 'm' && lambda && v && lambda !== 0 && v !== 0) return { value: H_PLANCK / (lambda * v), unit: 'kg' };
        if (t === 'v' && lambda && m && lambda !== 0 && m !== 0) return { value: H_PLANCK / (lambda * m), unit: 'm/s' };
        return null;
      }}
    />
  );
}
