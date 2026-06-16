const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function main() {
  const client = new BetaAnalyticsDataClient({
    keyFilename: 'F:/money-site/data/key.json'
  });

  // Property IDs to try - the correct one will work
  const propIds = ['450419830', '450419831', '450419832', '439461549', '439461550'];

  for (const pid of propIds) {
    try {
      const [report] = await client.runReport({
        property: `properties/${pid}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
        ],
      });
      console.log(`Property ${pid}: OK`);
      console.log(JSON.stringify({ rows: report.rows, totals: report.totals }, null, 2));
      // Save to file
      const fs = require('fs');
      fs.writeFileSync('F:/money-site/data/dashboard-data.json', JSON.stringify({
        property: pid,
        rows: report.rows,
        totals: report.totals,
        updated: new Date().toISOString()
      }));
      return;
    } catch (e) {
      if (e.message.includes('not found') || e.message.includes('permission')) {
        continue;
      }
      console.log(`Property ${pid}: ${e.message.slice(0,80)}`);
    }
  }
  console.log('Could not find matching property. Check the service account email was added.');
}
main();
