@echo off
REM Fix Firebase credentials secret and push to GitHub

echo Removing Firebase credentials file from git...
git rm --cached swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json

echo Adding to .gitignore...
echo swap-crm-firebase-adminsdk-fbsvc-fa25c5298b.json >> .gitignore

echo Staging changes...
git add .gitignore

echo Committing...
git commit -m "🔐 Remove Firebase credentials from repo"

echo Pushing to GitHub...
git push origin main

echo ✅ Done! Your app is being deployed on Vercel!
pause
