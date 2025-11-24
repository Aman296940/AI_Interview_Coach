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
      // First, do a quick local analysis for basic scoring
      const localScore = calculateLocalScore(question, answer);
      
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: `You are an expert technical interview evaluator. Analyze the candidate's answer and provide:
1. A numerical score from 0-100 based on:
   - Technical accuracy (40%)
   - Completeness (25%)
   - Clarity and communication (20%)
   - Relevance to the question (15%)
2. Detailed feedback highlighting strengths and areas for improvement
3. A topic/category for this question

Respond in this EXACT JSON format (no markdown, no code blocks):
{
  "score": <number 0-100>,
  "feedback": "<detailed feedback>",
  "topic": "<topic name>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"]
}`,
            },
            {
              role: "user",
              content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nEvaluate this answer and provide your analysis in the required JSON format.`,
            },
          ],
          temperature: 0.3, // Lower temperature for more consistent scoring
          max_tokens: 600,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${perplexityKey}`,
          },
          timeout: 25000,
        }
      );

      const aiResponse = response.data.choices[0].message.content || "";
      
      // Parse AI response to extract structured data
      let parsedResult = parseAIResponse(aiResponse, localScore);
      
      // Generate a better suggested answer using AI
      const suggestedAnswer = await generateSuggestedAnswer(question);
      
      resolve({
        score: parsedResult.score,
        feedback: parsedResult.feedback,
        suggestedAnswer: suggestedAnswer || generateQuestionSpecificAnswer(question),
        topic: parsedResult.topic || detectTopic(question),
        strengths: parsedResult.strengths || [],
        improvements: parsedResult.improvements || []
      });
    } catch (err) {
      console.error("AI analysis error:", err);
      // Fallback to local scoring if AI fails
      const localScore = calculateLocalScore(question, answer);
      resolve({
        score: localScore,
        feedback: "Unable to get AI analysis. Based on local evaluation: " + getLocalFeedback(question, answer, localScore),
        suggestedAnswer: generateQuestionSpecificAnswer(question),
        topic: detectTopic(question)
      });
    }
  });
}

// Calculate a baseline score using local heuristics
function calculateLocalScore(question, answer) {
  if (!answer || answer.trim().length < 10) return 20;
  
  const answerLower = answer.toLowerCase();
  const questionLower = question.toLowerCase();
  
  let score = 30; // Base score
  
  // Length scoring (0-20 points)
  const wordCount = answer.trim().split(/\s+/).length;
  if (wordCount >= 50) score += 20;
  else if (wordCount >= 30) score += 15;
  else if (wordCount >= 20) score += 10;
  else if (wordCount >= 10) score += 5;
  
  // Relevance scoring (0-25 points) - check if answer addresses question keywords
  const questionKeywords = extractKeywords(questionLower);
  const answerKeywords = extractKeywords(answerLower);
  const relevantKeywords = questionKeywords.filter(kw => 
    answerKeywords.some(akw => akw.includes(kw) || kw.includes(akw))
  );
  const relevanceRatio = questionKeywords.length > 0 ? relevantKeywords.length / questionKeywords.length : 0.5;
  score += Math.round(relevanceRatio * 25);
  
  // Technical depth (0-15 points) - check for technical terms
  const technicalTerms = ['algorithm', 'complexity', 'data structure', 'optimization', 'performance', 
    'scalability', 'design', 'architecture', 'system', 'database', 'api', 'security', 'testing'];
  const technicalCount = technicalTerms.filter(term => answerLower.includes(term)).length;
  score += Math.min(15, technicalCount * 2);
  
  // Structure and clarity (0-10 points)
  const hasStructure = /(first|second|third|initially|then|finally|in conclusion|to summarize)/i.test(answer);
  const hasExamples = /(example|instance|case|scenario|for instance)/i.test(answer);
  if (hasStructure) score += 5;
  if (hasExamples) score += 5;
  
  // Completeness (0-15 points) - longer, more detailed answers
  if (answer.length > 200) score += 15;
  else if (answer.length > 100) score += 10;
  else if (answer.length > 50) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function extractKeywords(text) {
  return text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said'].includes(word.toLowerCase()));
}

function getLocalFeedback(question, answer, score) {
  if (score < 40) {
    return "The answer is too brief or doesn't address the question adequately. Try to provide more detail and directly answer what was asked.";
  } else if (score < 60) {
    return "The answer addresses the question but could be more comprehensive. Include more technical details and examples.";
  } else if (score < 80) {
    return "Good answer with relevant information. Consider adding more depth and structure to make it excellent.";
  } else {
    return "Strong answer that addresses the question well with good technical depth.";
  }
}

// Parse AI response to extract structured data
function parseAIResponse(aiResponse, fallbackScore) {
  try {
    // Try to extract JSON from the response
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: Math.max(0, Math.min(100, parsed.score || fallbackScore)),
        feedback: parsed.feedback || "Good attempt at answering the question.",
        topic: parsed.topic || detectTopic(""),
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || []
      };
    }
    
    // If no JSON, try to extract score from text
    const scoreMatch = aiResponse.match(/score["\s:]*(\d+)/i) || aiResponse.match(/(\d+)\s*\/\s*100/i);
    const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : fallbackScore;
    
    return {
      score: Math.max(0, Math.min(100, extractedScore)),
      feedback: aiResponse.trim() || "Good attempt at answering the question.",
      topic: detectTopic(""),
      strengths: [],
      improvements: []
    };
  } catch (err) {
    console.error("Error parsing AI response:", err);
    return {
      score: fallbackScore,
      feedback: aiResponse.trim() || "Good attempt at answering the question.",
      topic: detectTopic(""),
      strengths: [],
      improvements: []
    };
  }
}

// Generate a better suggested answer using AI
async function generateSuggestedAnswer(question) {
  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: "You are an expert technical interviewer. Provide a clear, well-structured sample answer to the interview question. Focus on being concise but comprehensive.",
          },
          {
            role: "user",
            content: `Question: ${question}\n\nProvide a well-structured sample answer that demonstrates best practices for answering this type of interview question.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${perplexityKey}`,
        },
        timeout: 20000,
      }
    );
    
    return response.data.choices[0].message.content?.trim() || generateQuestionSpecificAnswer(question);
  } catch (err) {
    console.error("Error generating suggested answer:", err);
    return generateQuestionSpecificAnswer(question);
  }
}

