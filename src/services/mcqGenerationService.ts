import { db } from '../db/database';
import jsPDF from 'jspdf';

// Enhanced interfaces for the new MCQ system
export interface ClinicalTopic {
  id: string;
  title: string;
  category: string;
  targetLevels: ('house_officer' | 'junior_resident' | 'senior_resident')[];
  uploadedBy: string;
  uploadedAt: Date;
  content: string; // Raw clinical topic content
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  status: 'active' | 'archived';
}

export interface GeneratedMCQ {
  id: string;
  question: string;
  clinicalScenario: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  difficulty: 'moderate' | 'high';
  targetLevel: 'house_officer' | 'junior_resident' | 'senior_resident';
  category: string;
  points: number; // Always 4 marks per question
  topicId: string;
  generatedAt: Date;
  learningObjectives: string[];
  references: string[];
}

export interface MCQTestSchedule {
  id: string;
  scheduledFor: Date; // Every Tuesday 9 AM
  topicId: string;
  testDuration: number; // 10 minutes in seconds
  totalQuestions: number; // 25 questions
  targetLevels: ('house_officer' | 'junior_resident' | 'senior_resident')[];
  status: 'scheduled' | 'active' | 'completed';
  notificationSent: boolean;
}

export interface MCQTestSession {
  id: string;
  userId: string;
  userLevel: 'house_officer' | 'junior_resident' | 'senior_resident';
  scheduleId: string;
  topicId: string;
  questions: GeneratedMCQ[];
  answers: Record<string, number>; // questionId -> answerIndex
  startedAt: Date;
  completedAt?: Date;
  timeRemaining: number; // seconds
  rawScore: number; // (correct * 4) + (wrong * -1)
  percentageScore: number;
  passed: boolean;
  aiRecommendations?: string;
  weakAreas: string[];
  studyMaterialGenerated: boolean;
}

export interface StudyMaterial {
  id: string;
  sessionId: string;
  userId: string;
  weakAreas: string[];
  content: string; // Rich comprehensive content
  recommendations: string[];
  additionalResources: {
    title: string;
    description: string;
    content: string;
  }[];
  generatedAt: Date;
  downloadUrl?: string;
}

export interface NotificationSchedule {
  id: string;
  userId: string;
  scheduleId: string;
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  message: string;
  type: 'test_reminder' | 'test_available' | 'results_ready';
}

class MCQGenerationService {
  /**
   * Upload clinical topic (Admin only)
   */
  async uploadClinicalTopic(
    title: string,
    category: string,
    content: string,
    targetLevels: ('house_officer' | 'junior_resident' | 'senior_resident')[],
    uploadedBy: string,
    attachments?: { name: string; url: string; type: string }[]
  ): Promise<ClinicalTopic> {
    const topic: ClinicalTopic = {
      id: this.generateId(),
      title,
      category,
      targetLevels,
      uploadedBy,
      uploadedAt: new Date(),
      content,
      attachments,
      status: 'active'
    };

    await db.clinical_topics.add(topic);
    
    // Automatically generate MCQs for this topic
    await this.generateMCQsForTopic(topic);
    
    // Schedule test for next Tuesday 9 AM
    await this.scheduleTest(topic);
    
    return topic;
  }

  /**
   * AI-powered MCQ generation from clinical topic
   */
  async generateMCQsForTopic(topic: ClinicalTopic): Promise<void> {
    // Generate 25 questions for each target level
    for (const level of topic.targetLevels) {
      const difficulty = level === 'senior_resident' ? 'high' : 'moderate';
      const questions = await this.aiGenerateMCQs(topic, level, difficulty, 25);
      
      for (const question of questions) {
        await db.generated_mcqs.add(question);
      }
    }
  }

