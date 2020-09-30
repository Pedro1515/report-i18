import { Run } from "./runs";

export type ProjectError =
  | "Product Bug"
  | "Automation Code Bug"
  | "System Issue"
  | "Needs Investigation";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  levelSetting: number;
  users: string[];
  errorState: ProjectError[];
  runQuantity: number;
  testQuantity: number;
  lastRun: Run;
}
