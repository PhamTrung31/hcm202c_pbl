import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script để parse file QuizHCM201Project.md với cả 2 format:
 * Format 1: CÂU HỎI 1 (SINGLECHOICE) B
 * Format 2: CÂU HỎI 31 (SINGLECHOICE) A
 */

function parseQuizFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
    
    const questions = [];
    let currentQuestion = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Format 1: CÂU HỏI 1 (SINGLECHOICE) B
      let questionMatch = line.match(/^CÂU HỎI (\d+) \(SINGLECHOICE\)\s*([A-DĐ])$/);
      
      if (questionMatch) {
        // Save previous question if valid
        if (currentQuestion && currentQuestion.question && currentQuestion.options.length >= 3) {
          questions.push(currentQuestion);
        }
        
        const questionNumber = parseInt(questionMatch[1]);
        const correctAnswerLetter = questionMatch[2] === 'Đ' ? 'D' : questionMatch[2];
        
        currentQuestion = {
          id: `hcm201_q${questionNumber}`,
          question: '',
          options: [],
          correctAnswer: correctAnswerLetter,
          type: 'single-choice',
          category: 'HCM201',
          difficulty: 'medium'
        };
        
        // Read question text and options for Format 1
        let j = i + 1;
        let questionParts = [];
        
        // Read question text until we find answer options
        while (j < lines.length) {
          const nextLine = lines[j];
          
          // Stop if we hit next question
          if (nextLine.match(/^CÂU HỎI/)) {
            break;
          }
          
          // Check if this looks like an option (short line, no question marks)
          if (isLikelyAnswerOption(nextLine, questionParts.length > 0)) {
            break;
          }
          
          questionParts.push(nextLine);
          j++;
        }
        
        currentQuestion.question = questionParts.join(' ').trim();
        
        // Read options
        let optionIndex = 0;
        const optionLabels = ['A', 'B', 'C', 'D'];
        
        while (j < lines.length && optionIndex < 4) {
          const nextLine = lines[j];
          
          if (nextLine.match(/^CÂU HỎI/)) {
            break;
          }
          
          // Check for both formats: plain text and "A. text" format
          const optionMatch = nextLine.match(/^([A-D])\.\s*(.+)$/);
          if (optionMatch) {
            // Format: A. text
            currentQuestion.options.push({
              id: optionMatch[1],
              text: optionMatch[2]
            });
            optionIndex++;
          } else if (nextLine.trim() !== '') {
            // Plain text format
            currentQuestion.options.push({
              id: optionLabels[optionIndex],
              text: nextLine
            });
            optionIndex++;
          }
          
          j++;
        }
        
        i = j - 1;
      } else {
        // Format 2: CÂU HỎI 31 (SINGLECHOICE) A
        // followed by question text
        // followed by options A. B. C. D.
        questionMatch = line.match(/^CÂU HỎI (\d+) \(SINGLECHOICE\) ([A-DĐ])$/);
        
        if (questionMatch) {
          // Save previous question if valid
          if (currentQuestion && currentQuestion.question && currentQuestion.options.length >= 3) {
            questions.push(currentQuestion);
          }
          
          const questionNumber = parseInt(questionMatch[1]);
          const correctAnswerLetter = questionMatch[2] === 'Đ' ? 'D' : questionMatch[2];
          
          let j = i + 1;
          
          // Read question text (next line)
          const questionText = j < lines.length ? lines[j] : '';
          j++;
          
          currentQuestion = {
            id: `hcm201_q${questionNumber}`,
            question: questionText,
            options: [],
            correctAnswer: correctAnswerLetter,
            type: 'single-choice',
            category: 'HCM201',
            difficulty: 'medium'
          };
          
          // Read options (A. B. C. D.)
          while (j < lines.length) {
            const nextLine = lines[j];
            
            // Stop if we hit next question
            if (nextLine.match(/^CÂU HỎI/)) {
              break;
            }
            
            // Check for option format: A. text, B. text, etc.
            const optionMatch = nextLine.match(/^([A-D])\.\s*(.+)$/);
            if (optionMatch) {
              currentQuestion.options.push({
                id: optionMatch[1],
                text: optionMatch[2]
              });
            }
            
            j++;
          }
          
          i = j - 1;
        }
      }
    }
    
    // Add last question if valid
    if (currentQuestion && currentQuestion.question && currentQuestion.options.length >= 3) {
      questions.push(currentQuestion);
    }
    
    return {
      title: 'Bài Quiz Tư tưởng Hồ Chí Minh',
      description: 'Tổng hợp câu hỏi về tư tưởng Hồ Chí Minh HCM201',
      category: 'HCM201',
      questions: questions,
      totalQuestions: questions.length
    };
    
  } catch (error) {
    console.error('Error parsing quiz file:', error);
    return null;
  }
}

function isLikelyAnswerOption(line, hasQuestionText) {
  if (!hasQuestionText) return false;
  
  // Answer options are typically shorter and don't contain question marks or quotes
  return line.length < 120 && 
         !line.includes('?') && 
         !line.includes('"') && 
         !line.includes('Nguyễn Ái Quốc') &&
         !line.includes('Hồ Chí Minh') &&
         !line.toLowerCase().includes('theo') &&
         !line.includes('năm nào');
}

// Parse the quiz file
const inputFile = path.join(__dirname, '../data/QuizHCM201Project.md');
const outputFile = path.join(__dirname, '../data/quiz-data.json');

console.log('🚀 Parsing quiz file...');
const quizData = parseQuizFile(inputFile);

if (quizData) {
  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(quizData, null, 2), 'utf-8');
  
  console.log(`✅ Successfully parsed ${quizData.totalQuestions} questions`);
  console.log(`📁 Output saved to: ${outputFile}`);
  
  // Show sample of questions for verification
  console.log('\n📋 Sample questions:');
  quizData.questions.slice(0, 3).forEach((q, idx) => {
    console.log(`\n${idx + 1}. [${q.id}] ${q.question.substring(0, 80)}...`);
    console.log(`   ✓ Correct: ${q.correctAnswer}`);
    console.log(`   📝 Options: ${q.options.length} options`);
  });
  
  // Show questions from different ranges to verify both formats
  console.log('\n📋 Questions from different ranges:');
  [0, 15, 30, 45].forEach(idx => {
    if (idx < quizData.questions.length) {
      const q = quizData.questions[idx];
      console.log(`\n${idx + 1}. [${q.id}] ${q.question.substring(0, 60)}...`);
      console.log(`   ✓ ${q.correctAnswer}: ${q.options.find(opt => opt.id === q.correctAnswer)?.text.substring(0, 40)}...`);
    }
  });
  
  // Validation check
  const validQuestions = quizData.questions.filter(q => 
    q.id && q.question && q.options.length >= 3 && q.correctAnswer
  );
  
  console.log(`\n✅ ${validQuestions.length}/${quizData.totalQuestions} questions are valid`);
  
  if (validQuestions.length !== quizData.totalQuestions) {
    console.log('⚠️  Invalid questions found:');
    quizData.questions.filter(q => !q.id || !q.question || q.options.length < 3 || !q.correctAnswer)
      .forEach(q => console.log(`   - ${q.id}: ${q.question?.substring(0, 50) || 'No question'}... (${q.options?.length || 0} options)`));
  }
  
} else {
  console.log('❌ Failed to parse quiz file');
}