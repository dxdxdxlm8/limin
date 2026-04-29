from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    context = browser.contexts[0]
    page = context.pages[0]
    
    with open("aliyun_cdp_dump.txt", "w", encoding="utf-8") as f:
        f.write("MAIN PAGE URL: " + page.url + "\n")
        f.write("MAIN PAGE BODY:\n")
        f.write(page.locator('body').inner_text() + "\n\n")
        
        for i, frame in enumerate(page.frames):
            f.write(f"FRAME {i} ({frame.url}):\n")
            try:
                f.write(frame.locator('body').inner_text() + "\n\n")
            except Exception as e:
                f.write(f"Error: {e}\n\n")
                
        # Try to find all tree/file elements in all frames just in case
        f.write("\n=== TREE ITEMS ===\n")
        for i, frame in enumerate(page.frames):
            items = frame.locator('[class*="tree"], [class*="node"], [class*="file"], [role="treeitem"]').all()
            for item in items:
                try:
                    text = item.inner_text().replace('\n', ' ')
                    if text.strip():
                        cls = item.get_attribute('class') or ''
                        f.write(f"Frame {i} | Class: {cls} | Text: {text}\n")
                except:
                    pass
                    
    browser.close()
