from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    context = browser.contexts[0]
    page = context.pages[0]
    
    js = """
    () => {
        try {
            return window.monaco.editor.getModels()[0].getValue().substring(0, 100);
        } catch(e) {
            return "error: " + e;
        }
    }
    """
    res = page.evaluate(js)
    print("RES:", res)
    browser.close()
