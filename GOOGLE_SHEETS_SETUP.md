# Google Sheets Logging Setup

Track all generations in a Google Sheet - no database required!

## Quick Setup (5 minutes)

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **File → Import → Upload** and upload `generations-template.csv` from this repo
3. Or create a new sheet and import the CSV
4. Rename it to "Talk to Landing - Generations"

### Step 2: Add the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any code in the editor
3. Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp,
      data.userEmail,
      data.userId,
      data.videoId,
      data.videoTitle,
      data.videoChannel,
      data.transcriptSource,
      data.transcript,
      data.result
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (Ctrl+S or Cmd+S)
5. Name the project "Talk to Landing Logger"

### Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set these options:
   - Description: "Talk to Landing Logger"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** and follow the prompts
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/xxx/exec`)

### Step 4: Add to Vercel

1. Go to your Vercel project dashboard
2. Go to **Settings → Environment Variables**
3. Add a new variable:
   - Name: `GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: (paste the Web app URL from Step 3)
4. Click **Save**
5. Redeploy your app

## What Gets Logged

Each generation creates a row with:
- **Timestamp** - When the generation happened
- **Email** - User's email address
- **User ID** - Clerk user ID
- **Video ID** - YouTube video ID
- **Video Title** - Title of the video
- **Channel** - YouTube channel name
- **Source** - "youtube-captions" or "manual"
- **Transcript** - The full transcript input (truncated to 50k chars)
- **Result** - The generated content as JSON (truncated to 50k chars)

## Testing

1. Generate a landing page on your site
2. Check your Google Sheet - a new row should appear!

## Troubleshooting

**No data appearing?**
- Make sure the Web app URL is correct in Vercel
- Check that you redeployed after adding the env var
- Look at Vercel logs for any errors

**Permission errors?**
- Make sure "Who has access" is set to "Anyone" in the Apps Script deployment
