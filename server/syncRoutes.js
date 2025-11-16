// =====================================================
// ADDITIONAL SYNC ENDPOINTS
// Import this file in index-postgres.js
// =====================================================

// =====================================================
// TREATMENT PLANS
// =====================================================

export function setupTreatmentPlanRoutes(app, pool, authenticateToken) {
  
  // Get treatment plans
  app.get('/api/sync/treatment-plans', authenticateToken, async (req, res) => {
    try {
      const { since, patient_id } = req.query;
      let query = 'SELECT * FROM treatment_plans WHERE deleted = false';
      const params = [];
      
      if (patient_id) {
        query += ' AND patient_id = $1';
        params.push(patient_id);
      }
      
      if (since) {
        query += ` AND updated_at > $${params.length + 1}`;
        params.push(since);
      }
      
      query += ' ORDER BY updated_at DESC';
      
      const result = await pool.query(query, params);
      res.json({ treatment_plans: result.rows });
    } catch (error) {
      console.error('Get treatment plans error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create/Update treatment plan
  app.post('/api/sync/treatment-plans', authenticateToken, async (req, res) => {
    try {
      const plan = req.body;
      
      const result = await pool.query(`
        INSERT INTO treatment_plans (
          id, patient_id, admission_id, plan_name, diagnosis, plan_type, priority,
          treatment_goals, expected_outcomes, start_date, target_completion_date,
          status, primary_surgeon_id, assisting_surgeon_id, responsible_resident_id,
          created_by, synced
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true)
        ON CONFLICT (id) DO UPDATE SET
          plan_name = EXCLUDED.plan_name,
          diagnosis = EXCLUDED.diagnosis,
          plan_type = EXCLUDED.plan_type,
          priority = EXCLUDED.priority,
          treatment_goals = EXCLUDED.treatment_goals,
          expected_outcomes = EXCLUDED.expected_outcomes,
          start_date = EXCLUDED.start_date,
          target_completion_date = EXCLUDED.target_completion_date,
          actual_completion_date = EXCLUDED.actual_completion_date,
          status = EXCLUDED.status,
          updated_by = $16,
          synced = true
        RETURNING *
      `, [
        plan.id, plan.patient_id, plan.admission_id, plan.plan_name, plan.diagnosis,
        plan.plan_type, plan.priority, plan.treatment_goals, plan.expected_outcomes,
        plan.start_date, plan.target_completion_date, plan.status,
        plan.primary_surgeon_id, plan.assisting_surgeon_id, plan.responsible_resident_id,
        req.user.id
      ]);
      
      res.status(201).json({ treatment_plan: result.rows[0] });
    } catch (error) {
      console.error('Create treatment plan error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get treatment plan steps
  app.get('/api/sync/treatment-plan-steps', authenticateToken, async (req, res) => {
    try {
      const { treatment_plan_id } = req.query;
      
      const result = await pool.query(
        'SELECT * FROM treatment_plan_steps WHERE treatment_plan_id = $1 AND deleted = false ORDER BY step_number',
        [treatment_plan_id]
      );
      
      res.json({ steps: result.rows });
    } catch (error) {
      console.error('Get treatment plan steps error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create/Update treatment plan step
  app.post('/api/sync/treatment-plan-steps', authenticateToken, async (req, res) => {
    try {
      const step = req.body;
      
      const result = await pool.query(`
        INSERT INTO treatment_plan_steps (
          id, treatment_plan_id, step_number, step_name, step_type, description,
          scheduled_date, status, assigned_to, notes, created_by, synced
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
        ON CONFLICT (treatment_plan_id, step_number) DO UPDATE SET
          step_name = EXCLUDED.step_name,
          step_type = EXCLUDED.step_type,
          description = EXCLUDED.description,
          scheduled_date = EXCLUDED.scheduled_date,
          completed_date = EXCLUDED.completed_date,
          status = EXCLUDED.status,
          assigned_to = EXCLUDED.assigned_to,
          notes = EXCLUDED.notes,
          updated_by = $11,
          synced = true
        RETURNING *
      `, [
        step.id, step.treatment_plan_id, step.step_number, step.step_name,
        step.step_type, step.description, step.scheduled_date, step.status,
        step.assigned_to, step.notes, req.user.id
      ]);
      
      res.status(201).json({ step: result.rows[0] });
    } catch (error) {
      console.error('Create treatment plan step error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

// =====================================================
// LABORATORY INVESTIGATIONS
// =====================================================

export function setupLabRoutes(app, pool, authenticateToken) {
  
  // Get lab investigations
  app.get('/api/sync/labs', authenticateToken, async (req, res) => {
    try {
      const { since, patient_id, status } = req.query;
      let query = 'SELECT * FROM lab_investigations WHERE deleted = false';
      const params = [];
      
      if (patient_id) {
        query += ' AND patient_id = $1';
        params.push(patient_id);
      }
      
      if (status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(status);
      }
      
      if (since) {
        query += ` AND updated_at > $${params.length + 1}`;
        params.push(since);
      }
      
      query += ' ORDER BY ordered_date DESC';
      
      const result = await pool.query(query, params);
      res.json({ labs: result.rows });
    } catch (error) {
      console.error('Get labs error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create/Update lab investigation
  app.post('/api/sync/labs', authenticateToken, async (req, res) => {
    try {
      const lab = req.body;
      
      const result = await pool.query(`
        INSERT INTO lab_investigations (
          id, patient_id, treatment_plan_id, investigation_type, test_name,
          priority, sample_type, status, lab_number, notes, ordered_by, created_by, synced
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        ON CONFLICT (id) DO UPDATE SET
          investigation_type = EXCLUDED.investigation_type,
          test_name = EXCLUDED.test_name,
          priority = EXCLUDED.priority,
          sample_type = EXCLUDED.sample_type,
          sample_collected = EXCLUDED.sample_collected,
          sample_collection_date = EXCLUDED.sample_collection_date,
          result_date = EXCLUDED.result_date,
          results = EXCLUDED.results,
          interpretation = EXCLUDED.interpretation,
          status = EXCLUDED.status,
          updated_by = $12,
          synced = true
        RETURNING *
      `, [
        lab.id, lab.patient_id, lab.treatment_plan_id, lab.investigation_type,
        lab.test_name, lab.priority, lab.sample_type, lab.status,
        lab.lab_number, lab.notes, req.user.id, req.user.id
      ]);
      
      res.status(201).json({ lab: result.rows[0] });
    } catch (error) {
      console.error('Create lab error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

// =====================================================
// SURGERY BOOKINGS
// =====================================================

export function setupSurgeryRoutes(app, pool, authenticateToken) {
  
  // Get surgery bookings
  app.get('/api/sync/surgeries', authenticateToken, async (req, res) => {
    try {
      const { since, patient_id, status, from_date, to_date } = req.query;
      let query = 'SELECT * FROM surgery_bookings WHERE deleted = false';
      const params = [];
      
      if (patient_id) {
        query += ' AND patient_id = $1';
        params.push(patient_id);
      }
      
      if (status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(status);
      }
      
      if (from_date) {
        query += ` AND scheduled_date >= $${params.length + 1}`;
        params.push(from_date);
      }
      
      if (to_date) {
        query += ` AND scheduled_date <= $${params.length + 1}`;
        params.push(to_date);
      }
      
      if (since) {
        query += ` AND updated_at > $${params.length + 1}`;
        params.push(since);
      }
      
      query += ' ORDER BY scheduled_date DESC';
      
      const result = await pool.query(query, params);
      res.json({ surgeries: result.rows });
    } catch (error) {
      console.error('Get surgeries error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create/Update surgery booking
  app.post('/api/sync/surgeries', authenticateToken, async (req, res) => {
    try {
      const surgery = req.body;
      
      const result = await pool.query(`
        INSERT INTO surgery_bookings (
          id, patient_id, treatment_plan_id, procedure_name, procedure_code,
          procedure_type, scheduled_date, scheduled_time, estimated_duration,
          theatre_number, ward, primary_surgeon_id, assistant_surgeon_id,
          anaesthetist_id, pre_op_diagnosis, planned_procedure, status,
          created_by, synced
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, true)
        ON CONFLICT (id) DO UPDATE SET
          procedure_name = EXCLUDED.procedure_name,
          scheduled_date = EXCLUDED.scheduled_date,
          scheduled_time = EXCLUDED.scheduled_time,
          status = EXCLUDED.status,
          actual_start_time = EXCLUDED.actual_start_time,
          actual_end_time = EXCLUDED.actual_end_time,
          findings = EXCLUDED.findings,
          procedure_performed = EXCLUDED.procedure_performed,
          post_op_diagnosis = EXCLUDED.post_op_diagnosis,
          updated_by = $18,
          synced = true
        RETURNING *
      `, [
        surgery.id, surgery.patient_id, surgery.treatment_plan_id, surgery.procedure_name,
        surgery.procedure_code, surgery.procedure_type, surgery.scheduled_date,
        surgery.scheduled_time, surgery.estimated_duration, surgery.theatre_number,
        surgery.ward, surgery.primary_surgeon_id, surgery.assistant_surgeon_id,
        surgery.anaesthetist_id, surgery.pre_op_diagnosis, surgery.planned_procedure,
        surgery.status, req.user.id
      ]);
      
      res.status(201).json({ surgery: result.rows[0] });
    } catch (error) {
      console.error('Create surgery error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get surgical checklist
  app.get('/api/sync/surgical-checklists/:surgery_id', authenticateToken, async (req, res) => {
    try {
      const { surgery_id } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM surgical_checklists WHERE surgery_booking_id = $1',
        [surgery_id]
      );
      
      res.json({ checklist: result.rows[0] || null });
    } catch (error) {
      console.error('Get surgical checklist error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create/Update surgical checklist
  app.post('/api/sync/surgical-checklists', authenticateToken, async (req, res) => {
    try {
      const checklist = req.body;
      
      const result = await pool.query(`
        INSERT INTO surgical_checklists (
          id, surgery_booking_id, sign_in_completed, patient_identity_confirmed,
          site_marked, consent_confirmed, allergies_checked, equipment_issues_check,
          time_out_completed, team_introductions, procedure_confirmed,
          critical_steps_reviewed, anticipated_events, sign_out_completed,
          procedure_recorded, instrument_count_correct, specimen_labeled,
          equipment_problems, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (surgery_booking_id) DO UPDATE SET
          sign_in_completed = EXCLUDED.sign_in_completed,
          patient_identity_confirmed = EXCLUDED.patient_identity_confirmed,
          site_marked = EXCLUDED.site_marked,
          consent_confirmed = EXCLUDED.consent_confirmed,
          time_out_completed = EXCLUDED.time_out_completed,
          sign_out_completed = EXCLUDED.sign_out_completed,
          instrument_count_correct = EXCLUDED.instrument_count_correct,
          notes = EXCLUDED.notes
        RETURNING *
      `, [
        checklist.id, checklist.surgery_booking_id, checklist.sign_in_completed,
        checklist.patient_identity_confirmed, checklist.site_marked,
        checklist.consent_confirmed, checklist.allergies_checked,
        checklist.equipment_issues_check, checklist.time_out_completed,
        checklist.team_introductions, checklist.procedure_confirmed,
        checklist.critical_steps_reviewed, checklist.anticipated_events,
        checklist.sign_out_completed, checklist.procedure_recorded,
        checklist.instrument_count_correct, checklist.specimen_labeled,
        checklist.equipment_problems, checklist.notes
      ]);
      
      res.status(201).json({ checklist: result.rows[0] });
    } catch (error) {
      console.error('Create surgical checklist error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

// =====================================================
// PRESCRIPTIONS
// =====================================================

export function setupPrescriptionRoutes(app, pool, authenticateToken) {
  
  // Get prescriptions
  app.get('/api/sync/prescriptions', authenticateToken, async (req, res) => {
    try {
      const { since, patient_id, status } = req.query;
      let query = 'SELECT * FROM prescriptions WHERE deleted = false';
      const params = [];
      
      if (patient_id) {
        query += ' AND patient_id = $1';
        params.push(patient_id);
      }
      
      if (status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(status);
      }
      
      if (since) {
        query += ` AND updated_at > $${params.length + 1}`;
        params.push(since);
      }
      
      query += ' ORDER BY prescribed_date DESC';
      
      const result = await pool.query(query, params);
      res.json({ prescriptions: result.rows });
    } catch (error) {
      console.error('Get prescriptions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create prescription with items
  app.post('/api/sync/prescriptions', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { prescription, items } = req.body;
      
      // Insert prescription
      const prescResult = await client.query(`
        INSERT INTO prescriptions (
          id, patient_id, treatment_plan_id, admission_id, prescribed_by,
          prescription_type, diagnosis, status, notes, created_by, synced
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          notes = EXCLUDED.notes,
          updated_by = $10,
          synced = true
        RETURNING *
      `, [
        prescription.id, prescription.patient_id, prescription.treatment_plan_id,
        prescription.admission_id, req.user.id, prescription.prescription_type,
        prescription.diagnosis, prescription.status, prescription.notes, req.user.id
      ]);
      
      // Insert prescription items
      const itemResults = [];
      for (const item of items || []) {
        const itemResult = await client.query(`
          INSERT INTO prescription_items (
            id, prescription_id, medication_name, medication_type, dosage,
            route, frequency, duration, quantity, unit, instructions,
            special_instructions
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO UPDATE SET
            dosage = EXCLUDED.dosage,
            frequency = EXCLUDED.frequency,
            duration = EXCLUDED.duration,
            quantity = EXCLUDED.quantity
          RETURNING *
        `, [
          item.id, prescription.id, item.medication_name, item.medication_type,
          item.dosage, item.route, item.frequency, item.duration, item.quantity,
          item.unit, item.instructions, item.special_instructions
        ]);
        
        itemResults.push(itemResult.rows[0]);
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({
        prescription: prescResult.rows[0],
        items: itemResults
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Create prescription error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  });
}

// =====================================================
// CME & ASSESSMENTS
// =====================================================

export function setupCMERoutes(app, pool, authenticateToken) {
  
  // Get CME topics
  app.get('/api/sync/cme-topics', authenticateToken, async (req, res) => {
    try {
      const { since, category, is_published } = req.query;
      let query = 'SELECT * FROM cme_topics WHERE deleted = false';
      const params = [];
      
      if (category) {
        query += ' AND category = $1';
        params.push(category);
      }
      
      if (is_published !== undefined) {
        query += ` AND is_published = $${params.length + 1}`;
        params.push(is_published === 'true');
      }
      
      if (since) {
        query += ` AND updated_at > $${params.length + 1}`;
        params.push(since);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, params);
      res.json({ topics: result.rows });
    } catch (error) {
      console.error('Get CME topics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create/Update CME topic
  app.post('/api/sync/cme-topics', authenticateToken, async (req, res) => {
    try {
      const topic = req.body;
      
      const result = await pool.query(`
        INSERT INTO cme_topics (
          id, topic_name, category, description, content, learning_objectives,
          references, ai_generated, difficulty_level, estimated_duration,
          created_by, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          topic_name = EXCLUDED.topic_name,
          content = EXCLUDED.content,
          is_published = EXCLUDED.is_published,
          updated_by = $11
        RETURNING *
      `, [
        topic.id, topic.topic_name, topic.category, topic.description,
        topic.content, topic.learning_objectives, topic.references,
        topic.ai_generated, topic.difficulty_level, topic.estimated_duration,
        req.user.id, topic.is_published
      ]);
      
      res.status(201).json({ topic: result.rows[0] });
    } catch (error) {
      console.error('Create CME topic error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get MCQ questions for a topic
  app.get('/api/sync/mcq-questions/:topic_id', authenticateToken, async (req, res) => {
    try {
      const { topic_id } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM mcq_questions WHERE cme_topic_id = $1 AND deleted = false ORDER BY created_at',
        [topic_id]
      );
      
      res.json({ questions: result.rows });
    } catch (error) {
      console.error('Get MCQ questions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Save user assessment
  app.post('/api/sync/user-assessments', authenticateToken, async (req, res) => {
    try {
      const assessment = req.body;
      
      const result = await pool.query(`
        INSERT INTO user_assessments (
          id, user_id, cme_topic_id, started_at, completed_at, score,
          total_questions, correct_answers, answers, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          completed_at = EXCLUDED.completed_at,
          score = EXCLUDED.score,
          correct_answers = EXCLUDED.correct_answers,
          answers = EXCLUDED.answers,
          status = EXCLUDED.status
        RETURNING *
      `, [
        assessment.id, req.user.id, assessment.cme_topic_id,
        assessment.started_at, assessment.completed_at, assessment.score,
        assessment.total_questions, assessment.correct_answers,
        JSON.stringify(assessment.answers), assessment.status
      ]);
      
      res.status(201).json({ assessment: result.rows[0] });
    } catch (error) {
      console.error('Save user assessment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
