#!/usr/bin/env python3
import re
import os

def fix_lesson_file(filename):
    """Remove hardcoded code examples and all code-header divs"""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match <pre><code>...</code></pre> blocks
    pattern = r'<pre><code>.*?</code></pre>'
    
    # Replace with empty code-block div
    replacement = '''<div class="code-block">
                    </div>'''
    
    # Remove all hardcoded examples
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Remove all code-header divs
    header_pattern = r'<div class="code-header">\s*<span>Python</span>\s*<button class="copy-btn" onclick="copyCode\(this\)">📋 Copy</button>\s*</div>'
    content = re.sub(header_pattern, '', content)
    
    # Fix nested code-block divs
    nested_pattern = r'<div class="code-block">\s*<div class="code-block">\s*</div>\s*</div>'
    single_replacement = '''<div class="code-block">
                    </div>'''
    
    content = re.sub(nested_pattern, single_replacement, content, flags=re.DOTALL)
    
    # Write back to file
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed {filename}")

def main():
    """Process all lesson HTML files"""
    lesson_files = [
        'lesson1.html', 'lesson2.html', 'lesson3.html', 'lesson4.html', 'lesson5.html',
        'lesson6.html', 'lesson7.html', 'lesson8.html', 'lesson9.html', 'lesson10.html',
        'lesson11.html', 'lesson12.html', 'lesson13.html', 'lesson14.html'
    ]
    
    for filename in lesson_files:
        if os.path.exists(filename):
            fix_lesson_file(filename)
        else:
            print(f"File {filename} not found")

if __name__ == "__main__":
    main() 