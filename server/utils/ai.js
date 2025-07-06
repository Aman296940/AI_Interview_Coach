import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const perplexityKey = process.env.PERPLEXITY_API_KEY;

export function analyzeAnswer(question, answer) {
  return new Promise(async (resolve) => {
    try {
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: "You are an expert AI interview coach. Analyze the answer for technical accuracy and provide feedback. DO NOT include sample answers in your analysis.",
            },
            {
              role: "user",
              content: `Question: ${question}\nAnswer: ${answer}\n\nProvide only analysis and feedback about this answer. Do not include sample answers.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 400,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${perplexityKey}`,
          },
          timeout: 20000,
        }
      );

      const analysis = response.data.choices[0].message.content || "Good attempt at answering the question.";
      const sampleAnswer = generateQuestionSpecificAnswer(question);

      resolve({
        score: Math.floor(Math.random() * 40) + 60,
        feedback: analysis.trim(),
        suggestedAnswer: sampleAnswer.trim(),
        topic: detectTopic(question)
      });
    } catch (err) {
      resolve({
        score: 50,
        feedback: "Unable to analyze answer. Please try again.",
        suggestedAnswer: generateQuestionSpecificAnswer(question),
        topic: "Programming"
      });
    }
  });
}

export function analyzeConfidence(answer) {
  const length = answer.trim().split(/\s+/).length;
  if (!length) return { score: 10, feedback: "No answer provided." };
  if (length < 5) return { score: 30, feedback: "Sounded unsure; work on fluency." };
  if (length < 15) return { score: 60, feedback: "Moderately confident, but could be more detailed." };
  return { score: 85, feedback: "Confident and fluent." };
}

function generateQuestionSpecificAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes('binary search')) {
    return `**Binary Search Answer:**

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\``;
  }

  if (q.includes('linked list')) {
    return `**Linked List Answer:**

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insert_node(head, val):
    new_node = ListNode(val)
    new_node.next = head
    return new_node
\`\`\``;
  }

  if (q.includes('recursion')) {
    return `**Recursion Answer:**

\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
\`\`\``;
  }

  if (q.includes('sort')) {
    return `**Sorting Answer:**

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
\`\`\``;
  }

  if (q.includes('big o') || q.includes('time complexity') || q.includes('space complexity')) {
    return `**Big O Answer:**

Time complexities from fastest to slowest:
- O(1) - Constant time
- O(log n) - Logarithmic time  
- O(n) - Linear time
- O(n log n) - Linearithmic time
- O(n²) - Quadratic time
- O(2^n) - Exponential time`;
  }

  if (q.includes('array') && q.includes('linked list')) {
    return `**Array vs Linked List Answer:**

**Arrays:**
- Fixed size, contiguous memory
- O(1) random access
- O(n) insertion/deletion

**Linked Lists:**
- Dynamic size, scattered memory
- O(n) access by index
- O(1) insertion at head`;
  }

  if (q.includes('two sum')) {
    return `**Two Sum Answer:**

\`\`\`python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
\`\`\``;
  }

  if (q.includes('reverse') && q.includes('string')) {
    return `**Reverse String Answer:**

\`\`\`python
def reverse_string(s):
    return s[::-1]
\`\`\``;
  }

  if (q.includes('reverse') && q.includes('linked list')) {
    return `**Reverse Linked List Answer:**

\`\`\`python
def reverse_linked_list(head):
    prev = None
    current = head
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    return prev
\`\`\``;
  }

  if (q.includes('palindrome')) {
    return `**Palindrome Answer:**

\`\`\`python
def is_palindrome(s):
    return s == s[::-1]
\`\`\``;
  }

  if (q.includes('valid') && q.includes('parentheses')) {
    return `**Valid Parentheses Answer:**

\`\`\`python
def is_valid_parentheses(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0
\`\`\``;
  }

  if (q.includes('maximum') && q.includes('subarray')) {
    return `**Maximum Subarray Answer:**

\`\`\`python
def max_subarray(nums):
    max_current = max_global = nums[0]
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_global = max(max_global, max_current)
    return max_global
\`\`\``;
  }

  if (q.includes('stack') && q.includes('heap')) {
    return `**Stack vs Heap Answer:**

**Stack:**
- Stores local variables and function calls
- LIFO structure, automatic memory management
- Faster but limited size

**Heap:**
- Stores objects and dynamic data
- Manual memory management
- Slower but larger capacity`;
  }

  if (q.includes('sql') && q.includes('nosql')) {
    return `**SQL vs NoSQL Answer:**

**SQL Databases:**
- Structured data with fixed schema
- ACID compliance, complex queries
- Good for relationships and transactions

**NoSQL Databases:**
- Flexible schema, various data models
- Horizontal scaling, eventual consistency
- Good for big data and rapid development`;
  }

  if (q.includes('system') && q.includes('design')) {
    return `**System Design Answer:**

1. **Requirements**: Define functional and non-functional requirements
2. **High-level design**: Load balancer → App servers → Database
3. **Database**: Choose SQL vs NoSQL based on needs
4. **Caching**: Add Redis/Memcached for performance
5. **Scaling**: Horizontal scaling and microservices`;
  }

  if (q.includes('conflict') || q.includes('team') || q.includes('management')) {
    return `**HR Answer:**

I would handle this situation by:
1. **Listen**: Understand all perspectives involved
2. **Analyze**: Identify root causes and impacts
3. **Plan**: Develop fair and practical solutions
4. **Communicate**: Clearly explain decisions to all parties
5. **Follow-up**: Monitor results and adjust if needed`;
  }

  return `**Sample Answer:**

I would approach this problem by:
1. Understanding the requirements clearly
2. Breaking down the problem into smaller parts
3. Implementing a solution step by step
4. Testing with various inputs
5. Optimizing if needed`;
}

function detectTopic(question) {
  const keywords = question.toLowerCase();
  if (keywords.includes('algorithm') || keywords.includes('data structure')) return 'Data Structures';
  if (keywords.includes('system') || keywords.includes('design')) return 'System Design';
  if (keywords.includes('hr') || keywords.includes('team') || keywords.includes('management')) return 'HR';
  return 'Programming Concepts';
}
