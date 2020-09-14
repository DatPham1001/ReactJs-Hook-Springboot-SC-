insert into public.enumeration_type
(enumeration_type_id, parent_type_id, description, last_updated_stamp, created_stamp)
VALUES ('PROD_PROMO_RULE', NULL, NULL, NULL, '2020-02-15 21:27:25.628');
insert into public.enumeration_type
(enumeration_type_id, parent_type_id, description, last_updated_stamp, created_stamp)
VALUES ('PRODUCT_TRANSPORT_CATEGORY', NULL, NULL, NULL, '2020-03-09 15:59:16.836');
insert into public.enumeration_type
(enumeration_type_id, parent_type_id, description, last_updated_stamp, created_stamp)
VALUES ('DISTANCE_SOURCE', NULL, NULL, NULL, '2020-03-22 23:53:59.100');


insert into public.enumeration
(enum_id, enum_type_id, enum_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('PROD_PROMO_DISCOUNT_PERCENTAGE', 'PROD_PROMO_RULE', NULL, NULL, NULL, NULL, '2020-02-15 21:28:45.612');
insert into public.enumeration
(enum_id, enum_type_id, enum_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('KHO', 'PRODUCT_TRANSPORT_CATEGORY', NULL, NULL, NULL, NULL, '2020-03-09 16:01:14.820');
insert into public.enumeration
(enum_id, enum_type_id, enum_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('LANH', 'PRODUCT_TRANSPORT_CATEGORY', NULL, NULL, NULL, NULL, '2020-03-09 16:01:14.820');
insert into public.enumeration
(enum_id, enum_type_id, enum_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('DONG', 'PRODUCT_TRANSPORT_CATEGORY', NULL, NULL, NULL, NULL, '2020-03-09 16:01:14.820');
insert into public.enumeration
(enum_id, enum_type_id, enum_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('GOOGLE', 'DISTANCE_SOURCE', NULL, NULL, NULL, NULL, '2020-03-22 23:55:50.746');
insert into public.enumeration
(enum_id, enum_type_id, enum_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('HAVERSINE', 'DISTANCE_SOURCE', NULL, NULL, NULL, NULL, '2020-03-22 23:55:50.746');
insert into public.enumeration
(enum_id, enum_type_id, enum_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('OPEN_STREET_MAP', 'DISTANCE_SOURCE', NULL, NULL, NULL, NULL, '2020-03-22 23:55:50.746');


insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('AUTOMATED_AGENT', null, FALSE, 'Automated Agent', NOW(), NOW());
insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('PERSON', null, TRUE, 'Person', NOW(), NOW());
insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('PARTY_GROUP', null, TRUE, 'Party Group', NOW(), NOW());
insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('BANK', 'PARTY_GROUP', TRUE, 'Bank', NOW(), NOW());
insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('LEGAL_ORGANIZATION', 'PARTY_GROUP', FALSE, 'Legal Organization', '2017-01-03 10:11:27.885', '2017-01-03 10:11:27.608');
insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('CORPORATION', 'LEGAL_ORGANIZATION', FALSE, 'Corporation', NOW(), NOW());
insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('CUSTOMER_GROUP', 'PARTY_GROUP', FALSE, 'Customer Group', NOW(), NOW());
insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('PARTY_DISTRIBUTOR', null, FALSE, 'Distributor', NOW(), NOW());
insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('PARTY_RETAIL_OUTLET', null, FALSE, 'Distributor', NOW(), NOW());
insert into party_type(party_type_id, description)
values ('COMPANY', 'Company');


insert into status_type (status_type_id, parent_type_id, description, last_updated_stamp, created_stamp)
values ('PARTY_STATUS', null, 'Party status', null, NOW());
insert into status_type (status_type_id, parent_type_id, description, last_updated_stamp, created_stamp)
values ('MARRY_STATUS', null, 'Marry status', null, NOW());
insert into status_type (status_type_id, description , last_updated_stamp , created_stamp  )
values ('PAYMENT_STATUS', 'Payment status', null, NOW());



insert into status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
values ('SINGLE', 'MARRY_STATUS', 'SINGLE', 0, 'Độc thân', null, NOW());
insert into status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
values ('MARRIED', 'MARRY_STATUS', 'MARRIED', 0, 'Đã kết hôn', null, NOW());
insert into status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
values ('DIVORCED', 'MARRY_STATUS', 'DIVORCED', 0, 'Đã ly dị', null, NOW());
insert into status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
values ('PARTY_ENABLED', 'PARTY_STATUS', 'ENABLED', 0, 'Đã kích hoạt', null, NOW());
insert into status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
values ('PARTY_DISABLED', 'PARTY_STATUS', 'DISABLED', 0, 'Đã bị vô hiệu hóa', null, NOW());



insert into public.security_group(group_id, description) VALUES ('ROLE_ADMIN', 'Chủ cửa hàng');
insert into public.security_group(group_id, description) VALUES ('ROLE_COORDINATOR', 'Nhân viên điều phối');
insert into public.security_group(group_id, description) VALUES ('ROLE_WAREHOUSE_STAFF', 'Nhân viên kho');
insert into public.security_group(group_id, description) VALUES ('ROLE_WAREHOUSE_MANAGER', 'Thủ kho');



INSERT INTO public.security_permission (permission_id,description,last_updated_stamp,created_stamp) VALUES
('USER_CREATE','Create user permission','2019-12-26 08:00:31.803','2019-12-26 08:00:31.803')
,('USER_VIEW','View user permission','2019-12-26 08:00:31.803','2019-12-26 08:00:31.803')
,('ORDER_CREATE','Create order permission','2019-12-26 08:00:31.803','2019-12-26 08:00:31.803')
,('ORDER_VIEW','View order permission','2019-12-26 08:00:31.803','2019-12-26 08:00:31.803')
,('PRODUCT_CREATE','Create product permission','2020-08-30 11:00:06.088','2020-08-30 11:00:06.088')
,('PRODUCT_VIEW','View product permission','2020-08-30 11:00:08.687','2020-08-30 11:00:08.687')
,('SUPPLIER_CREATE','Create supplier permission','2020-08-30 11:04:51.629','2020-08-30 11:04:51.629')
,('SUPPLIER_VIEW','View supplier permission','2020-08-30 11:04:54.002','2020-08-30 11:04:54.002')
;


INSERT INTO public.security_group_permission (group_id,permission_id,last_updated_stamp,created_stamp) VALUES
('ROLE_ADMIN','ORDER_CREATE','2020-08-30 11:33:09.121','2020-08-30 11:33:09.121')
,('ROLE_ADMIN','ORDER_VIEW','2020-08-30 12:15:28.367','2020-08-30 12:15:28.367')
,('ROLE_ADMIN','USER_CREATE','2020-08-30 12:24:33.957','2020-08-30 12:24:33.957')
,('ROLE_ADMIN','USER_VIEW','2020-08-30 12:24:56.865','2020-08-30 12:24:56.865')
,('ROLE_ADMIN','PRODUCT_CREATE','2020-08-30 12:25:30.894','2020-08-30 12:25:30.894')
,('ROLE_ADMIN','PRODUCT_VIEW','2020-08-30 12:25:38.888','2020-08-30 12:25:38.888')
,('ROLE_ADMIN','SUPPLIER_CREATE','2020-08-30 12:26:05.701','2020-08-30 12:26:05.701')
,('ROLE_ADMIN','SUPPLIER_VIEW','2020-08-30 12:26:16.830','2020-08-30 12:26:16.830')
,('ROLE_WAREHOUSE_MANAGER','SUPPLIER_CREATE','2020-08-30 21:58:52.128','2020-08-30 21:58:52.128')
,('ROLE_WAREHOUSE_MANAGER','SUPPLIER_VIEW','2020-08-30 21:59:00.693','2020-08-30 21:59:00.693')
;
INSERT INTO public.security_group_permission (group_id,permission_id,last_updated_stamp,created_stamp) VALUES
('ROLE_COORDINATOR','ORDER_VIEW','2020-08-30 21:59:32.004','2020-08-30 21:59:32.004')
,('ROLE_COORDINATOR','ORDER_CREATE','2020-08-30 21:59:43.678','2020-08-30 21:59:43.678')
,('ROLE_WAREHOUSE_STAFF','PRODUCT_CREATE','2020-08-30 22:00:05.934','2020-08-30 22:00:05.934')
,('ROLE_WAREHOUSE_STAFF','PRODUCT_VIEW','2020-08-30 22:00:13.112','2020-08-30 22:00:13.112')
,('ROLE_WAREHOUSE_MANAGER','PRODUCT_VIEW','2020-08-30 22:01:28.698','2020-08-30 22:01:28.698')
,('ROLE_WAREHOUSE_MANAGER','PRODUCT_CREATE','2020-08-30 22:01:36.267','2020-08-30 22:01:36.267')
,('ROLE_WAREHOUSE_MANAGER','ORDER_CREATE','2020-08-30 22:02:08.704','2020-08-30 22:02:08.704')
,('ROLE_WAREHOUSE_MANAGER','ORDER_VIEW','2020-08-30 22:02:13.761','2020-08-30 22:02:13.761')
;



insert into application_type(application_type_id, description, last_updated_stamp, created_stamp)
values ('MENU', 'Menu application type', NOW(), NOW());
insert into application_type(application_type_id, description, last_updated_stamp, created_stamp)
values ('SCREEN', 'Screen application type', NOW(), NOW());
insert into application_type(application_type_id, description, last_updated_stamp, created_stamp)
values ('MODULE', 'Module application type', NOW(), NOW());
insert into application_type(application_type_id, description, last_updated_stamp, created_stamp)
values ('SERVICE', 'Service application type', NOW(), NOW());
insert into application_type(application_type_id, description, last_updated_stamp, created_stamp)
values ('ENTITY', 'Entity application type', NOW(), NOW());



INSERT INTO public.application (application_id,application_type_id,module_id,permission_id,description,last_updated_stamp,created_stamp) VALUES
('MENU_USER','MENU',NULL,NULL,'Menu user management','2019-12-26 08:00:39.953','2019-12-26 08:00:39.953')
,('MENU_USER_CREATE','MENU','MENU_USER','USER_CREATE','Menu user create','2019-12-26 08:00:39.953','2019-12-26 08:00:39.953')
,('MENU_USER_LIST','MENU','MENU_USER','USER_VIEW','Menu user list','2019-12-26 08:00:39.953','2019-12-26 08:00:39.953')
,('MENU_ORDER','MENU',NULL,NULL,'Menu order management','2019-12-26 08:00:39.953','2019-12-26 08:00:39.953')
,('MENU_ORDER_LIST','MENU','MENU_ORDER','ORDER_VIEW','Menu order list','2019-12-26 08:00:39.953','2019-12-26 08:00:39.953')
,('MENU_ORDER_CREATE','MENU','MENU_ORDER','ORDER_CREATE','Menu order create','2019-12-26 08:00:39.953','2019-12-26 08:00:39.953')
,('MENU_PRODUCT','MENU',NULL,NULL,'Menu product management','2020-08-30 10:55:47.969','2020-08-30 10:55:47.969')
,('MENU_PRODUCT_CREATE','MENU','MENU_PRODUCT','PRODUCT_CREATE','Menu product create','2020-08-30 11:00:11.813','2020-08-30 11:00:11.813')
,('MENU_PRODUCT_LIST','MENU','MENU_PRODUCT','PRODUCT_VIEW','Menu product list','2020-08-30 11:00:14.385','2020-08-30 11:00:14.385')
,('MENU_SUPPLIER','MENU',NULL,NULL,'Menu supplier management','2020-08-30 11:06:15.300','2020-08-30 11:06:15.300')
;
INSERT INTO public.application (application_id,application_type_id,module_id,permission_id,description,last_updated_stamp,created_stamp) VALUES
('MENU_SUPPLIER_CREATE','MENU','MENU_SUPPLIER','SUPPLIER_CREATE','Menu supplier create','2020-08-30 11:06:18.263','2020-08-30 11:06:18.263')
,('MENU_SUPPLIER_LIST','MENU','MENU_SUPPLIER','SUPPLIER_VIEW','Menu supplier list','2020-08-30 11:06:20.752','2020-08-30 11:06:20.752')
;



insert into party (party_id, party_type_id, external_id, description, status_id, created_date, created_by_user_login, last_modified_date,
					last_modified_by_user_login, is_unread, last_updated_stamp, created_stamp, party_code)
values ('14eb4978-e0f8-11ea-82d3-0862665303f9', 'PERSON', null, null, 'PARTY_ENABLED', null, null, null, null, FALSE, null, NOW(), 'trungtd');

insert into person (party_id, first_name, middle_name, last_name, gender, birth_date, last_updated_stamp, created_stamp)
values ('14eb4978-e0f8-11ea-82d3-0862665303f9', 'Trần', 'Đình', 'Trung', 'M', '1999-02-14', null, NOW());

insert into user_login (user_login_id, current_password, password_hint, is_system, enabled, has_logged_out, require_password_change,
                        disabled_date_time, successive_failed_logins, last_updated_stamp, created_stamp, party_id)
values ('trungtd', '$2a$10$Y4FXX6TalapgQ3rJoe.QHe9.RutM4l81pAm2S1XzDuUR83qLvDxyO', null, FALSE, TRUE, FALSE, FALSE, null,
        null, null, NOW(), '14eb4978-e0f8-11ea-82d3-0862665303f9');

insert into user_login_security_group (user_login_id, group_id, last_updated_stamp, created_stamp)
values ('trungtd', 'ROLE_WAREHOUSE_MANAGER', null, NOW());



insert into party (party_id, party_type_id, external_id, description, status_id, created_date, created_by_user_login, last_modified_date,
					last_modified_by_user_login, is_unread, last_updated_stamp, created_stamp, party_code)
values ('418581d8-e0f8-11ea-82d4-0862665303f9', 'PERSON', null, null, 'PARTY_ENABLED', null, null, null, null, FALSE, null, NOW(), 'datpt')

insert into person (party_id, first_name, middle_name, last_name, gender, birth_date, last_updated_stamp, created_stamp)
values ('418581d8-e0f8-11ea-82d4-0862665303f9', 'Phạm', 'Tiến', 'Đạt', 'M', '1998-01-10', null, NOW());

insert into user_login (user_login_id, current_password, password_hint, is_system, enabled, has_logged_out, require_password_change,
                        disabled_date_time, successive_failed_logins, last_updated_stamp, created_stamp, party_id)
values ('datpt', '$2a$10$Y4FXX6TalapgQ3rJoe.QHe9.RutM4l81pAm2S1XzDuUR83qLvDxyO', null, FALSE, TRUE, FALSE, FALSE, null,
        null, null, NOW(), '418581d8-e0f8-11ea-82d4-0862665303f9');

insert into user_login_security_group (user_login_id, group_id, last_updated_stamp, created_stamp)
values ('datpt', 'ROLE_WAREHOUSE_STAFF', null, NOW());



insert into party (party_id, party_type_id, external_id, description, status_id, created_date, created_by_user_login, last_modified_date,
					last_modified_by_user_login, is_unread, last_updated_stamp, created_stamp, party_code)
values ('2eee523c-e0fa-11ea-82d5-0862665303f9', 'PERSON', null, null, 'PARTY_ENABLED', null, null, null, null, FALSE, null, NOW(), 'tuanla')

insert into person (party_id, first_name, middle_name, last_name, gender, birth_date, last_updated_stamp, created_stamp)
values ('2eee523c-e0fa-11ea-82d5-0862665303f9', 'Lê', 'Anh', 'Tuấn', 'M', '1999-05-13', null, NOW());

insert into user_login (user_login_id, current_password, password_hint, is_system, enabled, has_logged_out, require_password_change,
                        disabled_date_time, successive_failed_logins, last_updated_stamp, created_stamp, party_id)
values ('tuanla', '$2a$10$Y4FXX6TalapgQ3rJoe.QHe9.RutM4l81pAm2S1XzDuUR83qLvDxyO', null, FALSE, TRUE, FALSE, FALSE, null,
        null, null, NOW(), '2eee523c-e0fa-11ea-82d5-0862665303f9');

insert into user_login_security_group (user_login_id, group_id, last_updated_stamp, created_stamp)
values ('tuanla', 'ROLE_WAREHOUSE_STAFF', null, NOW());


insert into uom_type(uom_type_id, description)
values ('WEIGHT_MEASURE', 'Weight'),
       ('LENGTH_MEASURE', 'Length'),
       ('UNIT_MEASURE', 'Unit'),
       ('CURRENCY_MEASURE', 'Currency Measure')
;

insert into uom(uom_id, uom_type_id, description)
values ('WT_kg', 'WEIGHT_MEASURE', 'Kg'),
       ('WT_g', 'WEIGHT_MEASURE', 'g'),
       ('WT_package', 'UNIT_MEASURE', 'gói'),
       ('WT_box', 'UNIT_MEASURE', 'hộp'),
       ('WT_jar', 'UNIT_MEASURE', 'lọ'),
       ('CUR_vnd', 'CURRENCY_MEASURE', 'VND')
;

insert into role_type(role_type_id, description)
values ('BILL_TO_CUSTOMER', 'Hóa đơn đến khách hàng');
insert into role_type(role_type_id, description)
values ('SALES_EXECUTIVE', 'Hóa đơn của nhân viên bán hàng');
insert into role_type(role_type_id, description)
values ('CREATE_DELIVERY_TRIP', 'Tạo chuyến giao hàng');
insert into role_type(role_type_id, description)
values ('SALESMAN_SELL_FROM_DISTRIBUTOR', 'Nhân viên bán hàng bán từ nhà phân phối');
insert into role_type(role_type_id, description)
values ('SALESMAN_SELL_TO_RETAIL_OUTLET', 'Nhân viên bán hàng đến đại lí bán lẻ');
insert into role_type(role_type_id, description)
values ('SUPERVISOR_OF_SALESMAN', 'Giám sát của nhân viên bán hàng');
insert into role_type(role_type_id, description)
values ('HEAD_DEPARTMENT', 'Trưởng phòng');
insert into role_type(role_type_id, description)
values ('EMPLOYEE_DEPARTMENT', 'Nhân viên của phòng');





