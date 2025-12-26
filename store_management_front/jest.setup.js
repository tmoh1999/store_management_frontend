import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

// Polyfill globals
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
