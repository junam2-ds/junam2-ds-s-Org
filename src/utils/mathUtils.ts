// High-precision math utility for probability distributions

// Log-gamma function to compute log(n!) without overflow for n up to 1000
function logGamma(x: number): number {
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  const g = 7;
  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  }
  x -= 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) {
    a += p[i] / (x + i + 1);
  }
  const t = x + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

// Log of combination nCk
function logCombination(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  if (k === 0 || k === n) return 0;
  return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
}

// Binomial probability PMF P(X = k)
export function binomialPMF(n: number, p: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  const logProb = logCombination(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
  return Math.exp(logProb);
}

// Binomial CDF P(X <= k)
export function binomialCDF(n: number, p: number, k: number): number {
  if (k < 0) return 0;
  if (k >= n) return 1;
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += binomialPMF(n, p, i);
  }
  return Math.min(1, Math.max(0, sum));
}

// Binomial probability P(X >= k)
export function binomialProbGte(n: number, p: number, k: number): number {
  if (k <= 0) return 1;
  if (k > n) return 0;
  return 1 - binomialCDF(n, p, k - 1);
}

// Error function erf(x) approximation (Abramowitz and Stegun)
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  // Constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);

  return sign * y;
}

// Standard normal PDF phi(z)
export function standardNormalPDF(z: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
}

// Standard normal CDF Phi(z) = P(Z <= z)
export function standardNormalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Standard Normal distribution Table Lookup: P(0 <= Z <= z)
export function zTableLookup(z: number): number {
  if (z < 0) return 0;
  return standardNormalCDF(z) - 0.5;
}

// General Normal PDF: N(mean, std)
export function normalPDF(x: number, mean: number, std: number): number {
  if (std <= 0) return 0;
  const z = (x - mean) / std;
  return standardNormalPDF(z) / std;
}

// General Normal CDF: P(X <= x) where X ~ N(mean, std^2)
export function normalCDF(x: number, mean: number, std: number): number {
  if (std <= 0) return x >= mean ? 1 : 0;
  const z = (x - mean) / std;
  return standardNormalCDF(z);
}

// Normal P(X >= k) with or without continuity correction
export function normalProbGte(k: number, mean: number, std: number, continuityCorrection = true): number {
  const adjustedX = continuityCorrection ? k - 0.5 : k;
  return 1 - normalCDF(adjustedX, mean, std);
}

// Quantile / Inverse CDF for Standard Normal (Acklam approximation)
export function standardNormalQuantile(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  // Coefficients in rational approximations
  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.383577518672690e2,
    -3.066479806614716e1,
    2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838e0,
    -2.549732539343734e0,
    4.374664141464968e0,
    2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number, r: number;

  if (p < pLow) {
    // Rational approximation for lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    // Rational approximation for upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}
