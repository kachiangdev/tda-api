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
    
    // Add keyboard navigation
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
            background: linear-gradient(90deg, #667eea, #764ba2);
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
});

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
    const lessonCodeBlock = document.querySelector('.code-block');
    
    const examples = {
        1: `# Try the examples from this lesson:

print("Hello, World!")

print("Welcome", "to", "Python!")

print("Line 1\\nLine 2")`,
        2: `# Try the examples from this lesson:

name = "Alice"

age = 25

height = 1.75

is_student = True

print("Name:", name)

print("Age:", age)

print("Height:", height, "meters")

print("Is student:", is_student)

# Try different data types

x = 10

y = 3.14

text = "Hello"

flag = False

print("Integer:", x)

print("Float:", y)

print("String:", text)

print("Boolean:", flag)`,
        3: `# Try the examples from this lesson:

# Basic arithmetic

a = 10

b = 3

print("Addition:", a + b)

print("Subtraction:", a - b)

print("Multiplication:", a * b)

print("Division:", a / b)

print("Floor division:", a // b)

print("Modulus:", a % b)

print("Exponentiation:", a ** b)

# String operations

first_name = "John"

last_name = "Doe"

full_name = first_name + " " + last_name

print("Full name:", full_name)

# String repetition

separator = "-" * 20

print(separator)

print("Repeated text:", "Python! " * 3)`,
        4: `# Try the examples from this lesson:

# String manipulation

first = "Alice"

last = "Smith"

print(first + " " + last)

text = "hello world"

print(text.upper())

print(text.capitalize())

name = "Alice"

age = 25

print(f"{name} is {age} years old")`,
        5: `# Try the examples from this lesson:

# Getting input from user

name = input("What is your name? ")

age = input("How old are you? ")

print(f"Hello, {name}! You are {age} years old.")

# Converting input to numbers

birth_year = int(input("What year were you born? "))

current_year = 2024

age_calculated = current_year - birth_year

print(f"You are approximately {age_calculated} years old.")`,
        6: `# Try the examples from this lesson:

# Conditions and if-else

age = 18

if age >= 18:
    print("You are an adult.")
else:
    print("You are a minor.")

# Multiple conditions

score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")

# Checking if a number is even or odd

number = 7

if number % 2 == 0:
    print(f"{number} is even")
else:
    print(f"{number} is odd")`,
        7: `# Try the examples from this lesson:

import random

# Number guessing game

secret_number = random.randint(1, 10)

attempts = 0

max_attempts = 3

print("I'm thinking of a number between 1 and 10.")

while attempts < max_attempts:
    guess = int(input("Enter your guess: "))
    attempts += 1
    
    if guess == secret_number:
        print(f"Congratulations! You guessed it in {attempts} attempts!")
        break
    elif guess < secret_number:
        print("Too low! Try again.")
    else:
        print("Too high! Try again.")
    
    if attempts == max_attempts:
        print(f"Game over! The number was {secret_number}.")`,
        8: `# Try the examples from this lesson:

# Working with lists

fruits = ["apple", "banana", "orange"]

print("Fruits:", fruits)

# Adding items

fruits.append("grape")

print("After adding grape:", fruits)

# Accessing items

print("First fruit:", fruits[0])

print("Last fruit:", fruits[-1])

# List length

print("Number of fruits:", len(fruits))

# Removing items

fruits.remove("banana")

print("After removing banana:", fruits)`,
        9: `# Try the examples from this lesson:

# For loops

fruits = ["apple", "banana", "orange"]

for fruit in fruits:
    print(f"I like {fruit}")

# While loops

count = 1

while count <= 5:
    print(f"Count: {count}")
    count += 1

# Range function

for i in range(3):
    print(f"Number: {i}")

# Loop with range

for i in range(1, 6):
    print(f"Step {i}")`,
        10: `# Try the examples from this lesson:

# Defining functions

def greet(name):
    print(f"Hello, {name}!")

# Calling functions

greet("Alice")

greet("Bob")

# Function with return value

def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)

print("Sum:", result)

# Function with default parameters

def greet_with_title(name, title="Mr."):
    print(f"Hello, {title} {name}!")

greet_with_title("Smith")

greet_with_title("Johnson", "Dr.")`,
        11: `# Try the examples from this lesson:

# Creating dictionaries

person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

print("Person:", person)

# Accessing values

print("Name:", person["name"])

print("Age:", person["age"])

# Adding new key-value pairs

person["job"] = "Engineer"

print("After adding job:", person)

# Updating values

person["age"] = 26

print("After updating age:", person)

# Dictionary methods

print("Keys:", list(person.keys()))

print("Values:", list(person.values()))`,
        12: `# Try the examples from this lesson:

# Basic error handling

try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("Error: Please enter a valid number.")
except ZeroDivisionError:
    print("Error: Cannot divide by zero.")
except Exception as e:
    print(f"An error occurred: {e}")

# File handling with error handling

try:
    with open("example.txt", "r") as file:
        content = file.read()
        print("File content:", content)
except FileNotFoundError:
    print("Error: File not found.")
except PermissionError:
    print("Error: Permission denied.")`,
        13: `# Try the examples from this lesson:

# Text adventure game

def start_adventure():
    print("=== THE MYSTERIOUS FOREST ===")
    print("You find yourself at the edge of a dark forest.")
    
    choice = input("Do you enter the forest? (yes/no): ").lower()
    
    if choice == "yes":
        print("You step into the forest. The trees close behind you.")
        print("You come to a fork in the path.")
        
        direction = input("Do you go left or right? ").lower()
        
        if direction == "left":
            print("You find a small cottage with a warm light inside.")
            print("A friendly old woman opens the door.")
            print("You have a wonderful evening and find your way home safely!")
            print("🎉 HAPPY ENDING: You made a new friend!")
        else:
            print("You discover a beautiful clearing with a magical fountain.")
            print("The water grants you the power of flight!")
            print("🌟 MAGICAL ENDING: You gained special powers!")
    else:
        print("You decide to stay at the edge of the forest.")
        print("🌅 ENDING: A quiet evening.")

# Start the adventure

start_adventure()`,
        14: `# Try the examples from this lesson:

# Mini quiz game

def ask_question(question, correct_answer):
    print(f"\\n{question}")
    user_answer = input("Your answer: ").lower().strip()
    return user_answer == correct_answer.lower()

def run_quiz():
    score = 0
    total_questions = 0
    
    print("Welcome to the Python Quiz!")
    print("Answer the following questions:")
    
    # Question 1
    if ask_question("What is the capital of France?", "Paris"):
        print("Correct! 🎉")
        score += 1
    else:
        print("Wrong! The answer is Paris.")
    total_questions += 1
    
    # Question 2
    if ask_question("What is 2 + 2?", "4"):
        print("Correct! 🎉")
        score += 1
    else:
        print("Wrong! The answer is 4.")
    total_questions += 1
    
    # Final score
    print(f"\\n🎯 Quiz Complete!")
    print(f"You got {score} out of {total_questions} questions correct!")
    
    percentage = (score / total_questions) * 100
    print(f"Your score: {percentage:.1f}%")

# Run the quiz

run_quiz()`
    };
    
    if (examples[lessonNumber]) {
        // Ensure proper line breaks are preserved
        const exampleCode = examples[lessonNumber].replace(/\\n/g, '\n');
        
        // Load into code editor if it exists
        if (codeEditor) {
            codeEditor.value = exampleCode;
            
            // Force the textarea to update its display
            codeEditor.style.height = 'auto';
            codeEditor.style.height = codeEditor.scrollHeight + 'px';
        }
        
        // Load into lesson content code block if it exists
        if (lessonCodeBlock) {
            // Split code into lines and create numbered lines
            const lines = exampleCode.split('\n');
            const numberedLines = lines.map(line => `<span class="code-line">${line}</span>`).join('');
            
            // Add line numbers class and create the code block
            lessonCodeBlock.classList.add('with-line-numbers');
            lessonCodeBlock.innerHTML = '<code>' + numberedLines + '</code>';
        }
    }
}

