/**
 * Deterministic Input Hashing Utility
 * 
 * Generates consistent SHA-256 hashes for cache lookups.
 * CRITICAL: Keys are sorted alphabetically to ensure { a: 1, b: 2 } === { b: 2, a: 1 }
 */

/**
 * Recursively sorts object keys alphabetically for deterministic serialization.
 * Handles nested objects and arrays.
 */
function sortObjectKeys(obj: unknown): unknown {
  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays - sort each element recursively
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  // Handle objects - sort keys alphabetically
  if (typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    
    return sorted;
  }

  // Primitives (string, number, boolean) - return as-is
  return obj;
}

/**
 * Generates a deterministic SHA-256 hash from user input parameters.
 * 
 * @param params - The user input object (goals, duration, equipment, days)
 * @returns A hex-encoded SHA-256 hash string
 * 
 * @example
 * // These two calls produce the SAME hash:
 * generateInputHash({ goals: ["hypertrophy"], days: "4" })
 * generateInputHash({ days: "4", goals: ["hypertrophy"] })
 */
export async function generateInputHash(params: Record<string, unknown>): Promise<string> {
  // Step 1: Sort keys recursively for deterministic order
  const sorted = sortObjectKeys(params);
  
  // Step 2: Serialize to JSON (consistent string representation)
  const jsonString = JSON.stringify(sorted);
  
  // Step 3: Encode to Uint8Array for crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonString);
  
  // Step 4: Generate SHA-256 hash using Web Crypto API (Edge/Node compatible)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // Step 5: Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  return hashHex;
}

/**
 * Synchronous version using a simple hash for environments without crypto.subtle
 * Falls back to a fast non-cryptographic hash (for development/testing only)
 */
export function generateInputHashSync(params: Record<string, unknown>): string {
  const sorted = sortObjectKeys(params);
  const jsonString = JSON.stringify(sorted);
  
  // Simple djb2 hash (non-cryptographic, but deterministic)
  let hash = 5381;
  for (let i = 0; i < jsonString.length; i++) {
    hash = ((hash << 5) + hash) ^ jsonString.charCodeAt(i);
  }
  
  // Convert to positive hex string
  return (hash >>> 0).toString(16).padStart(8, "0");
}
