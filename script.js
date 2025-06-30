// Global function for Brython to call - defined immediately at script load
window.addToOutput = function(text) {
    if (window.pythonOutput === undefined) {
        window.pythonOutput = '';
    }
    window.pythonOutput += text + '\n';
};

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile menu toggle button to all pages
    const body = document.body;
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Only add on lesson pages (not index)
    if (window.location.pathname.includes('lesson')) {
        body.insertBefore(mobileToggle, body.firstChild);
        
        const sidebar = document.querySelector('.sidebar');
        
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (!sidebar.contains(event.target) && !mobileToggle.contains(event.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add copy functionality to code blocks
    document.querySelectorAll('.code-block').forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋';
        copyButton.setAttribute('aria-label', 'Copy code');
        copyButton.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 3rem;
            background: #667eea;
            color: white;
            border: none;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.7rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });
        
        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0.7';
        });
        
        copyButton.addEventListener('click', async () => {
            const code = block.textContent.trim();
            try {
                await navigator.clipboard.writeText(code);
                copyButton.innerHTML = '✅';
                setTimeout(() => {
                    copyButton.innerHTML = '📋';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                copyButton.innerHTML = '❌';
                setTimeout(() => {
                    copyButton.innerHTML = '📋';
                }, 2000);
            }
        });
        
        block.appendChild(copyButton);
    });
    
    // Add keyboard navigation - REMOVED
    /*
    document.addEventListener('keydown', function(e) {
        // Left arrow key - previous lesson
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.altKey) {
            const prevButton = document.querySelector('.nav-button.prev');
            if (prevButton && !prevButton.classList.contains('disabled')) {
                window.location.href = prevButton.href;
            }
        }
        
        // Right arrow key - next lesson
        if (e.key === 'ArrowRight' && !e.ctrlKey && !e.altKey) {
            const nextButton = document.querySelector('.nav-button.next');
            if (nextButton && !nextButton.classList.contains('disabled')) {
                window.location.href = nextButton.href;
            }
        }
        
        // Escape key - close mobile menu
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
            }
        }
    });
    */
    
    // Keep only the Escape key functionality for mobile menu
    document.addEventListener('keydown', function(e) {
        // Escape key - close mobile menu
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Add lesson progress indicator
    if (window.location.pathname.includes('lesson')) {
        const currentLesson = window.location.pathname.split('/').pop().replace('.html', '');
        const lessonNumber = currentLesson.replace('lesson', '');
        const totalLessons = 14;
        const progress = (parseInt(lessonNumber) / totalLessons) * 100;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 280px;
            right: 0;
            height: 3px;
            background: #e0e0e0;
            z-index: 1000;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #666, #999);
            width: ${progress}%;
            transition: width 0.3s ease;
        `;
        
        progressBar.appendChild(progressFill);
        body.appendChild(progressBar);
        
        // Adjust for mobile
        if (window.innerWidth <= 768) {
            progressBar.style.left = '0';
        }
    }
    
    // Load lesson-specific examples
    loadCurrentLessonExamples();
    
    // Initialize line numbers for code editor
    initializeLineNumbers();
    
    // Add line numbers to code examples after a short delay (for all pages)
    setTimeout(() => {
        addLineNumbersToCodeExamples();
    }, 200);
});

// Initialize line numbers functionality
function initializeLineNumbers() {
    const codeEditor = document.getElementById('pythonCode');
    const lineNumbers = document.getElementById('lineNumbers');
    
    if (!codeEditor || !lineNumbers) return;
    
    // Update line numbers
    function updateLineNumbers() {
        const lines = codeEditor.value.split('\n');
        const lineCount = lines.length;
        
        let lineNumbersText = '';
        for (let i = 1; i <= lineCount; i++) {
            lineNumbersText += i + '\n';
        }
        
        lineNumbers.textContent = lineNumbersText.slice(0, -1); // Remove last newline
    }
    
    // Sync scroll between line numbers and editor
    function syncScroll() {
        if (lineNumbers && codeEditor) {
            lineNumbers.scrollTop = codeEditor.scrollTop;
        }
    }
    
    // Initialize line numbers
    updateLineNumbers();
    
    // Add event listeners
    codeEditor.addEventListener('input', updateLineNumbers);
    codeEditor.addEventListener('scroll', syncScroll);
    codeEditor.addEventListener('keydown', function(e) {
        // Update line numbers after a brief delay for key events that change content
        if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
            setTimeout(updateLineNumbers, 10);
        }
    });
}

// Add CSS for new elements
const style = document.createElement('style');
style.textContent = `
    .copy-button:hover {
        opacity: 1 !important;
    }
    
    @media (max-width: 768px) {
        .progress-bar {
            left: 0 !important;
        }
    }
`;
document.head.appendChild(style);

// Python Runner Frame Management
function togglePythonRunner() {
    const runnerFrame = document.querySelector('.python-runner-frame');
    const toggleButton = document.querySelector('.runner-toggle');
    
    if (runnerFrame.classList.contains('collapsed')) {
        runnerFrame.classList.remove('collapsed');
        toggleButton.innerHTML = '◀';
    } else {
        runnerFrame.classList.add('collapsed');
        toggleButton.innerHTML = '▶';
    }
}

function clearPythonCode() {
    const codeEditor = document.getElementById('pythonCode');
    const outputDisplay = document.getElementById('output');
    
    if (codeEditor) {
        codeEditor.value = '';
    }
    
    if (outputDisplay) {
        outputDisplay.innerHTML = '<em>Click "Run Code" to see the output here</em>';
        outputDisplay.className = 'output-display';
    }
}

function loadLessonExamples(lessonNumber) {
    const codeEditor = document.getElementById('pythonCode');
    const lessonCodeBlocks = document.querySelectorAll('.code-block');
    
    const examples = {
        1: [
            `print("Hello, World!")`,
            `# Print a simple message
print("Hello, World!")

# Print multiple items
print("Welcome", "to", "Python!")

# Print with newlines
print("Line 1\\nLine 2")`,
            `Hello, World!
Welcome to Python!
Line 1
Line 2`,
            `# This is a comment
print("This is code")`,
            `print("This is a string")
print('This is also a string')`,
            `print("Hello")  # Function call`
        ],
        2: [
            `# Creating variables
name = "Alice"
age = 25
height = 1.75
is_student = True

print("Name:", name)
print("Age:", age)
print("Height:", height, "meters")
print("Is student:", is_student)`,
            `x = 10
print("Integer:", x)
print("Type:", type(x))`,
            `pi = 3.14
print("Float:", pi)
print("Type:", type(pi))`,
            `name = "John"
print("String:", name)
print("Type:", type(name))`,
            `is_active = True
print("Boolean:", is_active)
print("Type:", type(is_active))`,
            `# Different data types
x = 10
y = 3.14
text = "Hello"
flag = False

print("Integer:", x, type(x))
print("Float:", y, type(y))
print("String:", text, type(text))
print("Boolean:", flag, type(flag))`,
            `# Converting between types
number = "42"
converted = int(number)
print("Original:", number, type(number))
print("Converted:", converted, type(converted))`,
            `# More type conversions
text = "3.14"
float_num = float(text)
print("String to float:", float_num)

number = 42
text_num = str(number)
print("Number to string:", text_num, type(text_num))`,
            `# Variable assignment
name = "Alice"
age = 25`,
            `# Type checking
x = 42
print(type(x))`,
            `# Type conversion
text = "123"
number = int(text)
print(number)`
        ],
        3: [
            `# Basic arithmetic
a = 10
b = 3

print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)
print("Floor division:", a // b)
print("Modulus:", a % b)
print("Exponentiation:", a ** b)`,
            `# String operations
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name
print("Full name:", full_name)

# String repetition
separator = "-" * 20
print(separator)
print("Repeated text:", "Python! " * 3)`,
            `# Addition & Subtraction
x = 15
y = 7
print(x + y)  # 22
print(x - y)  # 8`,
            `# Multiplication & Division
a = 12
b = 4
print(a * b)   # 48
print(a / b)   # 3.0
print(a % 5)   # 2 (remainder)`,
            `# String operations
greeting = "Hello"
name = "World"
message = greeting + " " + name
print(message)
print("Python! " * 3)`
        ],
        4: [
            `# You can use either single or double quotes
first = "Alice"    # Double quotes
last = 'Smith'     # Single quotes
print(first + " " + last)

# Both work the same way
message1 = "Hello World"
message2 = 'Hello World'
print(message1)
print(message2)`,
            `text = "hello world"
print(text.upper())
print(text.capitalize())`,
            `HELLO WORLD
Hello World`,
            `name = "Alice"
age = 25
print(f"{name} is {age} years old")`,
            `# String concatenation
first = "John"
last = "Doe"
full = first + " " + last
print(full)`,
            `# String methods
text = "python programming"
print(text.upper())
print(text.capitalize())
print(text.title())`,
            `# Escaping quotes and special characters
quote1 = "She said, \\"Hello there!\\""
quote2 = 'It\\'s a beautiful day!'
newline = "Line 1\\nLine 2"
print(quote1)
print(quote2)
print(newline)`,
            `# F-string formatting
name = "Alice"
age = 30
score = 95.5
print(f"Hi, I'm {name} and I'm {age}")
print(f"My score is {score}%")`
        ],
        5: [
            `name = input("Enter your name: ")
print("Hello, " + name + "!")`,
            `age = int(input("Enter your age: "))
print("You are", age, "years old.")`,
            `num = int(input("Number: "))
result = num * 2
print("Double:", result)`,
            `# Getting input
name = input("What's your name? ")
print("Nice to meet you,", name)`,
            `# Converting input
age_text = input("How old are you? ")
age = int(age_text)
print("Age:", age)`,
            `# Using input in calculations
x = int(input("Enter a number: "))
result = x * 3
print("Triple:", result)`
        ],
        6: [
            `age = 20
if age >= 18:
    print("You are an adult.")
else:
    print("You are a minor.")`,
            `num = -3
if num > 0:
    print("Positive number")
elif num < 0:
    print("Negative number")
else:
    print("Zero")`,
            `score = 85
if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")`,
            `# If statement
temperature = 25
if temperature > 20:
    print("It's warm!")`,
            `# If-else statement
number = 7
if number % 2 == 0:
    print("Even")
else:
    print("Odd")`,
            `# If-elif-else chain
grade = 85
if grade >= 90:
    print("A")
elif grade >= 80:
    print("B")
else:
    print("C")`
        ],
        7: [
            `# Simple while loop example
count = 1
while count <= 5:
    print(f"Count: {count}")
    count += 1

print("Loop finished!")`,
            `# Random numbers
import random
number = random.randint(1, 10)
print("Random number:", number)`,
            `# While loop
count = 1
while count <= 3:
    print("Attempt", count)
    count += 1`,
            `# Break statement
while True:
    answer = input("Type 'quit' to exit: ")
    if answer == "quit":
        break
    print("You typed:", answer)`
        ],
        8: [
            `fruits = ["apple", "banana", "cherry"]
print("Fruits:", fruits)`,
            `fruits = ["apple", "banana", "cherry"]
fruits.append("grape")
print("After adding grape:", fruits)`,
            `fruits = ["apple", "banana", "cherry"]
print("First fruit:", fruits[0])
print("Last fruit:", fruits[-1])`,
            `fruits = ["apple", "banana", "cherry"]
print("Number of fruits:", len(fruits))`,
            `# Creating lists
colors = ["red", "green", "blue"]
numbers = [1, 2, 3, 4, 5]
print(colors)`,
            `# Accessing elements
animals = ["cat", "dog", "bird"]
print("First:", animals[0])
print("Second:", animals[1])`,
            `# Adding elements
pets = ["cat", "dog"]
pets.append("fish")
print("Updated list:", pets)`
        ],
        9: [
            `for i in range(5):
    print(f"Number: {i}")`,
            `0
1
2
3
4`,
            `for fruit in ["apple", "banana"]:
    print(f"I like {fruit}")`,
            `apple
banana`,
            `numbers = [1, 2, 3]
for num in numbers:
    print(num * 2)`,
            `# Range loops
for i in range(3):
    print("Hello", i)`,
            `# List loops
fruits = ["apple", "banana"]
for fruit in fruits:
    print("Fruit:", fruit)`,
            `# Loop calculations
total = 0
for num in [1, 2, 3, 4]:
    total += num
print("Sum:", total)`
        ],
        10: [
            `# Defining a function
def greet(name):
    print(f"Hello, {name}!")

# Calling the function
greet("Alice")
greet("Bob")`,
            `# Function with parameters and return value
def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print("Sum:", result)`,
            `# Function with default parameters
def greet_with_title(name, title="Mr."):
    print(f"Hello, {title} {name}!")

greet_with_title("Smith")
greet_with_title("Johnson", "Dr.")`,
            `# Function with multiple return values
def get_name_and_age():
    return "Alice", 25

name, age = get_name_and_age()
print(f"Name: {name}, Age: {age}")`,
            `# Defining functions
def say_hello():
    print("Hello!")

say_hello()`,
            `# Return values
def multiply(x, y):
    return x * y

result = multiply(4, 5)
print(result)`,
            `# Parameters
def greet_person(name, age):
    print(f"Hi {name}, you are {age}")

greet_person("Alice", 25)`
        ],
        11: [
            `person = {"name": "Alice", "age": 25}
print("Person:", person)`,
            `person = {"name": "Alice", "age": 25}
print("Name:", person["name"])
print("Age:", person["age"])`,
            `person = {"name": "Alice", "age": 25}
person["job"] = "Engineer"
print("After adding job:", person)`,
            `person = {"name": "Alice", "age": 25}
person["age"] = 26
print("After updating age:", person)`,
            `# Creating dictionaries
student = {"name": "Bob", "grade": 85}
print(student)`,
            `# Accessing values
car = {"brand": "Toyota", "year": 2020}
print("Brand:", car["brand"])`,
            `# Adding/updating
book = {"title": "Python Guide"}
book["author"] = "Jane Doe"
print(book)`
        ],
        12: [
            `# Basic exception handling
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("Error: Please enter a valid number.")
except ZeroDivisionError:
    print("Error: Cannot divide by zero.")
except Exception as e:
    print(f"An error occurred: {e}")`,
            `# Custom exception
try:
    with open("example.txt", "r") as file:
        content = file.read()
        print("File content:", content)
except FileNotFoundError:
    print("Error: File not found.")
except PermissionError:
    print("Error: Permission denied.")`,
            `# Try-except blocks
try:
    x = int("abc")
except ValueError:
    print("Invalid number!")`,
            `# Specific exceptions
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
except ValueError:
    print("Invalid value!")`,
            `# File handling
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found!")`
        ],
        13: [
            `# Simple function with conditional logic
def check_weather(temperature):
    if temperature > 25:
        print("It's hot today!")
    elif temperature > 15:
        print("It's nice weather!")
    else:
        print("It's cold today!")

# Test the function
check_weather(30)
check_weather(20)
check_weather(10)`,
            `# Story branching
choice = input("Go left or right? ")
if choice == "left":
    print("You found treasure!")
else:
    print("You met a dragon!")`,
            `# User interaction
name = input("What's your name? ")
print(f"Welcome to the adventure, {name}!")`,
            `# Game organization
def start_game():
    print("Welcome to the adventure!")
    choice = input("Enter the cave? (y/n): ")
    if choice == "y":
        print("You're brave!")

start_game()`
        ],
        14: [
            `# Simple function with user input
def greet_user():
    name = input("What is your name? ")
    print(f"Hello, {name}! Welcome to Python!")

# Call the function
greet_user()`,
            `# Score tracking
score = 0
correct_answers = 3
total_questions = 5
percentage = (correct_answers / total_questions) * 100
print(f"Score: {percentage}%")`,
            `# Question functions
def ask_question(question, answer):
    user_answer = input(question + " ")
    if user_answer.lower() == answer.lower():
        print("Correct!")
        return 1
    else:
        print("Wrong!")
        return 0`,
            `# Final results
def show_results(score, total):
    percentage = (score / total) * 100
    print(f"Final score: {score}/{total}")
    print(f"Percentage: {percentage}%")
    if percentage >= 80:
        print("Excellent!")
    else:
        print("Keep practicing!")`
        ]
    };
    
    if (examples[lessonNumber]) {
        const lessonExamples = examples[lessonNumber];
        
        // Code editor starts empty - no prepopulated code
        
        // Load into lesson content code blocks
        lessonCodeBlocks.forEach((codeBlock, index) => {
            if (lessonExamples[index]) {
                const exampleCode = lessonExamples[index].replace(/\\n/g, '\n');
                // Set the text content directly
                codeBlock.textContent = exampleCode;
            }
        });
    }
}

