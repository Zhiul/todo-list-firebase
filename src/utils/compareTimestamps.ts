import { Timestamp } from "firebase/firestore";

interface dataWithTimestamp {
  timestamp: number | Timestamp;
}

export function compareTimestamps(a: dataWithTimestamp, b: dataWithTimestamp) {
  if (a.timestamp < b.timestamp) return -1;
  return 0;
}
