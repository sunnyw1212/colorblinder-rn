export const generateRGB = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return {
    r,
    g,
    b
  };
};

// creates a random number between 10 and 20 and adds it to the original RGB value passed as a prop, then returns the new colors.
export const mutateRGB = ({ r, g, b }) => {
  const newR = r + Math.floor(Math.random() * 20) + 10;
  const newG = g + Math.floor(Math.random() * 20) + 10;
  const newB = b + Math.floor(Math.random() * 20) + 10;

  return { r: newR, g: newG, b: newB };
};
