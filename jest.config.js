import { resolve } from "path";

export default async () => {
    /* 
    Replace the <INSERT YOUR FILE NAME HERE> with the name of the cloned repo folder name 
    Eg: "../23da1134-b7a2-4e2f-bcdf-59dbab5a7595"
  */
    let __dirname = "../<INSERT YOUR FILE NAME HERE>";

  return {
    verbose: true,
    rootDir: resolve(__dirname, ""),
    testTimeout: 30000,
    maxWorkers: 1,
    reporters: ["default", "jest-junit"]
  };
};
