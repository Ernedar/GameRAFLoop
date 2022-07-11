export function gcdOfTwo(x: number, y: number) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    let divider = y;
    y = x % y;
    x = divider;
  }
  return x;
}

export function lcmOfTwo(x: number, y: number) {
  return (x * y) / gcdOfTwo(x, y);
}

export function loopIntervalLength(array: number[]) {
  let currentLCM = array[0];
  let resultLCM = 0;

  array.map((arrayNumber, i) => {
    resultLCM = lcmOfTwo(currentLCM, array[i]);
    currentLCM = resultLCM;
    return resultLCM;
  });

  return resultLCM;
}
