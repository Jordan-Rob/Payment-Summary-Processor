const fs = require("fs");
const { summarizeData, processFile } = require("./script");

test("Script correctly processes data from valid input file", () => {
  const inputFile = "./test-csv-files/test-input.csv";
  const outputFile = "./test-csv-files/test-output.csv";

  processFile(inputFile, outputFile);

  const expectedOutput = [
    "Alex,Beatrice,120.54",
    "Beatrice,Alex,5.74",
    "Carl,Alex,60.88",
    "Carl,Beatrice,25.30",
    "Beatrice,Carl,168.08",
  ].join("\n");

  expect(fs.readFileSync(outputFile, "utf8")).toBe(expectedOutput);
});

test("processFile throws an error for non-existent input file", () => {
  const inputFile = "./nonexistent.csv";
  const outputFile = "./test-csv-files/test-output.csv";

  try {
    processFile(inputFile, outputFile);
  } catch (error) {
    expect(error.message).toBe("Error reading input file");
  }
});

test("processFile throws an error for invalid CSV file format", () => {
  const inputFile = "./test-csv-files/test-input-tab.csv";
  const outputFile = "./test-csv-files/test-output.csv";

  try {
    processFile(inputFile, outputFile);
  } catch (error) {
    expect(error.message).toBe(
      "Invalid file format: Please use a CSV with comma-separated values."
    );
  }
});

test("Script returns empty output when provided empty input file", () => {
  const inputFile = "./test-csv-files/empty.csv";
  const outputFile = "./test-csv-files/empty-test-output.csv";

  processFile(inputFile, outputFile);

  const expectedOutput = "";

  expect(fs.readFileSync(outputFile, "utf8")).toBe(expectedOutput);
});

test("Script returns empty outputFile when input file has invalid amount", () => {
  const data = {
    A_B: 100,
    A_B: "invalid",
  };
  const outputFile = "./test-csv-files/empty.csv";

  summarizeData(data, outputFile);

  const expectedOutput = [""].join("\n");

  expect(fs.readFileSync(outputFile, "utf8")).toBe(expectedOutput);
});