// Real Python interpreter using Brython
let brythonLoaded = false;
let brythonInitializing = false;

// Initialize Brython
async function initializePython() {
    if (brythonLoaded) return; // Already initialized
    if (brythonInitializing) return; // Already initializing
    
    brythonInitializing = true;
    
    try {
        // Check if Brython is already available globally
        if (typeof brython !== 'undefined') {
            brythonLoaded = true;
            brythonInitializing = false;
            console.log('Brython already available');
            return;
        }
        
        // Load Brython from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/brython@3.12.0/brython.min.js';
        script.async = true;
        
        script.onload = async () => {
            try {
                // Wait a bit for Brython to fully initialize
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Check if brython function is available
                if (typeof brython === 'function') {
                    brythonLoaded = true;
                    console.log('Brython loaded successfully');
                } else {
                    throw new Error('Brython function not available');
                }
            } catch (error) {
                console.error('Failed to initialize Brython:', error);
                brythonLoaded = false;
            } finally {
                brythonInitializing = false;
            }
        };
        
        script.onerror = () => {
            console.error('Failed to load Brython script');
            brythonLoaded = false;
            brythonInitializing = false;
        };
        
        document.head.appendChild(script);
        
    } catch (error) {
        console.error('Failed to initialize Python:', error);
        brythonLoaded = false;
        brythonInitializing = false;
    }
}

