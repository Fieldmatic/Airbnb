INSERT INTO "role" (name) VALUES ('ROLE_ADMIN');
INSERT INTO "role" (name) VALUES ('ROLE_COTTAGE_OWNER');
INSERT INTO "role" (name) VALUES ('ROLE_BOAT_OWNER');
INSERT INTO "role" (name) VALUES ('ROLE_INSTRUCTOR');
INSERT INTO "role" (name) VALUES ('ROLE_INSTRUCTOR');

INSERT INTO address(city, state, street, zip_code) VALUES ('Novi Sad', 'Srbija', 'Dr Ivana Ribara 5', '21000');
INSERT INTO cottage_owner(id,active, email, last_password_reset_date, name, password, phone_number, profile_photo, surname, username, address_id, approved_account, points, registration_explanation, category_id) VALUES (99,true, 'milicftn@gmail.com',null,'mico','$2a$10$fJ7XTUdyAdhGlY3yzsHo3egRkxlVWufriPJvL1FSJzQ1HOvSVIY0u','06534343', null, 'milic', 'ici', 1, true, 0, 'yes', null);
INSERT INTO user_role(user_id, role_id) VALUES ('ici', 2);
INSERT INTO price_list(cancellation_conditions, daily_rate, end_date_time, hourly_rate, start_date_time, bookable_id) VALUES ('Mozete uvek otkazati', 1500, null, 500, null, null);

INSERT INTO cottage(id, name, profile_picture, promotional_description, rating, rules, address_id, price_list_id, cottage_owner_id) VALUES (99, 'Suncana reka', 'src/main/resources/static/pictures/cottage/null/vikendica.jpg', 'Uzivajte u zelenoj oazi u miru i tisini', 6.7, 'Sve je dozvoljeno', 1, 1, 99);