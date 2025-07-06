export function calculateConfidence(answer, question, role) {
  try {
    if (!answer || typeof answer !== 'string') {
      return { score: 0, feedback: 'No answer provided' };
    }

    const metrics = {
      length: calculateLengthScore(answer),
      clarity: calculateClarityScore(answer),
      technical: calculateTechnicalScore(answer, role),
      structure: calculateStructureScore(answer),
      keywords: calculateKeywordScore(answer, question, role)
    };

    // Weighted average
    const weights = {
      length: 0.15,
      clarity: 0.25,
      technical: 0.30,
      structure: 0.15,
      keywords: 0.15
    };

    const totalScore = Object.keys(metrics).reduce((sum, key) => {
      return sum + (metrics[key] * weights[key]);
    }, 0);

    const finalScore = Math.round(Math.max(0, Math.min(100, totalScore)));
    const feedback = generateConfidenceFeedback(metrics, finalScore);

    return {
      score: finalScore,
      feedback,
      breakdown: metrics
    };

  } catch (error) {
    console.error('Error calculating confidence:', error);
    return {
      score: 50,
      feedback: 'Unable to calculate confidence score',
      breakdown: {}
    };
  }
}

function calculateLengthScore(answer) {
  const length = answer.length;
  if (length < 20) return 20;
  if (length < 50) return 40;
  if (length < 100) return 70;
  if (length < 300) return 85;
  if (length < 500) return 90;
  return Math.max(60, 90 - (length - 500) / 50); // Penalize overly long answers
}

function calculateClarityScore(answer) {
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = answer.length / sentences.length;
  
  // Penalize very short or very long sentences
  if (avgSentenceLength < 10 || avgSentenceLength > 100) return 40;
  if (avgSentenceLength < 15 || avgSentenceLength > 80) return 60;
  return 80;
}

function calculateTechnicalScore(answer, role) {
  const technicalTerms = getTechnicalTermsForRole(role);
  const lowerAnswer = answer.toLowerCase();
  
  const matchedTerms = technicalTerms.filter(term => 
    lowerAnswer.includes(term.toLowerCase())
  );
  
  return Math.min(90, (matchedTerms.length / technicalTerms.length) * 100 + 20);
}

function calculateStructureScore(answer) {
  const hasIntroduction = /^(first|initially|to start|let me|i would|the main)/i.test(answer);
  const hasConclusion = /(in conclusion|finally|therefore|to summarize|overall)/i.test(answer);
  const hasBulletStructure = /(\n|^)[-*•]\s/.test(answer) || /\b(first|second|third|next|then|finally)\b/i.test(answer);
  
  let score = 40; // Base score
  if (hasIntroduction) score += 20;
  if (hasConclusion) score += 20;
  if (hasBulletStructure) score += 20;
  
  return score;
}

function calculateKeywordScore(answer, question, role) {
  const questionWords = extractKeywords(question);
  const answerWords = extractKeywords(answer);
  
  const relevantWords = questionWords.filter(word => 
    answerWords.includes(word.toLowerCase())
  );
  
  if (questionWords.length === 0) return 70;
  return Math.min(90, (relevantWords.length / questionWords.length) * 100 + 30);
}

function getTechnicalTermsForRole(role) {
  const terms = {
    'Software Engineer': [
      'algorithm', 'data structure', 'complexity', 'optimization', 'scalability',
      'performance', 'memory', 'runtime', 'binary tree', 'hash table', 'array',
      'linked list', 'stack', 'queue', 'recursion', 'iteration', 'sorting'
    ],
    'Frontend Developer': [
      'component', 'state', 'props', 'DOM', 'responsive', 'CSS', 'HTML',
      'JavaScript', 'React', 'Angular', 'Vue', 'accessibility', 'performance',
      'browser', 'responsive design', 'user experience', 'event handling'
    ],
    'Backend Developer': [
      'API', 'database', 'server', 'authentication', 'security', 'REST',
      'HTTP', 'SQL', 'NoSQL', 'caching', 'middleware', 'endpoint',
      'request', 'response', 'microservices', 'scaling', 'load balancing'
    ],
    'Full Stack Developer': [
      'frontend', 'backend', 'database', 'API', 'deployment', 'full stack',
      'client-server', 'architecture', 'integration', 'testing', 'DevOps'
    ]
  };
  
  return terms[role] || terms['Software Engineer'];
}

function extractKeywords(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'about', 'when', 'them', 'these', 'some', 'what', 'than', 'even', 'most', 'take', 'than', 'only', 'think', 'know', 'just', 'into', 'over', 'time', 'very', 'when', 'much', 'then', 'them', 'these', 'come', 'its', 'now', 'during', 'here', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'then', 'than', 'too', 'very'].includes(word));
}

function generateConfidenceFeedback(metrics, finalScore) {
  const issues = [];
  
  if (metrics.length < 60) {
    issues.push('Consider providing more detailed explanations');
  }
  
  if (metrics.clarity < 60) {
    issues.push('Work on making your explanations clearer and more concise');
  }
  
  if (metrics.technical < 60) {
    issues.push('Include more technical terminology and concepts');
  }
  
  if (metrics.structure < 60) {
    issues.push('Organize your answer with a clear beginning, middle, and end');
  }
  
  if (metrics.keywords < 60) {
    issues.push('Address the key points mentioned in the question');
  }
  
  if (issues.length === 0) {
    return 'Strong answer with good technical depth and clarity';
  }
  
  return issues.join('. ') + '.';
}
