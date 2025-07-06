import React, { useState, useEffect } from 'react';
import './FeedbackCardsInterface.css';

function formatText(text) {
  if (!text) return '';
  let html = text;
  
  // Handle code blocks first
  html = html.replace(/``````/g, (match, lang, code) => {
    const cleanCode = code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre class="code-block"><code>${cleanCode}</code></pre>`;
  });
  
  // Handle inline code
  html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');
  
  // Handle bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle line breaks
  html = html.replace(/\n/g, '<br />');
  
  return html;
}

function generateQuestionSpecificFallback(topic, currentQuestion) {
  if (currentQuestion) {
    const q = currentQuestion.toLowerCase();
    
    if (q.includes('two sum') || (q.includes('array') && q.includes('target'))) {
      return `**Two Sum Problem Solution:**

**Problem:** Find two numbers in array that add up to target.

**Solution:**
\`\`\`python
def two_sum(nums, target):
    # Hash map approach - O(n) time
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []  # No solution found

# Test cases
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # [0, 1]
\`\`\`

**Time Complexity:** O(n) with hash map
**Space Complexity:** O(n) for hash map`;
    }
    
    if (q.includes('binary search')) {
      return `**Binary Search Implementation:**

**Approach:**
Binary search efficiently finds a target value in a sorted array by repeatedly dividing the search space in half.

**Code Example:**
\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Example usage
numbers = [1, 3, 5, 7, 9, 11, 13, 15]
result = binary_search(numbers, 7)
print(f"Found at index: {result}")  # Output: 3
\`\`\`

**Complexity Analysis:**
- Time Complexity: \`O(log n)\`
- Space Complexity: \`O(1)\`

**Key Points:**
- Array must be sorted
- Eliminates half the search space each iteration`;
    }
    
    if (q.includes('linked list')) {
      return `**Linked List Implementation:**

**Structure:**
A linked list consists of nodes where each node contains data and a reference to the next node.

**Code Example:**
\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert_at_beginning(self, val):
        new_node = ListNode(val)
        new_node.next = self.head
        self.head = new_node
    
    def delete_node(self, val):
        if not self.head:
            return
        
        if self.head.val == val:
            self.head = self.head.next
            return
        
        current = self.head
        while current.next and current.next.val != val:
            current = current.next
        
        if current.next:
            current.next = current.next.next

# Example usage
ll = LinkedList()
ll.insert_at_beginning(3)
ll.insert_at_beginning(2)
ll.insert_at_beginning(1)
\`\`\`

**Complexity Analysis:**
- Insert at beginning: \`O(1)\`
- Delete: \`O(n)\` worst case
- Search: \`O(n)\``;
    }
    
    if (q.includes('recursion')) {
      return `**Recursion Implementation:**

**Concept:**
Recursion is when a function calls itself to solve smaller instances of the same problem.

**Code Example:**
\`\`\`python
def factorial(n):
    # Base case
    if n <= 1:
        return 1
    
    # Recursive case
    return n * factorial(n - 1)

def fibonacci(n):
    # Base cases
    if n <= 1:
        return n
    
    # Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)

# Optimized fibonacci with memoization
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    
    if n <= 1:
        return n
    
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]

# Example usage
print(factorial(5))        # Output: 120
print(fibonacci(10))       # Output: 55
print(fibonacci_memo(50))  # Much faster for large n
\`\`\`

**Key Principles:**
- Always define a base case
- Each recursive call should move toward the base case`;
    }
    
    if (q.includes('sort') || q.includes('sorting')) {
      return `**Sorting Algorithm Implementation:**

**Quick Sort Example:**
\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_quick = quicksort(numbers.copy())
print(sorted_quick)  # [11, 12, 22, 25, 34, 64, 90]
\`\`\`

**Complexity Comparison:**
- Quick Sort: \`O(n log n)\` average, \`O(n²)\` worst
- Merge Sort: \`O(n log n)\` always, \`O(n)\` extra space`;
    }
    
    if (q.includes('reverse') && q.includes('linked list')) {
      return `**Reverse Linked List Solution:**

**Problem:** Reverse a singly linked list.

**Solution:**
\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    # Iterative approach
    prev = None
    current = head
    
    while current:
        next_temp = current.next  # Store next node
        current.next = prev       # Reverse the link
        prev = current           # Move prev forward
        current = next_temp      # Move current forward
    
    return prev  # New head

# Test
# Create: 1->2->3->4->5
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)

reversed_head = reverse_linked_list(head)
\`\`\`

**Time Complexity:** O(n)
**Space Complexity:** O(1)`;
    }
    
    if (q.includes('valid') && q.includes('parentheses')) {
      return `**Valid Parentheses Solution:**

**Problem:** Check if string has valid parentheses arrangement.

**Solution:**
\`\`\`python
def is_valid_parentheses(s):
    # Stack-based approach
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:  # Closing bracket
            if not stack or stack.pop() != mapping[char]:
                return False
        else:  # Opening bracket
            stack.append(char)
    
    return len(stack) == 0

# Test cases
test_cases = [
    "()",          # True
    "()[]{}",      # True
    "(]",          # False
    "([)]",        # False
    "{[]}",        # True
]

for test in test_cases:
    print(f"'{test}': {is_valid_parentheses(test)}")
\`\`\`

**Time Complexity:** O(n)
**Space Complexity:** O(n) for stack`;
    }
  }
  
  // Default fallback
  const sampleAnswers = {
    "Programming Concepts": `**Structured Problem-Solving Approach:**

**Step 1: Understanding the Problem**
- Read the requirements carefully
- Identify inputs, outputs, and constraints
- Consider edge cases and boundary conditions

**Step 2: Algorithm Design**
\`\`\`python
def solve_problem(input_data):
    # Input validation
    if not input_data or len(input_data) == 0:
        return []
    
    # Initialize result container
    result = []
    
    # Core algorithm logic
    for item in input_data:
        if is_valid(item):
            processed = transform(item)
            result.append(processed)
    
    return result

def is_valid(item):
    # Add validation logic
    return item is not None and item > 0

def transform(item):
    # Add transformation logic
    return item * 2

# Example usage
data = [1, 2, 3, 4, 5]
output = solve_problem(data)
print(output)  # [2, 4, 6, 8, 10]
\`\`\`

**Step 3: Complexity Analysis**
- Time Complexity: \`O(n)\` for linear processing
- Space Complexity: \`O(k)\` where k is number of valid items`,

    "System Design": `**System Design Approach:**

**Step 1: Requirements Analysis**
- Functional requirements (what the system should do)
- Non-functional requirements (performance, scalability)
- Constraints and assumptions

**Step 2: High-Level Architecture**
\`\`\`python
class DistributedSystem:
    def __init__(self):
        self.load_balancer = LoadBalancer()
        self.app_servers = ServerPool(size=5)
        self.database = DatabaseCluster()
        self.cache = RedisCluster()
        self.message_queue = MessageQueue()
    
    def handle_request(self, request):
        # Route through load balancer
        server = self.load_balancer.get_server()
        
        # Check cache first
        cache_key = f"request_{request.id}"
        cached = self.cache.get(cache_key)
        
        if cached:
            return cached
        
        # Process request
        result = server.process(request)
        
        # Cache result
        self.cache.set(cache_key, result, ttl=300)
        
        return result
\`\`\`

**Scalability Patterns:**
- Horizontal scaling with load balancers
- Database sharding for large datasets`,

    "HR": `**HR Problem Resolution Framework:**

**Step 1: Assessment & Investigation**
\`\`\`
Information Gathering:
├── Interview all stakeholders separately
├── Document facts and timeline objectively
├── Review applicable policies
└── Assess impact on team/organization
\`\`\`

**Step 2: Solution Development**
\`\`\`python
class ConflictResolution:
    def __init__(self):
        self.stakeholders = []
        self.facts = []
        self.solutions = []
    
    def analyze_situation(self, case):
        # Gather information
        self.stakeholders = self.identify_parties(case)
        self.facts = self.document_timeline(case)
        
        # Generate solutions
        self.solutions = self.create_solutions()
        
        return self.evaluate_options()
    
    def implement_solution(self, solution):
        # Clear communication
        self.notify_all_parties(solution)
        
        # Documentation
        self.record_decision(solution)
        
        # Follow-up
        self.schedule_monitoring(solution)
\`\`\`

**Success Metrics:**
- Resolution time < 2 weeks
- Employee satisfaction scores
- No recurrence within 6 months`
  };

  return sampleAnswers[topic] || sampleAnswers["Programming Concepts"];
}

