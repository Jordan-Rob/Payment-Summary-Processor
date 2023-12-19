const fs = require("fs"); // import fs with promise-based interfaces to allow asynchronous functionality
const readline = require("readline")

const args = process.argv.slice(2); // retrieve array containing options entered when running the script in CLI
const inputFileArg = args[0] || "input.csv"; // declare variable for inputfile option entered in CLI if provided or use default
const outputFileArg = args[1] || "output.csv"; // declare variable for outputfile option entered in CLI if provided or use default

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
      
      const [payer, payee, amount] = line.split(",")
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
  // Validate that the line has 3 comma-separated values
  const values = line.split(",")
  return values.length == 3 && !isNaN(parseFloat(values[2]));
}

async function summarizeData(data, outputFile) {
  const outputStream = fs.createWriteStream(outputFile, { encoding: "utf8" })
  //const outputLines = []; // declare array to store content lines to be wriiten to outputFile

  for (const key in data) {
    const [payer, payee] = key.split("_"); // iterate over keys in data object and destructure values of payer and payee
    const amount = parseFloat(data[key]).toFixed(2); // retrieve amount value with 2 decimal places in string format
    //outputLines.push(`${payer},${payee},${amount}`);
    outputStream.write(`${payer},${payee},${amount}\n`);
  }

  outputStream.end();
  console.log(`Summary saved to ${outputFile}`);

}

processFile();
module.exports = { summarizeData, processFile };
