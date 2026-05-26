#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WATCH_DIR = path.join(__dirname, 'app');
const DEBOUNCE_TIME = 2000; // 2 seconds
let debounceTimer = null;
let lastCommitTime = Date.now();

function getGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    return status.trim();
  } catch (err) {
    return '';
  }
}

function commitAndPush() {
  try {
    const status = getGitStatus();

    if (!status) {
      console.log('✓ No changes to commit');
      return;
    }

    console.log('📝 Changes detected, committing...');
    console.log(status);

    // Stage all changes
    execSync('git add -A', { stdio: 'inherit' });

    // Create commit message with timestamp
    const now = new Date().toLocaleString('uk-UA');
    const message = `🔄 Auto-commit: ${now}`;

    // Commit
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });

    // Try to push (won't work from bash, but good for when run locally)
    try {
      execSync('git push origin main', { stdio: 'inherit' });
      console.log('✅ Pushed to GitHub!');
    } catch (err) {
      console.log('⚠️  Could not push automatically (use: git push origin main)');
    }

  } catch (err) {
    if (err.message.includes('nothing to commit')) {
      console.log('✓ Nothing to commit');
    } else {
      console.error('Error:', err.message);
    }
  }
}

function debounce() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const now = Date.now();
    if (now - lastCommitTime > DEBOUNCE_TIME) {
      commitAndPush();
      lastCommitTime = now;
    }
  }, DEBOUNCE_TIME);
}

function watchDirectory(dir) {
  try {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (!filename) return;

      // Ignore node_modules, .git, .next, etc
      if (
        filename.includes('node_modules') ||
        filename.includes('.next') ||
        filename.includes('.git') ||
        filename.includes('dist') ||
        filename.includes('.vercel')
      ) {
        return;
      }

      console.log(`📄 Changed: ${filename}`);
      debounce();
    });

    console.log(`👀 Watching for changes in ${dir}`);
    console.log('Press Ctrl+C to stop\n');
  } catch (err) {
    console.error('Error setting up watcher:', err.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping file watcher...');
  process.exit(0);
});

// Start watching
watchDirectory(WATCH_DIR);
