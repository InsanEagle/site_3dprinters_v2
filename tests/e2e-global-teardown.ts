import { resetE2eStorage } from "./e2e-storage";

export default async function globalTeardown() {
  resetE2eStorage();
}
