CREATE DATABASE bookstore_db;
USE bookstore_db;

CREATE TABLE Book_Details (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    publish_date DATE,
    rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
    quantity INT CHECK (quantity >= 0),
    -- Other book details columns
);

CREATE TABLE Authors (
    author_id SERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    -- Other author details columns
);

CREATE TABLE Book_Authors (
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    author_id INT REFERENCES Authors(author_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    user_id INT REFERENCES Customers(customer_id) ON DELETE CASCADE,
    review_text TEXT,
    rating NUMERIC(3, 2) NOT NULL,
    review_date DATE,
    -- Other review details columns
);

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    customer_id INT REFERENCES Customers(customer_id) ON DELETE CASCADE,
    order_date DATE,
    quantity INT,
    total_price NUMERIC(10, 2),
    -- Other order details columns
);

CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    -- Other customer details columns
);

CREATE TABLE Genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name VARCHAR(100)
    -- Other genre details columns
);

CREATE TABLE Tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(100)
    -- Other tag details columns
);

CREATE TABLE Book_Genres (
    book_id INT REFERENCES Book_Details(book_id) ON DELETE CASCADE,
    genre_id INT REFERENCES Genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
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




