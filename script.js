const fs = require("fs").promises; // import fs with promise-based interfaces to allow asynchronous functionality

const args = process.argv.slice(2); // retrieve array containing options entered when running the script in CLI
const inputFileArg = args[0] || "input.csv"; // declare variable for inputfile option entered in CLI if provided or use default
const outputFileArg = args[1] || "output.csv"; // declare variable for outputfile option entered in CLI if provided or use default

const data = {}; // empty data object to store payer,payee:amount key-value pairs

async function processFile(
  inputFile = inputFileArg,
  outputFile = outputFileArg
) {
  try {
    const content = await fs.readFile(inputFile, "utf8"); // read content from inputFile
    if (content.includes(",")) {
      // check for correct delimeter, comma(,)
      const lines = content.split("\n"); // split each line in inputfile content and save them in an array

      lines.forEach((line) => {
        const [payer, payee, amount] = line.split(","); // iterate through each line destructing values for payer. payee and amount
        const key = `${payer}_${payee}`; // create a key that is a string combination of payer and payee

        if (!isNaN(parseFloat(amount))) {
          data[key] = (data[key] || 0) + parseFloat(amount); // save cummulative amount as value of the key created above and store it in data object
        }
      });

      await summarizeData(data, outputFile); // run summarizeData with the populated data object and outputFile declared
    } else {
      // error will be thrown if values in the input file content are not separed by comma
      throw Error(
        "Invalid file format: Please use a CSV with comma-separated values."
      );
    }
  } catch (err) {
    // function will throw an error if there was an issue reading the input file
    throw Error("Error reading input file");
  }
}

async function summarizeData(data) {
  const outputLines = []; // declare array to store content lines to be wriiten to outputFile

  for (const key in data) {
    const [payer, payee] = key.split("_"); // iterate over keys in data object and destructure values of payer and payee
    const amount = parseFloat(data[key]).toFixed(2); // retrieve amount value with 2 decimal places in string format
    outputLines.push(`${payer},${payee},${amount}`); // create a string of payer,payee,amount and save it as an item in outputLines array
  }

  const outputContent = outputLines.join("\n"); // create output content from outputLines array writing each item on a new line

  try {
    await fs.writeFile(outputFileArg, outputContent); // write outputContent to specified outputfile
    //console.log(`Summary saved to ${outputFileArg}`)
  } catch (error) {
    throw error;
  }
}

processFile();

module.exports = { summarizeData, processFile };