  /**
   * AI MCQ Generation Engine
   */
  private async aiGenerateMCQs(
    topic: ClinicalTopic,
    targetLevel: 'house_officer' | 'junior_resident' | 'senior_resident',
    difficulty: 'moderate' | 'high',
    count: number
  ): Promise<GeneratedMCQ[]> {
    const questions: GeneratedMCQ[] = [];
    
    // AI-powered question generation based on clinical content
    // This simulates intelligent MCQ generation
    const scenarios = this.generateClinicalScenarios(topic.content, targetLevel, difficulty);
    
    for (let i = 0; i < count && i < scenarios.length; i++) {
      const scenario = scenarios[i];
      
      const mcq: GeneratedMCQ = {
        id: this.generateId(),
        question: scenario.question,
        clinicalScenario: scenario.scenario,
        options: scenario.options,
        correctAnswer: scenario.correctAnswer,
        explanation: scenario.explanation,
        difficulty,
        targetLevel,
        category: topic.category,
        points: 4, // Each question worth 4 marks
        topicId: topic.id,
        generatedAt: new Date(),
        learningObjectives: scenario.learningObjectives,
        references: scenario.references
      };
      
      questions.push(mcq);
    }
    
    return questions;
  }

  /**
   * Generate clinical scenarios based on topic content
   */
  private generateClinicalScenarios(
    content: string,
    targetLevel: string,
    difficulty: string
  ): any[] {
    // This is a simplified version. In production, this would use advanced AI
    const scenarios = [];
    
    // Example clinical scenarios
    const baseScenarios = [
      {
        scenario: "A 45-year-old diabetic patient presents to the emergency department with a deep laceration on the dorsum of the hand sustained from a glass injury 2 hours ago. The wound measures 5cm x 2cm, and you notice exposed extensor tendons. The patient's last meal was 6 hours ago.",
        question: "What is the MOST appropriate initial management?",
        options: [
          "Immediate primary closure under local anesthesia",
          "Thorough irrigation, wound exploration, tendon repair under regional block",
          "Simple bandaging and outpatient follow-up in 24 hours",
          "Broad-spectrum antibiotics and delayed closure in 48 hours"
        ],
        correctAnswer: 1,
        explanation: "In traumatic hand injuries with exposed tendons, thorough irrigation and exploration are essential. Regional anesthesia (e.g., wrist block) provides better conditions than local infiltration for adequate exploration and tendon repair. Primary repair should be performed within 6-12 hours of injury when possible. The patient's diabetic status increases infection risk, making proper debridement crucial.",
        learningObjectives: [
          "Understand timing of wound closure in contaminated injuries",
          "Recognize indications for regional vs local anesthesia",
          "Identify proper management of tendon injuries",
          "Consider comorbidities in wound management"
        ],
        references: [
          "Green's Operative Hand Surgery, 7th Edition - Hand Trauma",
          "ATLS Guidelines - Extremity Trauma Management",
          "British Society for Surgery of the Hand - Open Hand Injury Guidelines"
        ]
      },
      {
        scenario: "A 28-year-old woman presents 6 months post-breast augmentation with progressive pain, firmness, and asymmetry of the right breast. On examination, the right breast is firm, sits higher, and has a spherical appearance compared to the left. She denies fever or discharge.",
        question: "What is the MOST likely diagnosis and appropriate management?",
        options: [
          "Breast abscess requiring immediate incision and drainage",
          "Baker Grade III/IV capsular contracture requiring capsulotomy or capsulectomy",
          "Normal post-operative healing requiring observation only",
          "Implant rupture requiring emergency removal"
        ],
        correctAnswer: 1,
        explanation: "The clinical presentation (firmness, elevation, spherical shape, asymmetry, pain at 6 months post-op) is classic for Baker Grade III or IV capsular contracture. This is one of the most common complications of breast augmentation. Management options include capsulotomy (incision of capsule) or capsulectomy (removal of capsule) with or without implant exchange. Conservative management is inappropriate for symptomatic capsular contracture.",
        learningObjectives: [
          "Recognize clinical features of capsular contracture",
          "Understand Baker grading system",
          "Know management options for capsular contracture",
          "Differentiate capsular contracture from other complications"
        ],
        references: [
          "Plastic and Reconstructive Surgery Journal - Capsular Contracture Review",
          "American Society of Plastic Surgeons - Breast Augmentation Complications",
          "ASPS Practice Guidelines for Breast Augmentation"
        ]
      },
      {
        scenario: "A 65-year-old smoker with peripheral vascular disease is scheduled for below-knee amputation. During pre-operative assessment, you note poor nutritional status (albumin 2.8 g/dL), HbA1c of 9.2%, and he is currently smoking 10 cigarettes daily. He is eager to proceed with surgery as soon as possible.",
        question: "What is the MOST important pre-operative optimization measure?",
        options: [
          "Proceed immediately as delay worsens ischemia",
          "Optimize all factors: smoking cessation (4 weeks), glycemic control (HbA1c <7%), nutritional support before surgery",
          "Only address smoking cessation, proceed with surgery",
          "Only optimize nutrition with supplements, proceed in 1 week"
        ],
        correctAnswer: 1,
        explanation: "Multiple risk factors are present that significantly increase complications: active smoking (wound healing impairment, infection), poor glycemic control (infection, delayed healing), and malnutrition (albumin <3.5 g/dL indicates poor wound healing capacity). Evidence shows that optimizing these factors pre-operatively reduces complications by 40-60%. Smoking cessation for at least 4 weeks, HbA1c reduction to <7%, and nutritional optimization are all critical. While the limb is ischemic, proper optimization prevents post-operative complications that could lead to revision amputations at higher levels.",
        learningObjectives: [
          "Identify modifiable surgical risk factors",
          "Understand impact of smoking on wound healing",
          "Recognize importance of glycemic control in surgery",
          "Appreciate role of nutritional status in outcomes"
        ],
        references: [
          "WHO Guidelines - Pre-operative Optimization",
          "Journal of Vascular Surgery - Amputation Success Rates",
          "British Journal of Surgery - Nutritional Status and Surgical Outcomes"
        ]
      }
    ];

    // Adjust complexity based on difficulty level
    if (difficulty === 'high') {
      // Add more complex multi-step reasoning scenarios
      return baseScenarios.map(s => ({
        ...s,
        scenario: s.scenario + " Additional findings include...",
        options: s.options.map(opt => opt + " with consideration of..."),
      }));
    }

    return baseScenarios;
  }