// Update the existing runPythonCode function to work with the new layout
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
    outputDisplay.textContent = 'Running your code...';
    outputDisplay.className = 'output-display';
    
    try {
        // Using Judge0 API for Python execution
        const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': 'demo', // This is a demo key - for production use a real API key
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
                language_id: 71, // Python 3
                source_code: code,
                stdin: ''
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit code');
        }
        
        const submission = await response.json();
        const token = submission.token;
        
        // Poll for results
        let result;
        for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                headers: {
                    'X-RapidAPI-Key': 'demo',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            });
            
            if (resultResponse.ok) {
                result = await resultResponse.json();
                if (result.status.id > 2) { // Status > 2 means processing is complete
                    break;
                }
            }
        }
        
        if (result) {
            if (result.status.id === 3) { // Accepted
                outputDisplay.textContent = result.stdout || 'Code executed successfully (no output)';
                outputDisplay.className = 'output-display success';
            } else if (result.status.id === 4) { // Wrong Answer
                outputDisplay.textContent = `Error: ${result.stderr || 'Wrong answer'}`;
                outputDisplay.className = 'output-display error';
            } else if (result.status.id === 5) { // Time Limit Exceeded
                outputDisplay.textContent = 'Error: Time limit exceeded';
                outputDisplay.className = 'output-display error';
            } else {
                outputDisplay.textContent = `Error: ${result.stderr || 'Unknown error occurred'}`;
                outputDisplay.className = 'output-display error';
            }
        } else {
            outputDisplay.textContent = 'Error: Could not get execution results';
            outputDisplay.className = 'output-display error';
        }
        
    } catch (error) {
        console.error('Error running Python code:', error);
        
        // Fallback: Simple client-side Python-like execution for basic operations
        try {
            outputDisplay.textContent = simulatePythonExecution(code);
            outputDisplay.className = 'output-display success';
        } catch (simError) {
            outputDisplay.textContent = `Error: ${error.message}\\n\\nNote: For full Python execution, you may need to use an external Python IDE.`;
            outputDisplay.className = 'output-display error';
        }
    } finally {
        // Reset button state
        runButton.innerHTML = '<span>▶️ Run Code</span>';
        runButton.disabled = false;
    }
}

// Simple client-side Python simulation for basic print statements
function simulatePythonExecution(code) {
    const lines = code.split('\n');
    let output = '';
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Handle print statements
        if (trimmedLine.startsWith('print(') && trimmedLine.endsWith(')')) {
            const content = trimmedLine.slice(6, -1); // Remove print( and )
            
            // Handle different print scenarios
            if (content.includes('"') || content.includes("'")) {
                // String literals
                const matches = content.match(/"([^"]*)"|'([^']*)'/g);
                if (matches) {
                    output += matches.map(m => m.slice(1, -1)).join(' ') + '\n';
                }
            } else if (content.includes('\\n')) {
                // Newline characters
                output += content.replace(/\\n/g, '\n');
            } else {
                // Simple text
                output += content + '\n';
            }
        }
    }
    
    return output || 'Code executed (simulated)';
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
    }
} 