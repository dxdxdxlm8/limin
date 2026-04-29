from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    user_data_dir = os.path.abspath("./playwright_user_data")
    browser_context = p.chromium.launch_persistent_context(
        user_data_dir=user_data_dir,
        headless=False
    )
    page = browser_context.pages[0] if browser_context.pages else browser_context.new_page()
    page.goto("https://wanwang.aliyun.com/webdesign/home#/ai/manage/code?conversationId=012B9B58F6F31D78CF177EB879A4A834")
    
    print("Waiting for page load...", flush=True)
    page.wait_for_timeout(10000)
        
    print("Saving text and HTML...", flush=True)
    with open("aliyun_inner_text.txt", "w", encoding="utf-8") as f:
        f.write(page.locator('body').inner_text())
        f.write("\n\n=== FRAMES ===\n")
        for i, frame in enumerate(page.frames):
            f.write(f"Frame {i} URL: {frame.url}\n")
            try:
                f.write(frame.locator('body').inner_text() + "\n")
            except:
                pass
                
    with open("aliyun_page_dump2.html", "w", encoding="utf-8") as f:
        f.write(page.content())
        
    browser_context.close()
