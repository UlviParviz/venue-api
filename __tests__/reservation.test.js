import mongoose from "mongoose";
import request from "supertest";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import app from "../index.js "; 
import User from "../models/user.model.js";
import Reservation from "../models/reservation.model.js";
import Venue from "../models/venue.model.js";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URL = process.env.DB_URL_TEST;

before(async function () {
  this.timeout(10000); 

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

after(async function () {
  this.timeout(10000); 

  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Reservation API", function () {
  let user, venue, token;

  before(async function () {
    this.timeout(10000); 

    user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password",
    });

    venue = await Venue.create({
      name: "Test Venue",
      location: "Test Location",
      description: "Test Description",
      capacity: 100,
      createdBy: user._id,
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  describe("POST /api/reservations", function () {
    it("should create a reservation", async function () {
      this.timeout(10000); 

      const res = await request(app)
        .post("/api/reservations")
        .set("Authorization", `Bearer ${token}`)
        .send({
          venueId: venue._id,
          date: "2024-09-30",
          time: "18:00",
          numberOfPeople: 4,
        });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("userId", user._id.toString());
    });

    it("should return 400 if reservation already exists", async function () {
      this.timeout(10000); 

      await Reservation.create({
        userId: user._id,
        venueId: venue._id,
        date: "2024-09-30",
        time: "18:00",
        numberOfPeople: 4,
      });

      const res = await request(app)
        .post("/api/reservations")
        .set("Authorization", `Bearer ${token}`)
        .send({
          venueId: venue._id,
          date: "2024-09-30",
          time: "18:00",
          numberOfPeople: 4,
        });
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "This venue is already booked for the selected date and time."
      );
    });
  });

  describe("GET /api/reservations", function () {
    it("should get user reservations", async function () {
      this.timeout(10000); 

      const res = await request(app)
        .get("/api/reservations")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /api/reservations/:id", function () {
    it("should get reservation details by ID", async function () {
      this.timeout(10000); 

      const reservation = await Reservation.create({
        userId: user._id,
        venueId: venue._id,
        date: "2024-09-30",
        time: "18:00",
        numberOfPeople: 4,
      });

      const res = await request(app)
        .get(`/api/reservations/${reservation._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("venueId");
    });

    it("should return 403 if user tries to access another user's reservation", async function () {
      this.timeout(10000); 

      const otherUser = await User.create({
        username: "otheruser",
        email: "other@example.com",
        password: "password",
      });

      const reservation = await Reservation.create({
        userId: otherUser._id,
        venueId: venue._id,
        date: "2024-09-30",
        time: "18:00",
        numberOfPeople: 4,
      });

      const res = await request(app)
        .get(`/api/reservations/${reservation._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal("Access denied");
    });
  });

  describe("DELETE /api/reservations/:id", function () {
    it("should cancel a reservation", async function () {
      this.timeout(10000); 

      const reservation = await Reservation.create({
        userId: user._id,
        venueId: venue._id,
        date: "2024-09-30",
        time: "18:00",
        numberOfPeople: 4,
      });

      const res = await request(app)
        .delete(`/api/reservations/${reservation._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Reservation cancelled successfully");
    });
  });
});