// Update the existing runPythonCode function to work with Brython
async function runPythonCode() {
    const codeEditor = document.getElementById('pythonCode');
    const outputDisplay = document.getElementById('output');
    const runButton = document.querySelector('.run-button');
    
    if (!codeEditor || !outputDisplay) return;
    
    const code = codeEditor.value.trim();
    if (!code) {
        outputDisplay.textContent = 'Please enter some Python code to run.';
        outputDisplay.className = 'output-display error';
        return;
    }
    
    // Update button state
    runButton.innerHTML = '<span>⏳ Running...</span>';
    runButton.disabled = true;
    outputDisplay.textContent = 'Initializing Python interpreter...';
    outputDisplay.className = 'output-display';
    
    try {
        // Initialize Brython if not already done
        if (!brythonLoaded) {
            await initializePython();
            
            // Wait for initialization to complete
            let attempts = 0;
            while (!brythonLoaded && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!brythonLoaded) {
                throw new Error('Failed to initialize Python interpreter');
            }
        }
        
        outputDisplay.textContent = 'Running your code...';
        
        // Reset output
        window.pythonOutput = '';
        
        try {
            // Run the Python code using Brython's proper API
            if (typeof brython === 'function') {
                // Capture console errors
                let consoleErrors = [];
                const originalConsoleError = console.error;
                console.error = function(...args) {
                    consoleErrors.push(args.join(' '));
                    originalConsoleError.apply(console, args);
                };
                
                // Create a script element with Python code that captures output
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/python';
                
                // Properly indent user code for the try block
                const indentedCode = code.split('\n').map(line => '    ' + line).join('\n');
                
                scriptElement.textContent = `
from browser import window

# Override print function to capture output
original_print = print
def custom_print(*args, **kwargs):
    text = ' '.join(str(arg) for arg in args)
    window.addToOutput(text)

print = custom_print

# Execute the user's code
try:
${indentedCode}
except Exception as e:
    window.addToOutput(f"Error: {str(e)}")
`;
                
                // Append to body temporarily
                document.body.appendChild(scriptElement);
                
                // Trigger Brython to process the script
                try {
                    brython();
                } catch (brythonError) {
                    // Capture any immediate errors from brython() call
                    window.addToOutput(`Error: ${brythonError.message}`);
                }
                
                // Wait a bit for Brython to execute
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Restore console.error
                console.error = originalConsoleError;
                
                // Remove the script element after execution
                document.body.removeChild(scriptElement);
                
                // Check for console errors that might indicate syntax errors
                const pythonErrors = consoleErrors.filter(error => 
                    error.includes('SyntaxError') || 
                    error.includes('IndentationError') || 
                    error.includes('NameError') ||
                    error.includes('TypeError') ||
                    error.includes('Traceback')
                );
                
                // Get the captured output
                const output = window.pythonOutput;
                
                if (pythonErrors.length > 0) {
                    // Extract error message from console
                    let errorMsg = pythonErrors[0];
                    if (errorMsg.includes('SyntaxError:')) {
                        errorMsg = errorMsg.split('SyntaxError:')[1].trim();
                    } else if (errorMsg.includes('IndentationError:')) {
                        errorMsg = errorMsg.split('IndentationError:')[1].trim();
                    }
                    outputDisplay.textContent = `Syntax Error: ${errorMsg}`;
                    outputDisplay.className = 'output-display error';
                } else if (output) {
                    // Remove only trailing newlines, preserve leading/internal whitespace
                    const cleanOutput = output.replace(/\n+$/, '');
                    outputDisplay.textContent = cleanOutput;
                    // Check if it's an error message
                    if (cleanOutput.trim().startsWith('Error:')) {
                        outputDisplay.className = 'output-display error';
                    } else {
                        outputDisplay.className = 'output-display success';
                    }
                } else {
                    outputDisplay.textContent = 'Code executed successfully (no output)';
                    outputDisplay.className = 'output-display success';
                }
            } else {
                throw new Error('Brython not properly initialized');
            }
        } catch (error) {
            console.error('Error running Python code:', error);
            
            // Check if we have any output from Brython
            const brythonOutput = window.pythonOutput;
            if (brythonOutput && brythonOutput.trim()) {
                // Remove only trailing newlines, preserve leading/internal whitespace
                const cleanOutput = brythonOutput.replace(/\n+$/, '');
                outputDisplay.textContent = cleanOutput;
                outputDisplay.className = 'output-display error';
            } else {
                // Format the error message
                let errorMessage = error.message;
                if (errorMessage.includes('Traceback')) {
                    // Extract the actual error from Python traceback
                    const lines = errorMessage.split('\n');
                    const lastLine = lines[lines.length - 1];
                    if (lastLine.includes(':')) {
                        errorMessage = lastLine;
                    }
                }
                
                outputDisplay.textContent = `Error: ${errorMessage}`;
                outputDisplay.className = 'output-display error';
            }
        } finally {
            // Clean up
            delete window.pythonOutput;
        }
        
    } catch (error) {
        console.error('Error running Python code:', error);
        
        // Format the error message
        let errorMessage = error.message;
        if (errorMessage.includes('Traceback')) {
            // Extract the actual error from Python traceback
            const lines = errorMessage.split('\n');
            const lastLine = lines[lines.length - 1];
            if (lastLine.includes(':')) {
                errorMessage = lastLine;
            }
        }
        
        outputDisplay.textContent = `Error: ${errorMessage}`;
        outputDisplay.className = 'output-display error';
    } finally {
        // Reset button state
        runButton.innerHTML = '<span>▶️ Run Code</span>';
        runButton.disabled = false;
    }
}

