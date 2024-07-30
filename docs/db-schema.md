```sql
// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table user {
  id uuid
  email varchar(100)
  name varchar(100)
  password varchar(255)
  created_at timestamp
}

Table pet {
  id uuid
  animal_id uuid
  owner_id uuid
  created_at timestamp
  name varchar(60)
  dob timestamp
}

Table animal {
  id uuid
  type varchar(50)
}
// seed with: dog, cat, fish, ferret,
// bird, reptile, rabit, hamster, guinea pig,

Ref: pet.owner_id > user.id // many-to-one
Ref: pet.animal_id > animal.id

Table record_type {
  id uuid
  name varchar(50)
}

Table record {
  id uuid
  owner_id uuid
  pet_id uuid
  record_type_id uuid
  created_at timestamp
}

Ref: record.owner_id > user.id
Ref: record.pet_id > pet.id
Ref: record.record_type_id > record_type.id

Table vaccine_record {
  id uuid
  record_id uuid
  name varchar(100)
  administered_date timestamp
}

Ref: vaccine_record.record_id > record.id


Table allergy_record {
  id uuid
  record_id uuid
  name uuid
  reactions text
  severity varchar(50) //CHECK (severity IN ('mild', 'severe')),
}

Ref: allergy_record.record_id > record.id

// creating a new record type

// 1. create a new table
// CREATE TABLE medication_record (
//     id SERIAL PRIMARY KEY,
//     record_id INTEGER NOT NULL,
//     medication_name VARCHAR(255) NOT NULL,
//     dosage VARCHAR(50),
//     frequency VARCHAR(50),
//     FOREIGN KEY (record_id) REFERENCES record(id)
// );

// 2. insert a new row in the record_type Table
// INSERT INTO record_type (name) VALUES ('lab result');
```
