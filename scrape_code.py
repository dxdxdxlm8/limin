"""
Scrape all code files from Aliyun webdesign code manager.
Connects to the running browser via CDP (port 9222).
"""
import time
import os
import json
from playwright.sync_api import sync_playwright

OUTPUT_DIR = r"c:\Users\admin\Desktop\limin\aliyun_code"
CODE_URL = "https://wanwang.aliyun.com/webdesign/home#/ai/manage/code?conversationId=012B9B58F6F31D78CF177EB879A4A834"

def get_editor_content(page):
    """Try to get content from Monaco editor."""
    js = """
    () => {
        try {
            if (window.monaco && window.monaco.editor) {
                let models = window.monaco.editor.getModels();
                if (models && models.length > 0) {
                    return models[0].getValue();
                }
            }
            // fallback: find editor DOM
            let editors = document.querySelectorAll('.monaco-editor .view-lines');
            if (editors.length > 0) {
                let lines = Array.from(editors[0].querySelectorAll('.view-line'));
                return lines.map(l => l.textContent).join('\\n');
            }
            return null;
        } catch(e) {
            return 'ERROR: ' + e.message;
        }
    }
    """
    return page.evaluate(js)

def get_tree_structure(page):
    """Get all tree items (files and folders) from the sidebar."""
    js = """
    () => {
        let menu = document.querySelector('.menuList--Q2qe_c44, ul.ant-menu-root');
        if (!menu) return [];
        let items = Array.from(menu.querySelectorAll('li.ant-menu-item, li.ant-menu-submenu'));
        return items.map(item => {
            let span = item.querySelector('.ant-menu-title-content');
            let text = span ? span.textContent.trim() : '';
            let isFolder = item.classList.contains('ant-menu-submenu');
            return { text, isFolder, isOpen: item.classList.contains('ant-menu-submenu-open') };
        });
    }
    """
    return page.evaluate(js)

def click_file(page, filename):
    """Click a file item in the menu by its exact text."""
    js = f"""
    () => {{
        let spans = Array.from(document.querySelectorAll('li.ant-menu-item .ant-menu-title-content'));
        let target = spans.find(s => s.textContent.trim() === {json.dumps(filename)});
        if (!target) return false;
        target.click();
        return true;
    }}
    """
    return page.evaluate(js)

def click_folder_to_expand(page, foldername):
    """Click a folder/submenu to expand it."""
    js = f"""
    () => {{
        let subs = Array.from(document.querySelectorAll('li.ant-menu-submenu .ant-menu-title-content'));
        let target = subs.find(s => s.textContent.trim() === {json.dumps(foldername)});
        if (!target) return false;
        let li = target.closest('li.ant-menu-submenu');
        if (!li.classList.contains('ant-menu-submenu-open')) {{
            target.click();
            return true;
        }}
        return false;
    }}
    """
    return page.evaluate(js)

def get_all_menu_items(page):
    """Get all current visible menu items with their depth."""
    js = """
    () => {
        let menu = document.querySelector('.menuList--Q2qe_c44, ul.ant-menu-root');
        if (!menu) return [];
        let result = [];
        
        function collectItems(ul, depth, pathParts) {
            let children = Array.from(ul.children);
            for (let li of children) {
                let titleSpan = li.querySelector(':scope > .ant-menu-submenu-title .ant-menu-title-content, :scope > .ant-menu-title-content');
                if (!titleSpan) continue;
                let name = titleSpan.textContent.trim();
                if (!name) continue;
                let isFolder = li.classList.contains('ant-menu-submenu');
                let isOpen = li.classList.contains('ant-menu-submenu-open');
                let currentPath = [...pathParts, name];
                result.push({ name, depth, isFolder, isOpen, path: currentPath.join('/') });
                if (isFolder && isOpen) {
                    let subUl = li.querySelector(':scope > ul.ant-menu-sub');
                    if (subUl) collectItems(subUl, depth + 1, currentPath);
                }
            }
        }
        
        collectItems(menu, 0, []);
        return result;
    }
    """
    return page.evaluate(js)

def expand_all_folders(page):
    """Recursively expand all folders."""
    for _ in range(10):  # max 10 passes
        items = get_all_menu_items(page)
        closed_folders = [item for item in items if item['isFolder'] and not item['isOpen']]
        if not closed_folders:
            break
        for folder in closed_folders:
            print(f"  Expanding folder: {folder['path']}")
            js = f"""
            () => {{
                let subs = Array.from(document.querySelectorAll('li.ant-menu-submenu'));
                for (let li of subs) {{
                    if (li.classList.contains('ant-menu-submenu-open')) continue;
                    let title = li.querySelector(':scope > .ant-menu-submenu-title .ant-menu-title-content');
                    if (title && title.textContent.trim() === {json.dumps(folder['name'])}) {{
                        title.click();
                        return true;
                    }}
                }}
                return false;
            }}
            """
            page.evaluate(js)
            page.wait_for_timeout(600)

def click_menu_item_by_path(page, path_parts):
    """Click the menu item matching all path parts."""
    js = f"""
    () => {{
        let pathParts = {json.dumps(path_parts)};
        let target_name = pathParts[pathParts.length - 1];
        let items = Array.from(document.querySelectorAll('li.ant-menu-item'));
        for (let li of items) {{
            let title = li.querySelector('.ant-menu-title-content');
            if (title && title.textContent.trim() === target_name) {{
                title.click();
                return true;
            }}
        }}
        return false;
    }}
    """
    return page.evaluate(js)

def save_file(path, content):
    """Save content to local file."""
    full_path = os.path.join(OUTPUT_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  SAVED: {path} ({len(content)} chars)")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with sync_playwright() as p:
        print("Connecting to browser via CDP...")
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        page = context.pages[0]
        
        # Navigate to code page
        print(f"Navigating to code page...")
        page.goto(CODE_URL)
        page.wait_for_timeout(3000)
        
        # Expand all folders
        print("Expanding all folders...")
        expand_all_folders(page)
        page.wait_for_timeout(1000)
        
        # Get all items
        items = get_all_menu_items(page)
        files = [item for item in items if not item['isFolder']]
        
        print(f"\nFound {len(files)} files:")
        for f in files:
            print(f"  {f['path']}")
        
        print(f"\nStarting to copy files...")
        saved_count = 0
        failed = []
        
        for file_item in files:
            name = file_item['name']
            path = file_item['path']
            print(f"\nClicking: {path}")
            
            clicked = click_menu_item_by_path(page, path.split('/'))
            if not clicked:
                print(f"  WARNING: Could not click {path}")
                failed.append(path)
                continue
            
            # Wait for editor to load
            page.wait_for_timeout(1500)
            
            content = get_editor_content(page)
            
            if content is None:
                print(f"  WARNING: No editor content for {path}")
                failed.append(path)
                continue
            
            if content.startswith('ERROR:'):
                print(f"  WARNING: Editor error for {path}: {content}")
                failed.append(path)
                continue
            
            save_file(path, content)
            saved_count += 1
        
        print(f"\n{'='*50}")
        print(f"Done! Saved {saved_count}/{len(files)} files to {OUTPUT_DIR}")
        if failed:
            print(f"Failed ({len(failed)}): {failed}")
        
        browser.close()

if __name__ == '__main__':
    main()
