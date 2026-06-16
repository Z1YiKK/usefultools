const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { google } = require('googleapis');
const fs = require('fs');

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'F:/money-site/data/key.json',
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/analytics.readonly'],
  });
  const client = await auth.getClient();

  const result = { updated: new Date().toISOString() };

  // === GA4 Data ===
  try {
    const ga4 = new BetaAnalyticsDataClient({ keyFilename: 'F:/money-site/data/key.json' });
    const [report] = await ga4.runReport({
      property: 'properties/541905751',
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
      dimensions: [{ name: 'pagePath' }],
    });
    result.ga4 = { rows: report.rows, totals: report.totals };
    console.log('GA4: OK');
  } catch (e) {
    console.log('GA4 error:', e.message.slice(0, 80));
    result.ga4 = { rows: [] };
  }

  // === Search Console Data ===
  try {
    const sc = google.searchconsole({ version: 'v1', auth: client });
    const searchResp = await sc.searchanalytics.query({
      siteUrl: 'https://toolhero.cc',
      requestBody: {
        startDate: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        dimensions: ['page'],
        rowLimit: 20,
      },
    });
    const rows = (searchResp && searchResp.data && searchResp.data.rows) || [];
    result.searchConsole = searchResp && searchResp.data ? searchResp.data : {};
    let totalClicks = 0, totalImpressions = 0, totalPosition = 0;
    rows.forEach(function(r) {
      totalClicks += r.clicks || 0;
      totalImpressions += r.impressions || 0;
      totalPosition += (r.position || 0) * (r.impressions || 0);
    });
    result.searchTotals = {
      clicks: totalClicks,
      impressions: totalImpressions,
      avgPosition: totalImpressions > 0 ? (totalPosition / totalImpressions).toFixed(1) : 0,
    };
    console.log('Search Console: OK (' + totalClicks + ' clicks, ' + totalImpressions + ' impressions)');
  } catch (e) {
    console.log('Search Console error:', e.message.slice(0, 100));
    result.searchConsole = {};
    result.searchTotals = { clicks: 0, impressions: 0, avgPosition: 0 };
  }

  fs.writeFileSync('F:/money-site/data/dashboard-data.json', JSON.stringify(result, null, 2));
  console.log('Saved to dashboard-data.json');
}
main();
