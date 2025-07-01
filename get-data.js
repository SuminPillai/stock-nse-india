const { NseIndia } = require('./build/index');
const nse = new NseIndia();
const dataType = process.argv[2]; // This will be 'gainers' or 'losers'

nse.getMarketStatus()
  .then(data => {
    const marketMovers = data.marketState[0].marketMovers;
    if (marketMovers && marketMovers.length > 0) {
      if (dataType === 'gainers') {
        // Convert the gainers data to a JSON string and print it
        console.log(JSON.stringify(marketMovers[0].gainers, null, 2));
      } else if (dataType === 'losers') {
        // Convert the losers data to a JSON string and print it
        console.log(JSON.stringify(marketMovers[0].losers, null, 2));
      }
    } else {
      console.log("[]"); // Print empty array if no market movers data
    }
  })
  .catch(error => {
    console.error('Failed to fetch market status:', error);
    console.log("[]"); // Print empty array on error
    process.exit(1);
  });