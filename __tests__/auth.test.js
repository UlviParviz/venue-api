import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../index.js"; 
import User from "../models/user.model.js";

dotenv.config(); 

const MONGO_URL = process.env.DB_URL_TEST;

describe("User Authentication", function () {
  this.timeout(10000); 

  beforeEach(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    await User.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a user and return a token", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).to.equal(201); 
      expect(response.body).to.have.property("token");
    });

    it("should not register a user with missing fields", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.an("array"); 
      expect(response.body.message[0]).to.equal(
        "Email should be a type of string"
      ); 
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });
    });

    it("should login a user and return a token", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("token");
    });

    it("should not login with incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property(
        "message",
        "Invalid email or password"
      );
    });

    it("should not login with non-existing email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property(
        "message",
        "Invalid email or password"
      );
    });
  });
});
