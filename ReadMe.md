# CSV Processing CLI Script Documentation

## Overview

This script processes a CSV file containing payer-payee-amount data and summarizes it by aggregating amounts for each unique payer-payee combination. The summarized data is then written to an output CSV file.

### Prerequisites

Ensure you have Node.js installed on your system.

### Installation

1. cd into parent folder and install dependencies:
``` 
npm install
```

## Usage

1.  Execute the script with the following command:
```
node script.js [inputFile] [outputFile]
```
- inputFile: (Optional) Path to the input CSV file. If not provided, the script uses the default file name "input.csv..

- outputFile:  (Optional) Path to the output CSV file. If not provided, the script uses the default file name "output.csv.

### Example usage

```
node script.js input_data.csv output_summary.csv
```

This command processes the data in "input_data.csv" and saves the summary in "output_summary.csv."

### Running tests

Tests are run using the Jest testing framework 

Run tests with the following command:
```
npm test
```


