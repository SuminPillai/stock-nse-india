const { NseIndia } = require('./build/index');
const nse = new NseIndia();

// This gets the argument ('gainers' or 'losers') from the command line
const dataType = process.argv[2];

// Use the correct function: getMarketMovers()
nse.getMarketMovers()
  .then(data => {
    // Check if the correct data type exists in the response
    if (dataType === 'gainers' && data.gainers) {
      console.log(JSON.stringify(data.gainers, null, 2));
    } else if (dataType === 'losers' && data.losers) {
      console.log(JSON.stringify(data.losers, null, 2));
    } else {
      console.log("[]"); // Print an empty array if no data is found
    }
  })
  .catch(error => {
    console.error(`Failed to fetch market movers: ${error.message}`);
    console.log("[]"); // Print an empty array if an error occurs
    process.exit(1);
  });