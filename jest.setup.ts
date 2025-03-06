import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

// Assign TextEncoder and TextDecoder globally
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