const FeedbackCardsInterface = ({ feedbackData }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    if (feedbackData?.score) {
      const timer = setTimeout(() => setAnimatedScore(feedbackData.score), 500);
      return () => clearTimeout(timer);
    }
  }, [feedbackData?.score]);

  useEffect(() => {
    if (feedbackData?.confidence) {
      const timer = setTimeout(() => setAnimatedConfidence(feedbackData.confidence), 700);
      return () => clearTimeout(timer);
    }
  }, [feedbackData?.confidence]);

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (!feedbackData) return null;

  const safeFeedbackData = {
    score: feedbackData?.score || 0,
    confidence: feedbackData?.confidence || 0,
    feedback: feedbackData?.feedback || "No feedback available",
    confidenceFeedback: feedbackData?.confidenceFeedback || "Unable to analyze confidence",
    suggestedAnswer: feedbackData?.suggestedAnswer || generateQuestionSpecificFallback(feedbackData?.topic || "Programming Concepts", feedbackData?.currentQuestion),
    topic: feedbackData?.topic || "Programming Concepts",
    strengths: feedbackData?.strengths || [],
    improvements: feedbackData?.improvements || []
  };

  return (
    <div className="feedback-cards-container">
      {/* Primary Score Card */}
      <div className="score-card-primary">
        <div className="score-circle-container">
          <div className="score-circle">
            <svg className="score-progress" viewBox="0 0 100 100">
              <circle
                className="score-progress-bg"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              <circle
                className="score-progress-fill"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getScoreColor(safeFeedbackData.score)}
                strokeWidth="8"
                strokeDasharray={`${(animatedScore / 100) * 283} 283`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="score-content">
              <div className="score-number">{animatedScore}</div>
              <div className="score-label">{getScoreLabel(safeFeedbackData.score)}</div>
            </div>
          </div>
        </div>
        <div className="confidence-indicator">
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ 
                width: `${animatedConfidence}%`,
                backgroundColor: getScoreColor(safeFeedbackData.confidence)
              }}
            />
          </div>
          <span className="confidence-text">Confidence: {animatedConfidence}%</span>
        </div>
      </div>

      {/* Feedback Grid */}
      <div className="feedback-grid">
        {/* Clarity Card */}
        <div className="feedback-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">🎯</span>
              Clarity & Communication
            </h3>
            <div className={`card-score ${safeFeedbackData.confidence >= 70 ? 'good' : safeFeedbackData.confidence >= 50 ? 'medium' : 'poor'}`}>
              {safeFeedbackData.confidence}/100
            </div>
          </div>
          <div className="card-content">
            <p className="card-description">
              {safeFeedbackData.confidenceFeedback}
            </p>
            <button 
              className="expand-button"
              onClick={() => toggleCard('clarity')}
            >
              {expandedCards.clarity ? 'Hide Details' : 'Show Details'}
            </button>
            {expandedCards.clarity && (
              <div className="card-details">
                <div className="strengths-section">
                  <h4>Strengths:</h4>
                  <ul>
                    {safeFeedbackData.strengths.length > 0 ? (
                      safeFeedbackData.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))
                    ) : (
                      <li>Good communication attempt</li>
                    )}
                  </ul>
                </div>
                <div className="improvements-section">
                  <h4>Areas for Improvement:</h4>
                  <ul>
                    {safeFeedbackData.improvements.length > 0 ? (
                      safeFeedbackData.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))
                    ) : (
                      <li>Work on clarity and detail</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical Depth Card */}
        <div className="feedback-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">⚙️</span>
              Technical Depth
            </h3>
            <div className={`card-score ${safeFeedbackData.score >= 70 ? 'good' : safeFeedbackData.score >= 50 ? 'medium' : 'poor'}`}>
              {safeFeedbackData.score}/100
            </div>
          </div>
          <div className="card-content">
            <div
              className="card-description"
              dangerouslySetInnerHTML={{ __html: formatText(safeFeedbackData.feedback) }}
            />
            <button 
              className="expand-button"
              onClick={() => toggleCard('technical')}
            >
              {expandedCards.technical ? 'Hide Details' : 'Show Details'}
            </button>
            {expandedCards.technical && (
              <div className="card-details">
                <div className="strengths-section">
                  <h4>Technical Strengths:</h4>
                  <ul>
                    {safeFeedbackData.strengths.length > 0 ? (
                      safeFeedbackData.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))
                    ) : (
                      <>
                        <li>Demonstrated understanding of core concepts</li>
                        <li>Appropriate use of technical terminology</li>
                        <li>Logical problem-solving approach</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="improvements-section">
                  <h4>Technical Improvements:</h4>
                  <ul>
                    {safeFeedbackData.improvements.length > 0 ? (
                      safeFeedbackData.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))
                    ) : (
                      <>
                        <li>Include more specific examples</li>
                        <li>Explain implementation details</li>
                        <li>Discuss trade-offs and alternatives</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Best Practice Structure Card */}
        <div className="feedback-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">📋</span>
              Best Practice Structure
            </h3>
            <div className={`card-score ${safeFeedbackData.score >= 65 ? 'good' : safeFeedbackData.score >= 45 ? 'medium' : 'poor'}`}>
              {Math.round(safeFeedbackData.score * 0.8)}/100
            </div>
          </div>
          <div className="card-content">
            <p className="card-description">
              Evaluation of how well your answer follows interview best practices and structure.
            </p>
            <button 
              className="expand-button"
              onClick={() => toggleCard('structure')}
            >
              {expandedCards.structure ? 'Hide Details' : 'Show Details'}
            </button>
            {expandedCards.structure && (
              <div className="card-details">
                <div className="strengths-section">
                  <h4>Structural Strengths:</h4>
                  <ul>
                    <li>Clear beginning and conclusion</li>
                    <li>Logical flow of ideas</li>
                    <li>Appropriate answer length</li>
                  </ul>
                </div>
                <div className="improvements-section">
                  <h4>Structural Improvements:</h4>
                  <ul>
                    <li>Use the STAR method for behavioral questions</li>
                    <li>Provide concrete examples</li>
                    <li>Summarize key points at the end</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Topic Coverage Card */}
        <div className="feedback-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">📚</span>
              Topic Coverage
            </h3>
            <div className="card-badge">
              {safeFeedbackData.topic}
            </div>
          </div>
          <div className="card-content">
            <p className="card-description">
              Key areas covered in your response and recommended focus areas.
            </p>
            <button 
              className="expand-button"
              onClick={() => toggleCard('topics')}
            >
              {expandedCards.topics ? 'Hide Details' : 'Show Details'}
            </button>
            {expandedCards.topics && (
              <div className="card-details">
                <div className="covered-topics">
                  <h4>Topics Covered:</h4>
                  <div className="topic-tags">
                    <span className="topic-tag">Core Concepts</span>
                    <span className="topic-tag">Problem Solving</span>
                    <span className="topic-tag">Implementation</span>
                  </div>
                </div>
                <div className="recommended-topics">
                  <h4>Recommended Study Areas:</h4>
                  <ul>
                    <li>Advanced algorithms and data structures</li>
                    <li>System design principles</li>
                    <li>Code optimization techniques</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sample Strong Answer Approach Card */}
      <div className="feedback-card suggested-answer-card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-icon">💡</span>
            Sample Strong Answer Approach
          </h3>
        </div>
        <div className="card-content">
          <div className="suggested-answer-content">
            <div
              className="suggested-answer-text"
              dangerouslySetInnerHTML={{ __html: formatText(safeFeedbackData.suggestedAnswer) }}
            />
          </div>
          <div className="next-steps">
            <h4>Key Takeaways:</h4>
            <div className="next-steps-grid">
              <div className="next-step-item">
                <span className="step-number">1</span>
                <span className="step-text">Structure your response clearly</span>
              </div>
              <div className="next-step-item">
                <span className="step-number">2</span>
                <span className="step-text">Include specific code examples</span>
              </div>
              <div className="next-step-item">
                <span className="step-number">3</span>
                <span className="step-text">Demonstrate best practices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCardsInterface;
