"""
GA4 Dashboard Data Updater
Fetches 7-day pageview data from GA4 and updates dashboard-data.json
Usage: python update-dashboard.py
"""
import json, os, datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Dimension, Metric
from google.oauth2 import service_account

# Config
PROPERTY_ID = 'properties/541905751'
CREDENTIALS_FILE = 'F:/money-site/data/ga4-credentials.json'
OUTPUT_FILE = 'F:/money-site/data/dashboard-data.json'

def fetch_ga4_data():
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=['https://www.googleapis.com/auth/analytics.readonly']
    )
    import os
    os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:7890'
    client = BetaAnalyticsDataClient(credentials=credentials, transport='rest')

    request = RunReportRequest(
        property=PROPERTY_ID,
        date_ranges=[DateRange(start_date='7daysAgo', end_date='today')],
        dimensions=[Dimension(name='pagePath')],
        metrics=[
            Metric(name='activeUsers'),
            Metric(name='screenPageViews'),
            Metric(name='averageSessionDuration'),
        ],
        limit=50,
    )

    response = client.run_report(request)

    rows = []
    for row in response.rows:
        rows.append({
            'dimensionValues': [{'value': row.dimension_values[0].value, 'oneValue': 'value'}],
            'metricValues': [
                {'value': row.metric_values[0].value, 'oneValue': 'value'},
                {'value': row.metric_values[1].value, 'oneValue': 'value'},
                {'value': row.metric_values[2].value, 'oneValue': 'value'},
            ]
        })

    return rows

def update_dashboard():
    print('Fetching GA4 data...')
    rows = fetch_ga4_data()

    # Read existing data
    with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Update
    data['updated'] = datetime.datetime.utcnow().isoformat() + 'Z'
    data['ga4']['rows'] = rows

    # Calculate totals
    total_users = sum(int(r['metricValues'][0]['value']) for r in rows)
    total_views = sum(int(r['metricValues'][1]['value']) for r in rows)
    data['ga4']['totals'] = [
        {'metricValues': [
            {'value': str(total_users)},
            {'value': str(total_views)},
        ]}
    ]

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f'Updated: {data["updated"]}')
    print(f'Total users: {total_users}')
    print(f'Total pageviews: {total_views}')
    print(f'Pages tracked: {len(rows)}')

    # Show top pages
    sorted_rows = sorted(rows, key=lambda r: int(r['metricValues'][1]['value']), reverse=True)
    print('\nTop pages (7 days):')
    for r in sorted_rows[:10]:
        path = r['dimensionValues'][0]['value']
        users = r['metricValues'][0]['value']
        views = r['metricValues'][1]['value']
        print(f'  {views:>4} views | {users:>3} users | {path}')

if __name__ == '__main__':
    update_dashboard()
