# Deployment Instructions

Your calendar app has been built for production and is ready to deploy!

## Build Output

The production-ready files are located in the `dist/` folder:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized CSS and JavaScript files

**Total size**: ~151 KB (optimized and minified)

## Deployment Steps

### Option 1: Traditional Web Hosting (cPanel, Shared Hosting)

1. **Access your hosting control panel**
   - Log into cPanel or your hosting provider's file manager

2. **Navigate to your web root**
   - Usually named `public_html`, `www`, or `htdocs`
   - For subdomain/subfolder deployments, navigate to that directory

3. **Upload the files**
   - Upload **all contents** of the `dist/` folder (not the folder itself)
   - Your structure should be:
     ```
     public_html/
     ├── index.html
     └── assets/
         ├── index-Cz0rDDNH.css
         └── index-qmMStsiV.js
     ```

4. **Set proper permissions** (if needed)
   - Files: 644
   - Directories: 755

5. **Test your deployment**
   - Visit your domain: `https://yourdomain.com`
   - Add an event, refresh the page, verify it persists

### Option 2: FTP/SFTP Upload

1. **Connect to your server**
   ```bash
   # Using command line (from the "1 - Calender App" directory)
   sftp username@yourserver.com

   # Navigate to web root
   cd public_html

   # Upload all files
   put -r dist/*
   ```

2. **Or use an FTP client** (FileZilla, Cyberduck, etc.)
   - Connect to your server
   - Navigate to your web root
   - Drag and drop all contents from `dist/` folder

### Option 3: Nginx/Apache Server

**For Nginx:**

Add this to your server configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/1 - Calender App/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**For Apache:**

The app works out of the box with Apache. Just point your DocumentRoot to the `dist` folder.

If you need URL rewriting, create a `.htaccess` file in the `dist` folder:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Verification Checklist

After deployment, verify that:

- [ ] The calendar displays correctly
- [ ] You can navigate between months
- [ ] You can add events (click on a day)
- [ ] Events appear on the calendar
- [ ] You can click events to view details
- [ ] You can delete events
- [ ] **Events persist after page refresh** (localStorage)
- [ ] The app works on mobile devices
- [ ] HTTPS is working (if applicable)

## Important Notes

### Data Storage
- Events are stored in **browser localStorage** only
- Each user's data is stored locally in their browser
- Data is **not shared** between devices or browsers
- Clearing browser data will delete all events
- No backend or database required

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- localStorage must be enabled (default in all browsers)

### Performance
- App is fully optimized and minified
- Loads in < 1 second on most connections
- All assets are cached by the browser
- Gzipped size: ~48 KB total

## Troubleshooting

**Events not persisting?**
- Check if localStorage is enabled in the browser
- Check browser console for errors (F12 → Console)
- Verify the app is running on the same domain/port

**App not loading?**
- Verify all files were uploaded correctly
- Check file permissions (644 for files, 755 for folders)
- Check browser console for 404 errors
- Ensure `index.html` is in the root of your web directory

**Blank page?**
- Check if JavaScript is enabled
- Check browser console for errors
- Verify the `assets/` folder was uploaded correctly

## Rebuilding

If you make changes to the source code, rebuild with:

```bash
cd "1 - Calender App"
npm run build
```

Then re-upload the contents of the `dist/` folder.

## Need Help?

- Check browser console (F12) for errors
- Verify file paths are correct
- Test locally first: `npm run preview` (serves the production build)
