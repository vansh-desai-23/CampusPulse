-- SQL DML Script for CampusPulse
-- Populates tables with realistic Indian College Fest data
-- Note: Foreign key constraints are respected by the order of insertion.

-- 1. CLEAR EXISTING DATA
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM team_members;
DELETE FROM teams;
DELETE FROM events;
DELETE FROM fests;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. POPULATE USERS
-- Passwords are BCrypt hash for "password123"

-- Exactly 3 Colleges (Organizers)
INSERT INTO users (id, name, email, password, role, status) VALUES
(1, 'IIIT-B Fest Committee', 'fests@iiitb.ac.in', 'password123', 'ORGANIZER', 'ACTIVE'),
(2, 'BITS Pilani Team', 'oasis@bits-pilani.ac.in', 'password123', 'ORGANIZER', 'ACTIVE'),
(3, 'IIT Bombay Council', 'techfest@iitb.ac.in', 'password123', 'ORGANIZER', 'ACTIVE');

-- 1 Super Admin
INSERT INTO users (id, name, email, password, role, status) VALUES
(4, 'Campus Gymkhana', 'superadmin@campus.edu', 'password123', 'SUPER_ADMIN', 'ACTIVE');

-- Exactly 15 Students
INSERT INTO users (id, name, email, password, role, status) VALUES
(5, 'Student One', 's1@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(6, 'Student Two', 's2@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(7, 'Student Three', 's3@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(8, 'Student Four', 's4@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(9, 'Student Five', 's5@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(10, 'Student Six', 's6@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(11, 'Student Seven', 's7@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(12, 'Student Eight', 's8@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(13, 'Student Nine', 's9@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(14, 'Student Ten', 's10@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(15, 'Student Eleven', 's11@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(16, 'Student Twelve', 's12@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(17, 'Student Thirteen', 's13@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(18, 'Student Fourteen', 's14@gmail.com', 'password123', 'STUDENT', 'ACTIVE'),
(19, 'Student Fifteen', 's15@gmail.com', 'password123', 'STUDENT', 'ACTIVE');


-- 3. POPULATE FESTS (Exactly 4 Fests)
INSERT INTO fests (id, name, description, type, status, banner_image_url, logo_image_url, fest_start_time, fest_end_time, created_at, owned_by) VALUES
(1, 'Oasis 2025', 'The renowned cultural fest of BITS Pilani.', 'CULTURAL', 'PUBLISHED', 'https://res.cloudinary.com/dclqggg1d/image/upload/q_auto/f_auto/v1781013220/OASIS_Banner_gsbbxy.png', 'CLOUDINARY_LOGO_FEST_1', '2026-05-10 09:00:00', '2026-05-15 23:59:59', NOW(), 2),
(2, 'Spandan 2026', 'IIIT-Bangalore''s biggest cultural extravaganza.', 'CULTURAL', 'PUBLISHED', 'https://res.cloudinary.com/dclqggg1d/image/upload/q_auto/f_auto/v1781014584/spandan_banner_ulfnbx.png', 'CLOUDINARY_LOGO_FEST_2', '2027-04-10 09:00:00', '2027-04-12 23:59:59', NOW(), 1),
(3, 'Techfest 2026', 'Asia''s largest science and technology festival.', 'TECHNICAL', 'PUBLISHED', 'https://res.cloudinary.com/dclqggg1d/image/upload/q_auto/f_auto/v1781016074/Techfest_banner_1_rns1wk.png', 'CLOUDINARY_LOGO_FEST_3', '2027-02-01 09:00:00', '2027-02-05 23:59:59', NOW(), 3),
(4, 'Infin8 2026', 'The annual sports and tech fest of IIIT-Bangalore.', 'SPORT', 'PUBLISHED', 'https://res.cloudinary.com/dclqggg1d/image/upload/q_auto/f_auto/v1781015586/infin8_banner_vjbxk9.png', 'CLOUDINARY_LOGO_FEST_4', '2027-03-10 09:00:00', '2027-03-12 23:59:59', NOW(), 1);


-- 4. POPULATE EVENTS (Exactly 9 events)
-- current_bookings exactly matches the number of teams for that event.
INSERT INTO events (id, name, description, venue, event_banner_url, event_logo_url, max_capacity, current_bookings, max_team_size, registration_start, registration_end, physical_event_start, physical_event_end, fest_id, tickets_generated) VALUES

-- Fest 1: Oasis '25 (Past) -> Registration closed, Event Past, tickets generated
(1, 'Rocktaves', 'Rock band competition.', 'Rotunda', 'https://res.cloudinary.com/dclqggg1d/image/upload/q_auto/f_auto/v1781016779/rocktaves_sjicgv.png', 'CLOUDINARY_LOGO_EVENT_1', 20, 1, 5, '2026-04-01 00:00:00', '2026-04-30 23:59:59', '2026-05-11 18:00:00', '2026-05-11 23:00:00', 1, 1),
(2, 'Mr. and Ms. Oasis', 'Personality pageant.', 'Main Auditorium', 'CLOUDINARY_BANNER_EVENT_2', 'CLOUDINARY_LOGO_EVENT_2', 30, 1, 1, '2026-04-01 00:00:00', '2026-04-30 23:59:59', '2026-05-12 18:00:00', '2026-05-12 21:00:00', 1, 1),

-- Fest 2: Spandan '26 (Active Reg) -> Registration active, Event Future, tickets not generated
(3, 'Fashion Show', 'The flagship glamour event.', 'Open Air Theatre', 'CLOUDINARY_BANNER_EVENT_3', 'CLOUDINARY_LOGO_EVENT_3', 25, 2, 10, '2026-05-01 00:00:00', '2027-04-01 23:59:59', '2027-04-11 19:00:00', '2027-04-11 22:00:00', 2, 0),
(4, 'Battle of Bands', 'Live music competition.', 'Main Stage', 'CLOUDINARY_BANNER_EVENT_4', 'CLOUDINARY_LOGO_EVENT_4', 15, 1, 6, '2026-05-01 00:00:00', '2027-04-01 23:59:59', '2027-04-12 18:00:00', '2027-04-12 23:00:00', 2, 0),

-- Fest 3: Techfest '26 (Reg Closed, QR Phase) -> Registration closed yesterday, Event Future, tickets generated
(5, 'Robowars', 'Heavyweight robot combat.', 'Gymkhana Grounds', 'CLOUDINARY_BANNER_EVENT_5', 'CLOUDINARY_LOGO_EVENT_5', 32, 2, 4, '2026-01-01 00:00:00', '2026-06-08 23:59:59', '2027-02-02 10:00:00', '2027-02-02 18:00:00', 3, 1),
(6, 'International Coding Challenge', 'Algorithm and DS competition.', 'Lecture Hall Complex', 'CLOUDINARY_BANNER_EVENT_6', 'CLOUDINARY_LOGO_EVENT_6', 200, 1, 3, '2026-01-01 00:00:00', '2026-06-08 23:59:59', '2027-02-03 09:00:00', '2027-02-03 14:00:00', 3, 1),

-- Fest 4: Infin8 '26 (Mixed)
(7, 'Hackathon', '48-hour coding marathon.', 'Innovation Lab', 'CLOUDINARY_BANNER_EVENT_7', 'CLOUDINARY_LOGO_EVENT_7', 50, 1, 4, '2026-05-01 00:00:00', '2027-03-01 23:59:59', '2027-03-10 10:00:00', '2027-03-12 10:00:00', 4, 0),
(8, 'E-Sports Tournament', 'Valorant and CS2 competition.', 'Computer Centre', 'CLOUDINARY_BANNER_EVENT_8', 'CLOUDINARY_LOGO_EVENT_8', 64, 1, 5, '2026-05-01 00:00:00', '2026-06-09 23:59:59', '2027-03-11 10:00:00', '2027-03-11 20:00:00', 4, 0),
(9, 'Inter-College Basketball', 'Knockout basketball tournament.', 'Sports Complex', 'CLOUDINARY_BANNER_EVENT_9', 'CLOUDINARY_LOGO_EVENT_9', 16, 1, 12, '2026-05-01 00:00:00', '2027-03-01 23:59:59', '2027-03-10 08:00:00', '2027-03-12 18:00:00', 4, 0);


-- 5. POPULATE TEAMS (Total 11 Teams mapping directly to current_bookings)
INSERT INTO teams (id, team_name, invite_code, event_id, leader_id) VALUES
(1, 'The Crescendos', 'A7F3B9D2', 1, 5),     -- Event 1: 1 team
(2, NULL, 'C4E19F8A', 2, 7),                 -- Event 2: 1 team
(3, 'Vogue Squad', '9B2D6F5E', 3, 8),       -- Event 3: 2 teams
(4, 'Glamour Club', '1A8C4D7B', 3, 9),
(5, 'Metal Heads', 'F36E9A2C', 4, 10),       -- Event 4: 1 team
(6, 'Destructors', 'D5B7184F', 5, 11),      -- Event 5: 2 teams
(7, 'Titanium', '2E9C5A3B', 5, 12),
(8, 'ByteMe', '8F4A1D6E', 6, 13),            -- Event 6: 1 team
(9, 'Syntax Errors', 'B15D8F2A', 7, 14),     -- Event 7: 1 team
(10, 'Fraggers', 'E6C3A7B9', 8, 15),         -- Event 8: 1 team
(11, 'Hoop Dreams', '7D2F4E1C', 9, 5);       -- Event 9: 1 team


-- 6. POPULATE TEAM MEMBERS
-- Every team member status is 1 (CONFIRMED)
-- Every student user is utilized.
-- Events 1, 2, 5, 6 have QR Tokens because their registration is closed.

INSERT INTO team_members (id, status, team_id, user_id, qr_token) VALUES
-- Team 1 (Event 1, Oasis, Past)
(1, 1, 1, 5, 'TOKEN_EV1_USER5'),
(2, 1, 1, 6, 'TOKEN_EV1_USER6'),

-- Team 2 (Event 2, Oasis, Past)
(3, 1, 2, 7, 'TOKEN_EV2_USER7'),

-- Team 3 (Event 3, Spandan, Active)
(4, 1, 3, 8, NULL),
(5, 1, 3, 16, NULL),

-- Team 4 (Event 3, Spandan, Active)
(6, 1, 4, 9, NULL),

-- Team 5 (Event 4, Spandan, Active)
(7, 1, 5, 10, NULL),
(8, 1, 5, 17, NULL),

-- Team 6 (Event 5, Techfest, Closed QR Phase)
(9, 1, 6, 11, 'TOKEN_EV5_USER11'),

-- Team 7 (Event 5, Techfest, Closed QR Phase)
(10, 1, 7, 12, 'TOKEN_EV5_USER12'),
(11, 1, 7, 18, 'TOKEN_EV5_USER18'),

-- Team 8 (Event 6, Techfest, Closed QR Phase)
(12, 1, 8, 13, 'TOKEN_EV6_USER13'),

-- Team 9 (Event 7, Infin8, Active)
(13, 1, 9, 14, NULL),
(14, 1, 9, 19, NULL),

-- Team 10 (Event 8, Infin8, Closing Tonight)
(15, 1, 10, 15, NULL),

-- Team 11 (Event 9, Infin8, Active)
(16, 1, 11, 5, NULL),
(17, 1, 11, 6, NULL),
(18, 1, 11, 7, NULL);
