const { NseIndia } = require('./build/index');
const nse = new NseIndia();

const dataType = process.argv[2]; // 'gainers' or 'losers'
const stocksToSample = 75; // Number of stocks to check for performance

async function findMarketMovers() {
  try {
    // 1. Get all available stock symbols from NSE
    const allSymbols = await nse.getAllStockSymbols();

    // 2. Take a random sample to avoid checking thousands of stocks on every run
    const sampledSymbols = allSymbols
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, stocksToSample);

    // 3. Fetch details for each stock in our sample
    const detailPromises = sampledSymbols.map(symbol => nse.getEquityDetails(symbol));
    const allDetails = await Promise.all(detailPromises);

    // 4. Filter for valid results and get the price info
    const validStocks = allDetails
      .filter(stock => stock && stock.priceInfo)
      .map(stock => stock.priceInfo);

    // 5. Sort all fetched stocks by their percentage change
    validStocks.sort((a, b) => b.pChange - a.pChange);

    let outputData = [];
    if (dataType === 'gainers') {
      // The top 10 are the biggest gainers
      outputData = validStocks.slice(0, 10);
    } else if (dataType === 'losers') {
      // The bottom 10 are the biggest losers
      outputData = validStocks.slice(-10).reverse(); // Get the last 10 and reverse the order
    }

    // 6. Print the final JSON data
    console.log(JSON.stringify(outputData, null, 2));

  } catch (error) {
    console.error(`Error in findMarketMovers: ${error.message}`);
    console.log("[]"); // Output an empty array on error
    process.exit(1);
  }
}

findMarketMovers();