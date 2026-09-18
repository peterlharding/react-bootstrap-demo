import '@testing-library/jest-dom/vitest';

// jsdom has no canvas. react-color draws its checkerboard with one and copes with a null
// context, but jsdom logs "Not implemented" on every call, so return null quietly.
HTMLCanvasElement.prototype.getContext = () => null;
