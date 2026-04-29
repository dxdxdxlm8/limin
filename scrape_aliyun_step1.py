from playwright.sync_api import sync_playwright
import time
import os

url = "https://wanwang.aliyun.com/webdesign/home#/ai/manage/code?conversationId=012B9B58F6F31D78CF177EB879A4A834"
proceed_file = "proceed.txt"

if os.path.exists(proceed_file):
    os.remove(proceed_file)

print("Starting playwright...", flush=True)
with sync_playwright() as p:
    # Use persistent context to save login state in a local folder
    user_data_dir = os.path.abspath("./playwright_user_data")
    browser_context = p.chromium.launch_persistent_context(
        user_data_dir=user_data_dir,
        headless=False
    )
    
    page = browser_context.pages[0] if browser_context.pages else browser_context.new_page()
    page.goto(url)
    
    print("\n=======================================================", flush=True)
    print("READY_FOR_LOGIN", flush=True)
    print(f"Please log in. When done, create a file named {proceed_file} or let the assistant do it.", flush=True)
    print("=======================================================\n", flush=True)
    
    # Wait until proceed_file is created
    while not os.path.exists(proceed_file):
        time.sleep(1)
        
    print("Proceed file found. Proceeding to dump page state...", flush=True)
    
    # Wait a bit just in case
    time.sleep(2)
    
    page.screenshot(path="aliyun_page_screenshot.png", full_page=True)
    with open("aliyun_page_dump.html", "w", encoding="utf-8") as f:
        f.write(page.content())
    
    print("Dump complete. Closing browser.", flush=True)
    browser_context.close()
