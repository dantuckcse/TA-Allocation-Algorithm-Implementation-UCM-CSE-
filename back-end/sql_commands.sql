--Add finalized column
ALTER TABLE Assignments 
ADD finalized TEXT NOT NULL DEFAULT 'NO';

--Delete finalized column
alter table Assignments drop column finalized;

--Set all finalized entries to yes
UPDATE Assignments 
SET finalized = 'YES';

--Add class number column
ALTER TABLE Assignments
ADD course_number TEXT;

--Delete class number column
alter table Assignments drop column course_number;

--Create Available_Courses Table
CREATE TABLE Available_Courses (
    pk INTEGER NOT NULL PRIMARY KEY,
    course_number INTEGER NOT NULL,
    semester_fk INTEGER NOT NULL,
    percentage REAL NOT NULL
);

--Put available courses from prototype into db so that they're not hardcoded
INSERT INTO Available_Courses (course_number, semester_fk, percentage)
VALUES 
    (5, 27, 1.25),
    (15, 27, 1.50),
    (20, 27, 0.75),
    (21, 27, 0.5),
    (22, 27, 0.75),
    (24, 27, 1.50),
    (30, 27, 0.50),
    (31, 27, 1.50),
    (100, 27, 1.00),
    (120, 27, 1.00),
    (140, 27, 0.75),
    (160, 27, 0.75),
    (162, 27, 0.5),
    (165, 27, 1.00),
    (179, 27, 0.25),
    (185, 27, 1.00);
    

    
--Delete Available Courses Table
DROP TABLE Available_Courses;

--Create Requested_Courses Table
CREATE TABLE Requested_Courses (
    pk INTEGER NOT NULL PRIMARY KEY,
    assignment_fk INTEGER NOT NULL, 
    course_number INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    category TEXT NOT NULL
);

--Delete Requested_Courses Table
DROP TABLE Requested_Courses;

DELETE FROM Requested_Courses;