// Function to load examples for the current lesson
function loadCurrentLessonExamples() {
    const currentPage = window.location.pathname;
    let lessonNumber = null;
    
    // Extract lesson number from URL
    if (currentPage.includes('lesson1.html')) lessonNumber = 1;
    else if (currentPage.includes('lesson2.html')) lessonNumber = 2;
    else if (currentPage.includes('lesson3.html')) lessonNumber = 3;
    else if (currentPage.includes('lesson4.html')) lessonNumber = 4;
    else if (currentPage.includes('lesson5.html')) lessonNumber = 5;
    else if (currentPage.includes('lesson6.html')) lessonNumber = 6;
    else if (currentPage.includes('lesson7.html')) lessonNumber = 7;
    else if (currentPage.includes('lesson8.html')) lessonNumber = 8;
    else if (currentPage.includes('lesson9.html')) lessonNumber = 9;
    else if (currentPage.includes('lesson10.html')) lessonNumber = 10;
    else if (currentPage.includes('lesson11.html')) lessonNumber = 11;
    else if (currentPage.includes('lesson12.html')) lessonNumber = 12;
    else if (currentPage.includes('lesson13.html')) lessonNumber = 13;
    else if (currentPage.includes('lesson14.html')) lessonNumber = 14;
    
    if (lessonNumber) {
        loadLessonExamples(lessonNumber);
        
        // Add line numbers to code examples after a short delay
        setTimeout(() => {
            addLineNumbersToCodeExamples();
        }, 200);
    }
}

// Initialize the runner frame layout
function initializeRunnerLayout() {
    // No dynamic resizing needed - using fixed CSS layout
}

// Add line numbers to all code examples in the lesson content
function addLineNumbersToCodeExamples() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        // Skip if already has line numbers or is empty
        if (block.classList.contains('with-line-numbers') || !block.textContent.trim()) {
            return;
        }
        
        // Get the code content
        const codeElement = block.querySelector('code');
        let codeText = '';
        
        if (codeElement) {
            codeText = codeElement.textContent;
        } else {
            codeText = block.textContent;
        }
        
        // Skip if no content
        if (!codeText.trim()) return;
        
        // Clean up the text and preserve formatting
        const cleanText = codeText.trim();
        const lines = cleanText.split('\n');
        
        // Create line numbers for the gutter
        const lineNumbers = lines.map((_, index) => index + 1).join('\n');
        
        // Escape HTML characters but preserve whitespace and formatting
        const escapedText = cleanText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // Add line numbers class
        block.classList.add('with-line-numbers');
        
        // Create the new structure with separate gutter and content
        block.innerHTML = `
            <code>
                <div class="line-numbers-gutter">${lineNumbers}</div>
                <div class="code-content">${escapedText}</div>
            </code>
        `;
    });
} 