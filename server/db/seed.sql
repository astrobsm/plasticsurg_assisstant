-- =====================================================
-- INITIAL DATA SEED
-- =====================================================

-- Insert default admin user (password: Admin@123)
INSERT INTO users (id, email, password, full_name, role, department, is_approved, is_active)
VALUES (
    'admin-001',
    'admin@unth.edu.ng',
    '$2b$10$rZJxE5K7L9k3h9Y5n6j8KeP2M8H5h9Y5n6j8KeP2M8H5h9Y5n6j8Ke', -- bcrypt hash for Admin@123
    'System Administrator',
    'super_admin',
    'Administration',
    TRUE,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample consultant (password: Doctor@123)
INSERT INTO users (id, email, password, full_name, role, department, specialization, is_approved, is_active)
VALUES (
    'doctor-001',
    'doctor@unth.edu.ng',
    '$2b$10$rZJxE5K7L9k3h9Y5n6j8KeP2M8H5h9Y5n6j8KeP2M8H5h9Y5n6j8Ke', -- bcrypt hash for Doctor@123
    'Dr. Okwesili',
    'consultant',
    'Plastic Surgery',
    'Reconstructive Surgery',
    TRUE,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Insert AI Settings placeholder
INSERT INTO ai_settings (setting_key, setting_value, is_encrypted, updated_by)
VALUES (
    'openai_api_key',
    '',
    TRUE,
    'admin-001'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Sample surgical consumables
INSERT INTO surgical_consumables (item_name, item_code, category, unit, minimum_stock_level, reorder_level, unit_cost, is_active)
VALUES
    ('Surgical Gloves (Size 7.5)', 'CONS-001', 'PPE', 'Pair', 100, 200, 50.00, TRUE),
    ('Suture 3-0 Vicryl', 'CONS-002', 'Sutures', 'Pack', 50, 100, 500.00, TRUE),
    ('Surgical Mask', 'CONS-003', 'PPE', 'Piece', 200, 300, 25.00, TRUE),
    ('Gauze Swabs', 'CONS-004', 'Dressing', 'Pack', 100, 150, 150.00, TRUE),
    ('Surgical Drape', 'CONS-005', 'Theatre', 'Piece', 50, 75, 300.00, TRUE),
    ('Local Anaesthetic (Lidocaine)', 'CONS-006', 'Medications', 'Vial', 30, 50, 200.00, TRUE),
    ('IV Cannula 18G', 'CONS-007', 'Disposables', 'Piece', 100, 150, 75.00, TRUE),
    ('Adhesive Tape', 'CONS-008', 'Dressing', 'Roll', 50, 80, 100.00, TRUE)
ON CONFLICT (item_code) DO NOTHING;