  /**
   * Schedule test for next Tuesday 9 AM
   */
  async scheduleTest(topic: ClinicalTopic): Promise<MCQTestSchedule> {
    const nextTuesday = this.getNextTuesday9AM();
    
    const schedule: MCQTestSchedule = {
      id: this.generateId(),
      scheduledFor: nextTuesday,
      topicId: topic.id,
      testDuration: 600, // 10 minutes in seconds
      totalQuestions: 25,
      targetLevels: topic.targetLevels,
      status: 'scheduled',
      notificationSent: false
    };

    await db.mcq_test_schedules.add(schedule);
    
    // Create notification schedules for all users in target levels
    await this.createNotificationSchedules(schedule);
    
    return schedule;
  }

  /**
   * Get next Tuesday at 9 AM
   */
  private getNextTuesday9AM(): Date {
    const now = new Date();
    const nextTuesday = new Date(now);
    
    // Get days until next Tuesday (2 = Tuesday)
    const daysUntilTuesday = (2 - now.getDay() + 7) % 7 || 7;
    nextTuesday.setDate(now.getDate() + daysUntilTuesday);
    
    // Set to 9 AM
    nextTuesday.setHours(9, 0, 0, 0);
    
    return nextTuesday;
  }

  /**
   * Create notification schedules for users
   */
  private async createNotificationSchedules(schedule: MCQTestSchedule): Promise<void> {
    // In production, fetch all users with target levels
    // For now, we'll create a template
    const users = await this.getUsersByLevels(schedule.targetLevels);
    
    for (const user of users) {
      const notification: NotificationSchedule = {
        id: this.generateId(),
        userId: user.id,
        scheduleId: schedule.id,
        scheduledFor: schedule.scheduledFor,
        sent: false,
        message: `🎯 New CME Test Available! Topic: "${await this.getTopicTitle(schedule.topicId)}". Test opens Tuesday 9:00 AM. Duration: 10 minutes, 25 questions. Good luck!`,
        type: 'test_reminder'
      };
      
      await db.notification_schedules.add(notification);
    }
  }

