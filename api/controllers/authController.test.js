// const request = require('supertest');
// const app = require('../../index');
// const User = require('../../models/user');
// const mongoose = require('mongoose');



// describe('POST /api/ auth/register', () => {
//     beforeAll(async () => {
//         await User.deleteMany({});
//     });
//     afterAll(async () => {
//         await mongoose.connection.close();
//     });
//     it('should register a new user', async () => {
//         const res = await request(app)
//             .post('/api/auth/register')
//             .send({
//                 full_name: 'John Doe',
//                 dob: '1990-01-01',
//                 email: 'test@example.com',
//                 password: 'Khanh123@',
//                 avatar_url: 'https://example.com/avatar.jpg',
//                 status: '1',
//                 role: '1'
//             });
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty('message', 'User registered successfully');
//     });
//     it('should register a new user', async () => {
//         const res = await request(app)
//             .post('/api/auth/register')
//             .send({
//                 full_name: 'John Doe2',
//                 dob: '1990-01-01',
//                 email: 'test2@example.com',
//                 password: 'password',
//                 avatar_url: 'https://example.com/avatar.jpg',
//                 status: '1',
//                 role: '1'
//             });
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty('message', 'User registered successfully');
//     });
//     it('should register a new user', async () => {
//         const res = await request(app)
//             .post('/api/auth/register')
//             .send({
//                 full_name: 'John Doe2',
//                 dob: '1990-01-01',
//                 email: 'admin@gmail.com',
//                 password: 'Khanh0411!',
//                 avatar_url: 'https://example.com/avatar.jpg',
//                 status: '1',
//                 role: '1'
//             });
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty('message', 'User registered successfully');
//     });
    
//     it('should register a new user fail', async () => {
//         const res = await request(app)
//             .post('/api/auth/register')
//             .send({
//                 full_name: 'John Doe2',
//                 dob: '1990-01-01',
//                 email: 'test@example.com',
//                 password: 'password',
//                 avatar_url: 'https://example.com/avatar.jpg',
//                 status: '1',
//                 role: '1'
//             });
//         expect(res.statusCode).toEqual(400);
//         expect(res.body).toEqual({ message: 'User already exists' });
//     });

//     it('should login an existing user', async () => {
//         const res = await request(app)
//             .post('/api/auth/login')
//             .send({
//                 email: 'admin@gmail.com ',
//                 password: 'Khanh0411!'
//             });
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty('token');
//     });
//     it('should fail to login with incorrect password', async () => {
//         const res = await request(app)
//             .post('/api/auth/login')
//             .send({
//                 email: 'test@example.com',
//                 password: 'wrongpassword'
//             });
//         expect(res.statusCode).toEqual(401);
//         expect(res.body).toHaveProperty('message', 'Invalid password');
//     });
//     it('should fail to login with non-existent user', async () => {
//         const res = await request(app)
//             .post('/api/auth/login')
//             .send({
//                 email: 'nonexistent@example.com',
//                 password: 'password'
//             });
//         expect(res.statusCode).toEqual(404);
//         expect(res.body).toHaveProperty('message', 'User not found');
//     });
// });

