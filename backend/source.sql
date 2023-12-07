CREATE DATABASE bookstore_db;
USE bookstore_db;

CREATE TABLE Book_Details (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publish_date DATE,
    rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
    quantity INT CHECK (quantity >= 0),
    -- price NUMERIC(10, 2) CHECK (price >= 0),
    -- Other book details columns
);
-- Data added. 

CREATE TABLE Authors (
    author_id SERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    -- Other author details columns
);
-- Data added.

CREATE TABLE Book_Authors (
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    author_id INT REFERENCES Authors(author_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);
-- Data added.


CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    user_id INT REFERENCES Customers(customer_id) ON DELETE CASCADE,
    review_text TEXT,
    rating NUMERIC(3, 2) NOT NULL,
    review_date DATE,
    -- Other review details columns
);
-- Data added.

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    customer_id INT REFERENCES Customers(customer_id) ON DELETE CASCADE,
    order_date DATE,
    quantity INT,
    total_price NUMERIC(10, 2),
    -- Other order details columns
);
-- Data added.

CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    -- Other customer details columns
);
-- Data added.

CREATE TABLE Genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name VARCHAR(100)
    -- Other genre details columns
);
-- Genre data added.

CREATE TABLE Book_Genres (
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    genre_id INT REFERENCES Genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
);
-- Data added.


CREATE TABLE Tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(100)
    -- Other tag details columns
);


CREATE TABLE Book_Tags (
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    tag_id INT REFERENCES Tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, tag_id)
);

CREATE TABLE Sales (
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    quantity INT,
    PRIMARY KEY (book_id)
);

CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Book_Details
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM Reviews
        WHERE book_id = NEW.book_id
    )
    WHERE book_id = NEW.book_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_avg_rating
AFTER INSERT ON Reviews
FOR EACH ROW
EXECUTE FUNCTION update_book_rating();

-- Behavior for each table on delete
ALTER TABLE Book_Details ENABLE ROW LEVEL SECURITY;
ALTER TABLE Authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE Book_Authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE Reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE Orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE Customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE Genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE Tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE Book_Genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE Book_Tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE Sales ENABLE ROW LEVEL SECURITY;

-- For example, on delete cascade behavior for Reviews table
ALTER TABLE Reviews DROP CONSTRAINT Reviews_book_id_fkey;
ALTER TABLE Reviews ADD FOREIGN KEY (book_id) REFERENCES Book_Details(book_id) ON DELETE CASCADE;


-- Create necessary roles and users
CREATE ROLE bookstore_admin LOGIN PASSWORD 'your_password';
CREATE ROLE bookstore_employee LOGIN PASSWORD 'your_password';
CREATE ROLE bookstore_customer LOGIN PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bookstore_db TO bookstore_admin;
GRANT CONNECT ON DATABASE bookstore_db TO bookstore_employee;
GRANT CONNECT ON DATABASE bookstore_db TO bookstore_customer;

-- Create users in the database
CREATE USER admin_user WITH PASSWORD 'admin_password' IN ROLE bookstore_admin;
CREATE USER employee_user WITH PASSWORD 'employee_password' IN ROLE bookstore_employee;
CREATE USER customer_user WITH PASSWORD 'customer_password' IN ROLE bookstore_customer;

-- Set search_path for the schema
ALTER ROLE bookstore_admin SET search_path TO bookstore, public;
ALTER ROLE bookstore_employee SET search_path TO bookstore, public;
ALTER ROLE bookstore_customer SET search_path TO bookstore, public;


-- Create views for better data access control
CREATE VIEW Recent_orders AS
SELECT *
FROM Orders
ORDER BY order_date DESC
LIMIT 10;

CREATE VIEW Book_reviews AS
SELECT bd.title, r.review_text, r.rating, r.review_date
FROM Book_details bd
JOIN Reviews r ON bd.book_id = r.book_id;

-- Grant permissions to specific roles/users on views and tables
GRANT SELECT ON Recent_orders TO bookstore_admin, bookstore_employee;
GRANT SELECT ON Book_reviews TO bookstore_customer, bookstore_employee;

-- Other permission grants for roles/users on different tables/views...

-- Assign privileges to the specific roles
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA bookstore TO bookstore_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA bookstore TO bookstore_employee;
GRANT SELECT ON ALL TABLES IN SCHEMA bookstore TO bookstore_customer;


