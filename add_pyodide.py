#!/usr/bin/env python3
import re
import os

def add_brython_script(filename):
    """Add Brython script to HTML head section"""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if Brython script is already present
    if 'brython.min.js' in content:
        print(f"Brython already present in {filename}")
        return
    
    # Remove any existing Pyodide script
    content = re.sub(r'<script src="https://cdn\.jsdelivr\.net/pyodide/.*?"></script>\n?', '', content)
    
    # Add Brython script before closing head tag
    pattern = r'(<link rel="stylesheet" href="styles\.css">)'
    replacement = r'\1\n    <script src="https://cdn.jsdelivr.net/npm/brython@3.12.0/brython.min.js"></script>'
    
    content = re.sub(pattern, replacement, content)
    
    # Write back to file
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Added Brython to {filename}")

def main():
    """Process all lesson HTML files"""
    lesson_files = [
        'lesson1.html', 'lesson2.html', 'lesson3.html', 'lesson4.html', 'lesson5.html',
        'lesson6.html', 'lesson7.html', 'lesson8.html', 'lesson9.html', 'lesson10.html',
        'lesson11.html', 'lesson12.html', 'lesson13.html', 'lesson14.html'
    ]
    
    for filename in lesson_files:
        if os.path.exists(filename):
            add_brython_script(filename)
        else:
            print(f"File {filename} not found")

if __name__ == "__main__":
    main() 