const { NseIndia } = require('./build/index');
const axios = require('axios'); // We now use axios to send data
const nse = new NseIndia();

// Get arguments from the command line
const dataType = process.argv[2]; // 'gainers' or 'losers'
const npointUrl = process.argv[3]; // The secret URL for npoint.io

// Check if the URL was provided
if (!npointUrl || !npointUrl.startsWith('https://api.npoint.io/')) {
    console.error("Error: A valid npoint.io URL was not provided as an argument.");
    process.exit(1);
}

async function scrapeAndPost() {
    console.log(`Starting process for: ${dataType}`);
    try {
        // Step 1: Fetch the data using the documented function
        const data = await nse.getGainersAndLosersByIndex("NIFTY 50");
        let outputData = [];

        if (dataType === 'gainers' && data.gainers) {
            outputData = data.gainers;
        } else if (dataType === 'losers' && data.losers) {
            outputData = data.losers;
        }

        if (outputData.length > 0) {
            console.log(`Successfully scraped ${outputData.length} ${dataType}.`);
            
            // Step 2: Send the data directly to npoint.io using axios
            console.log(`Posting data to ${npointUrl}...`);
            await axios.post(npointUrl, outputData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Successfully posted data to npoint.io!");
        } else {
            console.log(`No ${dataType} data was found to post.`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        process.exit(1);
    }
}

scrapeAndPost();