export function analyzeConfidence(answer) {
  if (!answer || typeof answer !== 'string' || !answer.trim()) {
    return { score: 0, feedback: "No answer provided." };
  }
  
  const trimmed = answer.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const charCount = trimmed.length;
  
  // Base score from length
  let score = 30;
  if (wordCount >= 50) score = 85;
  else if (wordCount >= 30) score = 75;
  else if (wordCount >= 20) score = 65;
  else if (wordCount >= 10) score = 50;
  else if (wordCount >= 5) score = 35;
  
  // Adjust based on answer quality indicators
  const hasFillerWords = /(um|uh|like|you know|actually|basically)/gi.test(trimmed);
  if (hasFillerWords) score = Math.max(0, score - 10);
  
  const hasConfidentPhrases = /(i believe|i think|in my experience|based on|i would|i can)/gi.test(trimmed);
  if (hasConfidentPhrases && wordCount > 15) score = Math.min(100, score + 5);
  
  // Check for structured response
  const hasStructure = /(first|second|third|initially|then|finally|in conclusion)/i.test(trimmed);
  if (hasStructure) score = Math.min(100, score + 5);
  
  // Penalize very short answers
  if (wordCount < 10) score = Math.max(0, score - 15);
  
  const finalScore = Math.max(0, Math.min(100, score));
  
  let feedback = "";
  if (finalScore >= 80) {
    feedback = "Very confident and articulate delivery. Good use of structure and clear explanations.";
  } else if (finalScore >= 65) {
    feedback = "Confident delivery with good clarity. Consider reducing filler words and adding more detail.";
  } else if (finalScore >= 50) {
    feedback = "Moderately confident but could improve fluency. Practice speaking more clearly and reducing hesitation.";
  } else if (finalScore >= 30) {
    feedback = "Answer is too brief. Work on providing more detailed explanations and speaking with more confidence.";
  } else {
    feedback = "Answer needs significant improvement. Focus on providing complete thoughts and speaking clearly.";
  }
  
  return { score: finalScore, feedback };
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

export function detectTopic(question) {
  if (!question) return 'General';
  const keywords = question.toLowerCase();
  if (keywords.includes('algorithm') || keywords.includes('data structure')) return 'Data Structures';
  if (keywords.includes('system') || keywords.includes('design')) return 'System Design';
  if (keywords.includes('database') || keywords.includes('sql') || keywords.includes('nosql')) return 'Database';
  if (keywords.includes('api') || keywords.includes('rest') || keywords.includes('graphql')) return 'API Design';
  if (keywords.includes('security') || keywords.includes('authentication') || keywords.includes('authorization')) return 'Security';
  if (keywords.includes('hr') || keywords.includes('team') || keywords.includes('management') || keywords.includes('conflict')) return 'HR & Management';
  if (keywords.includes('testing') || keywords.includes('test') || keywords.includes('qa')) return 'Testing';
  if (keywords.includes('frontend') || keywords.includes('react') || keywords.includes('ui') || keywords.includes('ux')) return 'Frontend';
  if (keywords.includes('backend') || keywords.includes('server')) return 'Backend';
  return 'Programming Concepts';
}
