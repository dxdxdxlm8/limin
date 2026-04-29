import time
from playwright.sync_api import sync_playwright
import os

print("Starting persistent browser...")
p = sync_playwright().start()
user_data_dir = os.path.abspath("./playwright_user_data")
browser_context = p.chromium.launch_persistent_context(
    user_data_dir=user_data_dir,
    headless=False,
    args=["--remote-debugging-port=9222"]
)
page = browser_context.pages[0] if browser_context.pages else browser_context.new_page()
page.goto("https://wanwang.aliyun.com/webdesign/home#/ai/manage/code?conversationId=012B9B58F6F31D78CF177EB879A4A834")
print("BROWSER_READY", flush=True)

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    pass
