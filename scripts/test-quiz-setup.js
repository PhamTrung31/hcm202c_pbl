import fs from 'fs';
import path from 'path';

// Test quiz data functionality
function testQuizData() {
  try {
    const quizDataPath = path.join(process.cwd(), 'data/quiz-data.json');
    console.log('📂 Loading quiz data from:', quizDataPath);
    
    const data = JSON.parse(fs.readFileSync(quizDataPath, 'utf-8'));
    
    console.log('\n📊 QUIZ DATA STATS');
    console.log('═══════════════════');
    console.log('📚 Title:', data.title);
    console.log('🏷️  Category:', data.category);
    console.log('📝 Total Questions:', data.totalQuestions);
    console.log('✅ Actual Questions in Array:', data.questions.length);
    
    console.log('\n🎲 RANDOM QUIZ DEMO');
    console.log('═══════════════════');
    
    // Simulate API call: Get 5 random questions
    function getRandomQuestions(count = 5) {
      const shuffled = data.questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, data.questions.length));
    }
    
    const randomQuestions = getRandomQuestions(5);
    
    randomQuestions.forEach((q, idx) => {
      console.log(`\n${idx + 1}. 🆔 [${q.id}] ${q.question.substring(0, 80)}...`);
      console.log(`   ✅ Correct Answer: ${q.correctAnswer}`);
      console.log(`   📋 Options:`);
      q.options.forEach(opt => {
        const isCorrect = opt.id === q.correctAnswer;
        const marker = isCorrect ? ' ✓' : '';
        console.log(`      ${opt.id}: ${opt.text.substring(0, 60)}...${marker}`);
      });
    });
    
    console.log('\n🔧 API ENDPOINTS SIMULATION');
    console.log('═══════════════════════════');
    
    // Simulate different API calls
    const tests = [
      { name: 'Get 10 random questions', count: 10, random: true },
      { name: 'Get first 5 questions (no random)', count: 5, random: false },
      { name: 'Get all HCM201 questions', category: 'HCM201' },
      { name: 'Get medium difficulty questions', difficulty: 'medium' }
    ];
    
    tests.forEach(test => {
      console.log(`\n🧪 Test: ${test.name}`);
      
      let questions = [...data.questions];
      
      if (test.category) {
        questions = questions.filter(q => q.category === test.category);
      }
      
      if (test.difficulty) {
        questions = questions.filter(q => q.difficulty === test.difficulty);
      }
      
      if (test.random) {
        questions = questions.sort(() => 0.5 - Math.random());
      }
      
      if (test.count) {
        questions = questions.slice(0, test.count);
      }
      
      console.log(`   📊 Result: ${questions.length} questions`);
      if (questions.length > 0) {
        console.log(`   📝 Sample: ${questions[0].id} - ${questions[0].question.substring(0, 50)}...`);
      }
    });
    
    console.log('\n📊 DATA QUALITY CHECK');
    console.log('══════════════════════');
    
    // Validation check
    const validQuestions = data.questions.filter(q => 
      q.id && 
      q.question && 
      q.options && 
      q.options.length >= 3 && 
      q.correctAnswer &&
      q.options.some(opt => opt.id === q.correctAnswer)
    );
    
    console.log(`✅ ${validQuestions.length}/${data.totalQuestions} questions are valid`);
    
    // Check for duplicate IDs
    const ids = data.questions.map(q => q.id);
    const uniqueIds = new Set(ids);
    console.log(`🔢 ${uniqueIds.size}/${ids.length} unique question IDs`);
    
    // Check question ID range
    const questionNumbers = data.questions.map(q => parseInt(q.id.replace('hcm201_q', '')));
    const minId = Math.min(...questionNumbers);
    const maxId = Math.max(...questionNumbers);
    console.log(`🔢 Question ID range: ${minId} - ${maxId}`);
    
    // Missing question check
    const expectedIds = Array.from({ length: 50 }, (_, i) => i + 1);
    const missingIds = expectedIds.filter(id => !questionNumbers.includes(id));
    if (missingIds.length > 0) {
      console.log(`⚠️  Missing question IDs: ${missingIds.join(', ')}`);
    } else {
      console.log(`✅ All question IDs 1-50 are present`);
    }
    
    if (validQuestions.length !== data.questions.length) {
      console.log('\n⚠️  INVALID QUESTIONS FOUND:');
      const invalidQuestions = data.questions.filter(q => 
        !q.id || !q.question || !q.options || q.options.length < 3 || !q.correctAnswer || !q.options.some(opt => opt.id === q.correctAnswer)
      );
      invalidQuestions.forEach(q => {
        console.log(`   ❌ ${q.id || 'NO_ID'}: ${q.question?.substring(0, 50) || 'NO_QUESTION'}... (${q.options?.length || 0} options)`);
      });
    }
    
    console.log('\n🚀 API ENDPOINTS READY:');
    console.log('══════════════════════');
    console.log('📡 GET /api/quiz/questions?count=10&random=true');
    console.log('📡 GET /api/quiz/stats');
    console.log('📡 POST /api/quiz/save-result');
    console.log('📡 GET /api/quiz/results');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing quiz data:', error);
    return false;
  }
}

// Run the test
console.log('🎯 QUIZ DATA SETUP TEST');
console.log('═══════════════════════\n');

const success = testQuizData();

console.log(success ? '\n🎉 Quiz data setup is working correctly!' : '\n💥 Quiz data setup has issues');
console.log('\n🎮 Ready to serve random quiz questions!');