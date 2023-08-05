import { resolve } from "path";

export default async () => {
    /* 
    Replace the <INSERT YOUR FILE NAME HERE> with the name of the cloned repo folder name 
    Eg: "../23da1134-b7a2-4e2f-bcdf-59dbab5a7595"
  */
    let __dirname = "../499f8c79-fa56-4273-b627-cb06c758ca0d";

  return {
    verbose: true,
    rootDir: resolve(__dirname, ""),
    testTimeout: 30000,
    maxWorkers: 1,
    reporters: ["default", "jest-junit"]
  };
};
