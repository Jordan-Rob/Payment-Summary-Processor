const fs = require("fs"); 
const readline = require("readline")

const args = process.argv.slice(2); // retrieve array containing options entered when running the script in CLI
const inputFileArg = args[0] || "input.csv"; 
const outputFileArg = args[1] || "output.csv"; 

const data = {}; // empty data object to store payer,payee:amount key-value pairs

async function processFile(
  inputFile = inputFileArg,
  outputFile = outputFileArg
) {
  try {
    // create readable stream for input file 
    const inputStream = fs.createReadStream(inputFile, { encoding: "utf8" })

    // Create a readline interface for reading lines from the stream
    const rl = readline.createInterface({ input: inputStream });

    // Process each line using the stream
    rl.on("line", (line) => {
      if(!isValidLine(line)) {
        console.error("Invalid line structure:", line);
        return;
      }

      const [payer, payee, amount] = line.split(",").map((field) => field.trim())
      const key = `${payer}_${payee}`

      if (!isNaN(parseFloat(amount))) {
        data[key] = (data[key] || 0) + parseFloat(amount)
      }
    })

    // wait for stream to end
    await new Promise((resolve) => {
      rl.on("close", resolve);
    })

    // Output processed data
    await summarizeData(data, outputFile)

  } catch (err) {
    // function will throw an error if there was an issue reading the input file
    console.error("Error reading input file:", err.message);
  }
}

function isValidLine(line) {
  // Validate that the line has 3 comma-separated values, amount is numeric and that each column has no whitespaces 
  const values = line.split(",")
  return values.length == 3 &&
  !isNaN(parseFloat(values[2])) &&
  values.every((field) => field.trim().length > 0 )
}

async function summarizeData(data, outputFile) {
  const outputStream = fs.createWriteStream(outputFile, { encoding: "utf8" })
  
  for (const key in data) {
    const [payer, payee] = key.split("_"); // iterate over keys in data object and destructure values of payer and payee
    const amount = parseFloat(data[key]).toFixed(2); // retrieve amount value with 2 decimal places in string format
    outputStream.write(`${payer},${payee},${amount}\n`);
  }

  outputStream.end();
  console.log(`Summary saved to ${outputFile}`);

}

processFile();
module.exports = { summarizeData, processFile };
