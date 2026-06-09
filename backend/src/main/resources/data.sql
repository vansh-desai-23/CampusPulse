-- SQL DML Script for CampusPulse
-- Populates tables with realistic Indian College Fest data
-- Note: Foreign key constraints are respected by the order of insertion.

-- 1. CLEAR EXISTING DATA (Optional, but ensures a clean state)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE team_members;
TRUNCATE TABLE teams;
TRUNCATE TABLE events;
TRUNCATE TABLE fests;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. POPULATE USERS
-- Passwords are BCrypt hash for "password123"
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Admin Organizer', 'admin@fest.com', 'password123', 'ORGANIZER'),
(2, 'IITB Cultural Team', 'moodi@iitb.ac.in', 'password123', 'ORGANIZER'),
(3, 'BITS Goa Sports', 'spree@bits-goa.ac.in', 'password123', 'ORGANIZER'),
(4, 'IITM Tech Team', 'shaastra@iitm.ac.in', 'password123', 'ORGANIZER'),
(5, 'Rahul Sharma', 'rahul@gmail.com', 'password123', 'STUDENT'),
(6, 'Priya Patel', 'priya@outlook.com', 'password123', 'STUDENT'),
(7, 'Anish Kumar', 'anish@yahoo.com', 'password123', 'STUDENT');

-- 3. POPULATE FESTS
INSERT INTO fests (id, name, description, type, status, banner_image_url, logo_image_url, fest_start_time, fest_end_time, created_at, owned_by) VALUES
(1, 'Mood Indigo 2026', 'Asias largest college cultural festival held at IIT Bombay.', 'CULTURAL', 'PUBLISHED', 'https://res.cloudinary.com/demo/image/upload/v1/moodi_banner', 'https://res.cloudinary.com/demo/image/upload/v1/moodi_logo', '2026-12-18 09:00:00', '2026-12-21 23:59:59', NOW(), 2),
(2, 'Shaastra 2026', 'The annual technical festival of IIT Madras, a hub of innovation.', 'TECHNICAL', 'PUBLISHED', 'https://res.cloudinary.com/demo/image/upload/v1/shaastra_banner', 'https://res.cloudinary.com/demo/image/upload/v1/shaastra_logo', '2026-10-05 08:00:00', '2026-10-08 18:00:00', NOW(), 4),
(3, 'Spree 2026', 'The biggest inter-collegiate sports festival in South India at BITS Goa.', 'SPORT', 'PUBLISHED', 'https://res.cloudinary.com/demo/image/upload/v1/spree_banner', 'https://res.cloudinary.com/demo/image/upload/v1/spree_logo', '2026-03-25 07:00:00', '2026-03-28 21:00:00', NOW(), 3),
(4, 'Oasis 2026', 'The cultural festival of BITS Pilani, known for its unique atmosphere.', 'CULTURAL', 'PUBLISHED', 'https://res.cloudinary.com/demo/image/upload/v1/oasis_banner', 'https://res.cloudinary.com/demo/image/upload/v1/oasis_logo', '2026-11-12 10:00:00', '2026-11-16 23:00:00', NOW(), 1);

-- 4. POPULATE EVENTS
INSERT INTO events (id, name, description, venue, event_banner_url, event_logo_url, max_capacity, current_bookings, max_team_size, registration_start, registration_end, physical_event_start, physical_event_end, fest_id) VALUES
-- Mood Indigo Events
(1, 'Aagaaz (Street Play)', 'The premier street play competition of Mood Indigo.', 'Convocation Hall Grounds', 'https://res.cloudinary.com/demo/image/upload/v1/aagaaz', NULL, 50, 2, 15, '2026-06-01 00:00:00', '2026-12-10 23:59:59', '2026-12-18 10:00:00', '2026-12-18 18:00:00', 1),
(2, 'Vogue (Fashion Show)', 'Showcase your style on the grand stage.', 'Open Air Theatre', 'https://res.cloudinary.com/demo/image/upload/v1/vogue', NULL, 30, 1, 20, '2026-06-01 00:00:00', '2026-12-10 23:59:59', '2026-12-19 19:00:00', '2026-12-19 22:00:00', 1),

-- Shaastra Events
(3, 'Boeing Aeromodelling', 'Design and fly your own RC aircraft.', 'KV Grounds', 'https://res.cloudinary.com/demo/image/upload/v1/aero', NULL, 100, 1, 4, '2026-07-15 00:00:00', '2026-09-25 23:59:59', '2026-10-06 09:00:00', '2026-10-06 17:00:00', 2),
(4, 'RoboWars', 'The ultimate metal-clashing combat.', 'Student Activity Centre', 'https://res.cloudinary.com/demo/image/upload/v1/robowars', NULL, 64, 0, 5, '2026-07-15 00:00:00', '2026-09-25 23:59:59', '2026-10-07 10:00:00', '2026-10-07 18:00:00', 2),

-- Spree Events
(5, 'Inter-College Football', 'The battle for the Spree Cup.', 'Main Football Field', 'https://res.cloudinary.com/demo/image/upload/v1/football', NULL, 32, 1, 18, '2026-01-01 00:00:00', '2026-03-15 23:59:59', '2026-03-25 08:00:00', '2026-03-28 17:00:00', 3),
(6, 'Night Marathon', 'Run through the scenic campus at night.', 'Campus Loop', 'https://res.cloudinary.com/demo/image/upload/v1/run', NULL, 500, 1, 1, '2026-01-01 00:00:00', '2026-03-20 23:59:59', '2026-03-26 21:00:00', '2026-03-26 23:00:00', 3);

-- 5. POPULATE TEAMS
INSERT INTO teams (id, team_name, invite_code, event_id, leader_id) VALUES
(1, 'Dramatics Society IITD', 'DRAM-IITD', 1, 5),
(2, 'Team Glitz', 'GLITZ-26', 2, 6),
(3, 'SkyHigh Flyers', 'AERO-SKY', 3, 7),
(4, 'FC Warriors', 'GOA-FOOT', 5, 5),
(5, NULL, 'MAR-RUNNER', 6, 6),
(6, 'Street Soul', 'AAG-SOUL', 1, 7);

-- 6. POPULATE TEAM MEMBERS
INSERT INTO team_members (id, status, team_id, user_id) VALUES
(1, 1, 1, 5),
(2, 1, 1, 7), -- Anish joins Rahul's Aagaaz team
(3, 1, 2, 6),
(4, 1, 3, 7),
(5, 1, 4, 5),
(6, 1, 5, 6),
(7, 1, 6, 7);
