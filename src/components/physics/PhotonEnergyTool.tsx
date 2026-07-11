import SolverTool from '../chemistry/SolverTool';
import { H_PLANCK, C_LIGHT, JtoeV } from '../../lib/physics-constants';

export default function PhotonEnergyTool() {
  return (
    <SolverTool
      defaultTarget="E"
      formula="Photon energy E = h·f = h·c/λ, with h = 6.626×10⁻³⁴ J·s, c = 3×10⁸ m/s. Result also shown in eV."
      fields={[
        { key: 'lambda', label: 'Wavelength λ', unit: 'm', initial: '5e-7' },
        { key: 'f', label: 'Frequency f', unit: 'Hz' },
        { key: 'E', label: 'Photon energy E', unit: 'J' },
      ]}
      solve={(v, t) => {
        const { lambda, f, E } = v;
        if (t === 'E') {
          let energy: number | null = null;
          if (f != null) energy = H_PLANCK * f;
          else if (lambda && lambda > 0) energy = (H_PLANCK * C_LIGHT) / lambda;
          if (energy != null) return { value: energy, unit: `J  (${JtoeV(energy).toExponential(3)} eV)` };
        }
        if (t === 'f') { if (E != null) return { value: E / H_PLANCK, unit: 'Hz' }; if (lambda && lambda > 0) return { value: C_LIGHT / lambda, unit: 'Hz' }; }
        if (t === 'lambda') { if (E != null && E !== 0) return { value: (H_PLANCK * C_LIGHT) / E, unit: 'm' }; if (f && f !== 0) return { value: C_LIGHT / f, unit: 'm' }; }
        return null;
      }}
    />
  );
}
