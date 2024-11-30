-- Custom SQL migration file, put your code below! --

-- Insert authors
INSERT INTO "authors" ("name", "bio", "created_at", "updated_at") VALUES
('James Clear', 'Author of Atomic Habits, focused on habits and productivity.', now(), now()),
('Eric Ries', 'Author of The Lean Startup, focused on entrepreneurship and startups.', now(), now()),
('Yuval Noah Harari', 'Author of Sapiens and Homo Deus, focused on human history and future.', now(), now()),
('Stephen R. Covey', 'Author of The 7 Habits of Highly Effective People.', now(), now()),
('J.K. Rowling', 'Author of the Harry Potter series.', now(), now()),
('George R.R. Martin', 'Author of the A Song of Ice and Fire series.', now(), now()),
('Malcolm Gladwell', 'Author of Blink, Outliers, and The Tipping Point.', now(), now()),
('Michelle Obama', 'Author of Becoming, focused on her life and journey.', now(), now()),
('Dale Carnegie', 'Author of How to Win Friends and Influence People.', now(), now()),
('Napoleon Hill', 'Author of Think and Grow Rich, focused on personal success.', now(), now());

-- Insert books
INSERT INTO "books" ("author_id", "title", "info", "created_at", "updated_at") VALUES
(1, 'Atomic Habits', 'An easy & proven way to build good habits & break bad ones.', now(), now()),
(2, 'The Lean Startup', 'How today’s entrepreneurs use continuous innovation.', now(), now()),
(3, 'Sapiens: A Brief History of Humankind', 'Explores the history of humankind.', now(), now()),
(3, 'Homo Deus: A Brief History of Tomorrow', 'Explores the future of humankind.', now(), now()),
(4, 'The 7 Habits of Highly Effective People', 'Powerful lessons in personal change.', now(), now()),
(5, 'Harry Potter and the Philosopher''s Stone', 'The first book in the Harry Potter series.', now(), now()),
(5, 'Harry Potter and the Chamber of Secrets', 'The second book in the Harry Potter series.', now(), now()),
(5, 'Harry Potter and the Prisoner of Azkaban', 'The third book in the Harry Potter series.', now(), now()),
(6, 'A Game of Thrones', 'The first book in A Song of Ice and Fire.', now(), now()),
(6, 'A Clash of Kings', 'The second book in A Song of Ice and Fire.', now(), now()),
(6, 'A Storm of Swords', 'The third book in A Song of Ice and Fire.', now(), now()),
(7, 'Outliers: The Story of Success', 'Explores the keys to success.', now(), now()),
(7, 'Blink: The Power of Thinking Without Thinking', 'Discusses intuitive thinking.', now(), now()),
(7, 'The Tipping Point', 'How little things can make a big difference.', now(), now()),
(8, 'Becoming', 'The memoir of Michelle Obama.', now(), now()),
(9, 'How to Win Friends and Influence People', 'Timeless principles of interpersonal influence.', now(), now()),
(10, 'Think and Grow Rich', 'A classic guide to personal success.', now(), now());