-- Insert queries
INSERT INTO Genres (genre_id, genre_name) VALUES
  (1, 'Science Fiction'),
  (2, 'Mystery'),
  (3, 'Fantasy'),
  (4, 'Romance'),
  (5, 'Thriller'),
  (6, 'Historical Fiction'),
  (7, 'Non-Fiction'),
  (8, 'Biography'),
  (9, 'Adventure'),
  (10, 'Drama');


INSERT INTO Book_Genres (book_id, genre_id) VALUES
  ('B001', 1),
  ('B003', 2),
  ('B003', 4),
  ('B004', 5),
  ('B005', 6),
  ('B006', 7),
  ('B007', 8),
  ('B008', 9),
  ('B009', 10),
  ('B001', 2),
  ('B001', 4),
  ('B001', 5),
  ('B003', 1),
  ('B003', 3),
  ('B003', 5),
  ('B004', 2),
  ('B004', 3),
  ('B004', 4),
  ('B004', 6),
  ('B004', 8),
  ('B005', 1),
  ('B005', 3),
  ('B005', 7),
  ('B005', 9);


INSERT INTO Orders (book_id, customer_id, order_date, quantity, total_price) VALUES
  ('B002', 1, '2023-01-01', 2, 25.99),
  ('B002', 2, '2023-01-05', 1, 12.50),
  ('B002', 3, '2023-02-10', 3, 45.75),
  ('B002', 4, '2023-03-15', 1, 18.99),
  ('B002', 5, '2023-04-20', 2, 30.50);


INSERT INTO Authors (author_id, author_name) VALUES
  ('Auth1', 'J.D. Salinger'),
  ('Auth2', 'Harper Lee'),
  ('Auth3', 'George Orwell'),
  ('Auth4', 'F. Scott Fitzgerald'),
  ('Auth5', 'Gabriel Garcia Marquez');

INSERT INTO Book_Details (book_id, title, publish_date, rating, quantity) VALUES
  ('B002', 'To Kill a Mockingbird', '1960-07-11', 4.80, 2),
  ('B003', '1984', '1949-06-08', 4.30, 3),
  ('B004', 'The Great Gatsby', '1925-04-10', 4.70, 4),
  ('B005', 'One Hundred Years of Solitude', '1967-05-30', 4.60, 5),
  ('B006', 'Brave New World', '1932-09-01', 4.20, 6),
  ('B007', 'The Lord of the Rings', '1954-07-29', 4.90, 7),
  ('B008', 'Pride and Prejudice', '1813-01-28', 4.50, 8),
  ('B009', 'The Hobbit', '1937-09-21', 4.60, 9),
  ('B010', 'The Harry Potter Series', '1997-06-26', 4.70, 10),
  ('B011', 'New Book', '1798-03-09', 0.00, 4),
  ('B012', 'New Book', '1798-03-09', 0.00, 6),
  ('B001', 'Changed', '1798-03-09', 4.50, 26);

INSERT INTO Customers (customer_id, customer_name, email) VALUES
  (1, 'John Doe', 'john@example.com'),
  (2, 'Jane Doe', 'jane@example.com'),
  (3, 'Alice Smith', 'alice@example.com'),
  (4, 'Bob Johnson', 'bob@example.com'),
  (5, 'Charlie Brown', 'charlie@example.com'),
  (6, 'Eva Martinez', 'eva@example.com'),
  (7, 'David Lee', 'david@example.com'),
  (8, 'Grace Taylor', 'grace@example.com'),
  (9, 'Henry Wilson', 'henry@example.com'),
  (10, 'Isabel Garcia', 'isabel@example.com'),
  (11, 'Jack Miller', 'jack@example.com'),
  (12, 'Katherine White', 'katherine@example.com'),
  (13, 'Liam Davis', 'liam@example.com'),
  (14, 'Olivia Clark', 'olivia@example.com'),
  (15, 'Peter Allen', 'peter@example.com'),
  (16, 'Sophia Moore', 'sophia@example.com'),
  (17, 'Thomas Wright', 'thomas@example.com'),
  (18, 'Victoria Harris', 'victoria@example.com'),
  (19, 'William Brown', 'william@example.com'),
  (20, 'Zoe Taylor', 'zoe@example.com');



INSERT INTO Reviews (book_id, user_id, review_text, rating, review_date)
VALUES ('B002', 1, 'Great book!', 4.5, '2023-11-01'),
       ('B002', 2, 'Highly recommended!', 5.0, '2023-11-02');

