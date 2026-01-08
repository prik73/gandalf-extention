# 🚀 Quick Start Guide

## Load the Extension in Chrome

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to: `/home/priyanshu/Desktop/chrome-extention/gandalf/dist`
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Gandalf - Browser History Recap" in your extensions list
   - The wizard icon 🧙 should appear in your Chrome toolbar

## Test the Extension

1. **Grant Permissions**
   - Click the Gandalf icon in your toolbar
   - Chrome will ask for permission to access your browsing history
   - Click "Allow"

2. **View Your YouTube History**
   - The popup will automatically analyze your YouTube activity
   - Try switching between "Today", "Week", and "Month" tabs

3. **What You'll See**
   - **Summary**: Total videos watched and estimated time
   - **Time Patterns**: When you browse (morning/afternoon/evening/night)
   - **Content Categories**: Learning, entertainment, music, news
   - **Recent Videos**: List of your most recent YouTube visits

## Troubleshooting

### Extension doesn't load
- Make sure you selected the `dist` folder, not the project root
- Check that `manifest.json` exists in the dist folder

### No data showing
- Make sure you have YouTube browsing history
- Try selecting "Week" or "Month" for more data
- Check Chrome DevTools console for errors (right-click popup → Inspect)

### Permission errors
- Go to `chrome://extensions/`
- Find Gandalf and click "Details"
- Scroll to "Permissions" and ensure "Read your browsing history" is enabled

## Development

### Make Changes
1. Edit files in `src/`
2. Run `npm run build`
3. Go to `chrome://extensions/`
4. Click the refresh icon ↻ on the Gandalf extension card

### Debug
- Right-click the extension popup → "Inspect"
- This opens Chrome DevTools for the popup
- Check Console for errors
- Use React DevTools for component inspection

## Next Steps

### Test with Real Data
1. Watch some YouTube videos
2. Click the Gandalf icon
3. See if the categorization makes sense
4. Check if time patterns are accurate

### Add More Features
- Edit `src/utils/historyAnalyzer.js` to improve pattern detection
- Add more content categories
- Implement weekly/monthly trend analysis
- Add LLM integration for natural language insights

### Backend Integration (Optional)
See README.md for instructions on setting up:
- Node.js + Express backend
- PostgreSQL database
- OpenAI/Anthropic LLM integration