  /**
   * Start MCQ test session
   */
  async startMCQTest(
    userId: string,
    userLevel: 'house_officer' | 'junior_resident' | 'senior_resident',
    scheduleId: string
  ): Promise<MCQTestSession> {
    const schedule = await db.mcq_test_schedules.get(scheduleId);
    if (!schedule) throw new Error('Test schedule not found');
    
    // Get 25 questions for the user's level
    const questions = await db.generated_mcqs
      .where('topicId')
      .equals(schedule.topicId)
      .and(q => q.targetLevel === userLevel)
      .limit(25)
      .toArray();

    if (questions.length < 25) {
      throw new Error('Insufficient questions for test');
    }

    // Shuffle questions
    const shuffledQuestions = this.shuffleArray(questions);

    const session: MCQTestSession = {
      id: this.generateId(),
      userId,
      userLevel,
      scheduleId,
      topicId: schedule.topicId,
      questions: shuffledQuestions,
      answers: {},
      startedAt: new Date(),
      timeRemaining: schedule.testDuration,
      rawScore: 0,
      percentageScore: 0,
      passed: false,
      weakAreas: [],
      studyMaterialGenerated: false
    };

    await db.mcq_test_sessions.add(session);
    return session;
  }

  /**
   * Submit answer in real-time
   */
  async submitAnswer(
    sessionId: string,
    questionId: string,
    answerIndex: number
  ): Promise<{ correct: boolean; explanation: string }> {
    const session = await db.mcq_test_sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const question = session.questions.find(q => q.id === questionId);
    if (!question) throw new Error('Question not found');

    // Update answers
    session.answers[questionId] = answerIndex;
    await db.mcq_test_sessions.put(session);

    // Return immediate feedback
    const correct = answerIndex === question.correctAnswer;
    return {
      correct,
      explanation: question.explanation
    };
  }

  /**
   * Complete test and calculate final score
   */
  async completeTest(sessionId: string): Promise<MCQTestSession> {
    const session = await db.mcq_test_sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    // Calculate score: correct * 4, wrong * -1
    let correctCount = 0;
    let wrongCount = 0;
    const weakAreas: string[] = [];

    session.questions.forEach(question => {
      const userAnswer = session.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      } else if (userAnswer !== undefined) {
        wrongCount++;
        weakAreas.push(question.category);
      }
    });

    const rawScore = (correctCount * 4) + (wrongCount * -1);
    const maxScore = session.questions.length * 4; // 25 * 4 = 100
    const percentageScore = Math.max(0, (rawScore / maxScore) * 100);
    const passed = percentageScore >= 50; // 50% passing threshold

    // Update session
    session.completedAt = new Date();
    session.rawScore = rawScore;
    session.percentageScore = Math.round(percentageScore);
    session.passed = passed;
    session.weakAreas = [...new Set(weakAreas)];

    await db.mcq_test_sessions.put(session);

    // Generate AI recommendations and study materials
    await this.generateAIRecommendations(session);
    await this.generateStudyMaterials(session);

