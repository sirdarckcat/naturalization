import questionsJson from '../../questions.json';

// Transform the nested JSON structure into a flat array format
function transformQuestions(data) {
  const questions = [];
  
  data.sections.forEach(section => {
    section.subsections.forEach(subsection => {
      subsection.questions.forEach(q => {
        // Remove the a), b), c), d) prefixes from options
        const cleanOptions = (opts) => opts.map(opt => opt.replace(/^[a-d]\)\s*/, ''));
        
        // Convert correct_answer_key (a, b, c, d) to index (0, 1, 2, 3)
        const correctIndex = q.correct_answer_key.charCodeAt(0) - 'a'.charCodeAt(0);
        
        questions.push({
          id: q.id,
          category: section.title_de,
          level: subsection.title_de,
          question: q.question_de,
          questionEn: q.question_en,
          options: cleanOptions(q.options_de),
          optionsEn: cleanOptions(q.options_en),
          correct: correctIndex
        });
      });
    });
  });
  
  return questions;
}

export const QUESTIONS_DATA = transformQuestions(questionsJson);
