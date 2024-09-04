-- Create table for job posters
CREATE TABLE job_posters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info TEXT NOT NULL
);

-- Create table for jobs
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL CHECK (LENGTH(description) <= 16384),
    requirements TEXT NOT NULL CHECK (LENGTH(requirements) <= 16384),
    poster_id INT NOT NULL,
    lowest_bid_amount DECIMAL(10, 2),
    number_of_bids INT DEFAULT 0,
    expiration_date TIMESTAMP NOT NULL,
    FOREIGN KEY (poster_id) REFERENCES job_posters(id)
);

-- Create table for bids
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    bid_time TIMESTAMP NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);