    return session;
  }

  /**
   * Generate AI-powered recommendations based on performance
   */
  private async generateAIRecommendations(session: MCQTestSession): Promise<void> {
    const correctCount = Object.keys(session.answers).filter(
      qId => session.answers[qId] === session.questions.find(q => q.id === qId)?.correctAnswer
    ).length;

    const totalQuestions = session.questions.length;
    const accuracy = (correctCount / totalQuestions) * 100;

    let recommendations = '';

    if (accuracy >= 80) {
      recommendations = `🎉 **Excellent Performance!** 

You've demonstrated strong understanding of this clinical topic (${accuracy.toFixed(1)}% accuracy).

**Strengths:**
- Solid grasp of clinical decision-making
- Good application of theoretical knowledge to scenarios
- Appropriate consideration of patient factors

**Recommendations:**
- Continue maintaining this level of preparation
- Consider peer teaching to reinforce knowledge
- Focus on challenging cases in clinical practice
- Explore advanced topics in ${session.weakAreas.length > 0 ? session.weakAreas[0] : 'this area'}

**Next Steps:**
- Review the study materials for depth
- Attempt senior-level questions for challenge
- Share insights with colleagues`;
    } else if (accuracy >= 60) {
      recommendations = `👍 **Good Performance - Room for Growth**

You've shown competent understanding (${accuracy.toFixed(1)}% accuracy) with areas to strengthen.

**Strengths:**
- Adequate foundational knowledge
- Reasonable clinical reasoning

**Areas Needing Attention:**
${session.weakAreas.slice(0, 3).map(area => `- ${area}`).join('\n')}

**Recommendations:**
- Review the generated study materials thoroughly
- Focus on understanding pathophysiology in weak areas
- Practice more clinical scenario-based questions
- Discuss difficult cases with senior colleagues
- Dedicate 30 minutes daily to focused study

**Action Plan:**
1. Complete the downloadable study materials (below)
2. Re-read relevant chapters in standard textbooks
3. Attend relevant clinical cases this week
4. Reattempt similar questions in 1 week`;
    } else if (accuracy >= 40) {
      recommendations = `⚠️ **Performance Needs Improvement**

Your score of ${accuracy.toFixed(1)}% indicates significant knowledge gaps requiring urgent attention.

**Critical Weak Areas:**
${session.weakAreas.slice(0, 5).map(area => `- ${area}`).join('\n')}

**Immediate Actions Required:**
1. **DOWNLOAD** the comprehensive study materials below
2. **SCHEDULE** 1-2 hours daily for focused study
3. **SEEK** mentorship from senior residents/consultants
4. **ATTEND** departmental teaching sessions
5. **REVIEW** basic principles before clinical scenarios

**Study Strategy:**
- Start with fundamentals in each weak area
- Use the structured study materials provided
- Practice with moderate-difficulty questions first
- Discuss each case with supervisors
- Make detailed notes and flashcards

**Timeline:**
- Week 1-2: Master fundamentals using study materials
- Week 3: Practice clinical scenarios
- Week 4: Reattempt assessment

**Support Available:**
- Request additional supervision in weak areas
- Attend consultant-led teaching rounds
- Utilize departmental resources`;
    } else {
      recommendations = `🚨 **Urgent: Significant Learning Gaps Identified**

Score: ${accuracy.toFixed(1)}% - This indicates fundamental knowledge deficits requiring **immediate intervention**.

**Critical Concerns:**
- Major gaps in clinical knowledge across multiple areas
- Potential patient safety implications
- Requires structured remediation plan

**Immediate Mandatory Actions:**
1. **MEET** with your supervisor/program director THIS WEEK
2. **DOWNLOAD** and study all provided materials intensively
3. **SUSPEND** independent clinical decision-making until competency demonstrated
4. **ENROLL** in remedial teaching program
5. **SCHEDULE** weekly assessments to track progress

**Structured Remediation Plan:**
- **Week 1-2:** Intensive review of fundamentals
  - 3-4 hours daily focused study
  - Daily supervision in clinical areas
  - Complete all study materials thoroughly
  
- **Week 3-4:** Supervised clinical application
  - Direct observation of clinical reasoning
  - Case-based discussions with mentor
  - Progressive responsibility under supervision
  
- **Week 5:** Reassessment
  - Repeat this assessment
  - Target: Minimum 60% to proceed
  - Additional remediation if needed

**Resources Provided:**
- Comprehensive study materials (download below)
- Structured reading list
- Practice questions with detailed explanations

**Next Steps:**
1. Download study materials NOW
2. Contact program coordinator today
3. Schedule urgent meeting with supervisor
4. Begin structured study plan immediately

Remember: This is a learning opportunity. With dedicated effort and support, improvement is achievable.`;
    }

    session.aiRecommendations = recommendations;
    await db.mcq_test_sessions.put(session);
  }

  /**
   * Generate comprehensive study materials for weak areas
   */
  async generateStudyMaterials(session: MCQTestSession): Promise<StudyMaterial> {
    const weakAreaContent = await this.generateWeakAreaContent(session.weakAreas, session.questions);
    
    const studyMaterial: StudyMaterial = {
      id: this.generateId(),
      sessionId: session.id,
      userId: session.userId,
      weakAreas: session.weakAreas,
      content: weakAreaContent,
      recommendations: this.generateSpecificRecommendations(session.weakAreas),
      additionalResources: this.generateAdditionalResources(session.weakAreas),
      generatedAt: new Date()
    };

    await db.study_materials.add(studyMaterial);
    
    // Update session
    session.studyMaterialGenerated = true;
    await db.mcq_test_sessions.put(session);

    return studyMaterial;
  }

  /**
   * Generate detailed content for weak areas
   */
  private async generateWeakAreaContent(weakAreas: string[], questions: GeneratedMCQ[]): Promise<string> {
    let content = '# Personalized Study Materials - Areas for Improvement\n\n';
    content += `Generated: ${new Date().toLocaleString()}\n\n`;
    content += '---\n\n';

    for (const area of [...new Set(weakAreas)]) {
      const relevantQuestions = questions.filter(q => q.category === area);
      
      content += `## ${area}\n\n`;
      content += `### Overview\n`;
      content += `You answered ${relevantQuestions.length} question(s) in this category incorrectly. Let's review the key concepts.\n\n`;
      
      content += `### Key Learning Points\n\n`;
      
      // Extract learning objectives from missed questions
      const learningObjectives = new Set<string>();
      relevantQuestions.forEach(q => {
        q.learningObjectives.forEach(obj => learningObjectives.add(obj));
      });

      Array.from(learningObjectives).forEach((obj, index) => {
        content += `${index + 1}. ${obj}\n`;
      });
      content += '\n';

      content += `### Detailed Review\n\n`;
      
      relevantQuestions.forEach((q, index) => {
        content += `#### Question ${index + 1}: ${q.question}\n\n`;
        content += `**Clinical Scenario:**\n${q.clinicalScenario}\n\n`;
        content += `**Correct Answer:** ${q.options[q.correctAnswer]}\n\n`;
        content += `**Explanation:**\n${q.explanation}\n\n`;
        content += `**Key Takeaways:**\n`;
        q.learningObjectives.forEach(obj => {
          content += `- ${obj}\n`;
        });
        content += '\n';
        
        if (q.references.length > 0) {
          content += `**References for Further Reading:**\n`;
          q.references.forEach(ref => {
            content += `- ${ref}\n`;
          });
          content += '\n';
        }
        
        content += '---\n\n';
      });

      content += `### Clinical Application\n\n`;
      content += this.generateClinicalApplicationGuidance(area);
      content += '\n\n';

      content += `### Self-Assessment Checklist\n\n`;
      content += `Before moving forward, ensure you can:\n\n`;
      Array.from(learningObjectives).forEach(obj => {
        content += `- [ ] ${obj}\n`;
      });
      content += '\n---\n\n';
    }

    content += `## Summary and Action Plan\n\n`;
    content += `### Immediate Actions (This Week)\n`;
    content += `1. Review all missed questions and their explanations carefully\n`;
    content += `2. Read the referenced materials for each weak area\n`;
    content += `3. Discuss challenging concepts with senior colleagues\n`;
    content += `4. Observe related clinical cases during ward rounds\n\n`;

    content += `### Medium-term Goals (2-4 Weeks)\n`;
    content += `1. Actively seek out cases related to weak areas\n`;
    content += `2. Present one case from each weak area at teaching sessions\n`;
    content += `3. Complete additional practice questions\n`;
    content += `4. Request focused teaching on problem areas\n\n`;

    content += `### Long-term Development\n`;
    content += `1. Reattempt this assessment after completing remediation\n`;
    content += `2. Maintain a learning portfolio documenting improvement\n`;
    content += `3. Mentor junior colleagues once mastery is achieved\n\n`;

    return content;
  }

  /**
   * Generate clinical application guidance
   */
  private generateClinicalApplicationGuidance(category: string): string {
    // This would be more sophisticated with real AI
    return `**How to Apply This Knowledge in Clinical Practice:**

1. **Recognition:** When you encounter similar cases, systematically assess all relevant factors before making decisions.

2. **Decision-Making Framework:**
   - Identify the clinical problem clearly
   - Consider all management options
   - Evaluate risks and benefits of each approach
   - Choose evidence-based best practice
   - Document reasoning thoroughly

3. **Common Pitfalls to Avoid:**
   - Rushing to diagnosis without complete assessment
   - Overlooking patient-specific factors (comorbidities, allergies)
   - Failing to consider alternative diagnoses
   - Not seeking senior input when uncertain

4. **When to Seek Help:**
   - Any time you're unsure about management
   - Complex cases with multiple comorbidities
   - Unexpected patient responses to treatment
   - Medicolegal concerns

5. **Documentation:**
   - Always document your clinical reasoning
   - Note any discussions with seniors
   - Record patient education provided
   - Document follow-up plans`;
  }

  /**
   * Generate specific recommendations
   */
  private generateSpecificRecommendations(weakAreas: string[]): string[] {
    return [
      `Review standard textbook chapters on: ${weakAreas.join(', ')}`,
      'Attend next departmental teaching session focused on these topics',
      'Request supervised practice in clinical scenarios involving these areas',
      'Create flashcards for key concepts and review daily',
      'Discuss difficult cases with senior residents or consultants',
      'Complete additional practice questions on these topics',
      'Observe relevant procedures/cases in clinical settings'
    ];
  }

  /**
   * Generate additional resources
   */
  private generateAdditionalResources(weakAreas: string[]): { title: string; description: string; content: string }[] {
    return [
      {
        title: 'Essential Reading List',
        description: 'Core textbooks and journal articles for foundational knowledge',
        content: `**Required Reading:**
        
1. Grabb and Smith's Plastic Surgery, 8th Edition
   - Chapters on: ${weakAreas.join(', ')}
   
2. Plastic and Reconstructive Surgery Journal
   - Recent review articles on identified weak areas
   
3. British Journal of Plastic Surgery
   - Clinical practice guidelines relevant to your areas
   
**Online Resources:**
- UpToDate: Evidence-based clinical topics
- ASPS (American Society of Plastic Surgeons) Guidelines
- BAPRAS (British Association of Plastic Surgeons) Resources
- PubMed: Latest research in weak areas`
      },
      {
        title: 'Clinical Skills Practice Guide',
        description: 'Hands-on approaches to improve practical competence',
        content: `**Practical Skills Development:**

1. **Observation:**
   - Shadow senior colleagues during relevant procedures
   - Attend theatre sessions involving weak area topics
   - Participate in ward rounds focusing on these cases

2. **Supervised Practice:**
   - Request graduated responsibility under supervision
   - Perform procedures with direct observation
   - Present cases for feedback

3. **Simulation:**
   - Use departmental simulation facilities
   - Practice decision-making with case scenarios
   - Role-play patient consultations

4. **Reflection:**
   - Maintain a reflective learning journal
   - Document each clinical encounter
   - Review decisions and outcomes
   - Identify learning points`
      },
      {
        title: 'Quick Reference Clinical Algorithms',
        description: 'Step-by-step approaches to common clinical situations',
        content: `**Clinical Decision-Making Algorithms:**

These flowcharts provide structured approaches to the topics you found challenging:

**Algorithm 1: Emergency Assessment**
1. Primary Survey (ABCDE)
2. Life-threatening interventions
3. Secondary Survey
4. Definitive care planning
5. Documentation

**Algorithm 2: Wound Management**
1. Assess wound characteristics
2. Classify contamination level
3. Determine closure timing
4. Select closure technique
5. Plan follow-up

**Algorithm 3: Pre-operative Optimization**
1. Identify modifiable risk factors
2. Implement optimization strategies
3. Set timeline for surgery
4. Monitor progress
5. Proceed when targets met

**Algorithm 4: Complication Management**
1. Recognize complication early
2. Stabilize patient
3. Determine severity
4. Implement appropriate treatment
5. Document and report

Apply these algorithms systematically in your clinical practice.`
      }
    ];
  }

  /**
   * Generate PDF study materials for download
   */
  async generateStudyMaterialPDF(studyMaterialId: string): Promise<string> {
    const material = await db.study_materials.get(studyMaterialId);
    if (!material) throw new Error('Study material not found');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);

    // Header
    doc.setFillColor(14, 159, 110);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('UNTH Plastic Surgery - Personalized Study Materials', pageWidth / 2, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated: ${material.generatedAt.toLocaleDateString()}`, pageWidth / 2, 19, { align: 'center' });

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    let yPos = 35;

    // Split content into pages
    const lines = doc.splitTextToSize(material.content, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      
      // Format headings
      if (line.startsWith('##')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(14, 159, 110);
        yPos += 5;
      } else if (line.startsWith('#')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(14, 159, 110);
        yPos += 8;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
      }
      
      doc.text(line.replace(/^#+\s*/, ''), margin, yPos);
      yPos += 6;
    });

    // Footer on each page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(14, 159, 110);
      doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('UNTH Plastic Surgery Department - CME Program', pageWidth / 2, pageHeight - 5, { align: 'center' });
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
    }

    // Save and return blob URL
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    // Update material with download URL
    material.downloadUrl = url;
    await db.study_materials.put(material);

    return url;
  }

  /**
   * Get user's test history
   */
  async getUserTestHistory(userId: string): Promise<MCQTestSession[]> {
    return await db.mcq_test_sessions
      .where('userId')
      .equals(userId)
      .reverse()
      .toArray();
  }

  /**
   * Get upcoming test schedules
   */
  async getUpcomingTests(userLevel: string): Promise<MCQTestSchedule[]> {
    const now = new Date();
    return await db.mcq_test_schedules
      .where('scheduledFor')
      .above(now)
      .and(schedule => schedule.targetLevels.includes(userLevel as any))
      .toArray();
  }

  /**
   * Check and send notifications (called by background service)
   */
  async processNotifications(): Promise<void> {
    const now = new Date();
    const pendingNotifications = await db.notification_schedules
      .where('scheduledFor')
      .below(now)
      .and(n => !n.sent)
      .toArray();

    for (const notification of pendingNotifications) {
      // In production, this would trigger push notification
      console.log(`Sending notification to user ${notification.userId}:`, notification.message);
      
      notification.sent = true;
      notification.sentAt = new Date();
      await db.notification_schedules.put(notification);
    }
  }

  // Helper methods
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private async getUsersByLevels(levels: string[]): Promise<{ id: string; level: string }[]> {
    // Mock implementation - in production, fetch from user database
    return [
      { id: 'user1', level: 'house_officer' },
      { id: 'user2', level: 'junior_resident' },
      { id: 'user3', level: 'senior_resident' }
    ].filter(u => levels.includes(u.level));
  }

  private async getTopicTitle(topicId: string): Promise<string> {
    const topic = await db.clinical_topics.get(topicId);
    return topic?.title || 'Clinical Topic';
  }
}

export const mcqGenerationService = new MCQGenerationService();
