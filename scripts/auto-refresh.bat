@echo off
cd /d F:\money-site
D:\Pyhton\python scripts\update-dashboard.py
git add data/dashboard-data.json
git commit -m "auto: daily dashboard refresh"
set HTTPS_PROXY=http://127.0.0.1:7890
git push origin main
