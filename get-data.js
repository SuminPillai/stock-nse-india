const { NseIndia } = require('./build/index');
const nse = new NseIndia();

// This gets the argument ('gainers' or 'losers') from the command line
const dataType = process.argv[2];

// Use the correct function from the documentation.
// Instead of using the NseIndexes enum, we pass the index name as a simple string.
nse.getGainersAndLosersByIndex("NIFTY 50")
  .then(data => {
    let outputData = [];

    // The 'data' object from this function directly contains 'gainers' and 'losers' arrays
    if (dataType === 'gainers' && data.gainers) {
      outputData = data.gainers;
    } else if (dataType === 'losers' && data.losers) {
      outputData = data.losers;
    }

    // Print the data as a clean JSON string, ready for npoint.io
    console.log(JSON.stringify(outputData, null, 2));
  })
  .catch(error => {
    console.error(`Failed to fetch gainers and losers: ${error.message}`);
    console.log("[]"); // Print an empty array if an error occurs
    process.exit(1);
  });