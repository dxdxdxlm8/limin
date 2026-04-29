from playwright.sync_api import sync_playwright
import os

def check_local_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:30101/...")
            page.goto('http://localhost:30101/')
            page.wait_for_load_state('networkidle')
            print("Page title:", page.title())
            screenshot_path = os.path.abspath('app_screenshot.png')
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")
            
            # Check if there's any obvious error text
            body_text = page.inner_text('body')
            if "Error" in body_text or "Exception" in body_text:
                print("Potential error detected in page content.")
            else:
                print("App seems to be running correctly.")
                
        except Exception as e:
            print(f"Failed to connect to app: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    check_local_app()
