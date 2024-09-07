import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../index.js";
import User from "../models/user.model.js";
import Venue from "../models/venue.model.js";

dotenv.config(); 

// MongoDB Test Configuration
const MONGO_URL = process.env.DB_URL_TEST;

const userCredentials = {
  username: "admin",
  password: "password123",
  email: "admin@example.com",
  role: "admin",
};

let token;
let venueId;

describe("Venue API", function () {
  this.timeout(10000);

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    await User.findOneAndDelete({ email: userCredentials.email });

    const user = await User.create(userCredentials);
    token = user.generateToken();

    await Venue.deleteMany({ name: "Test Venue ABC", createdBy: user._id });

    const venue = await Venue.create({
      name: "Test Venue ABC",
      location: "Test Location",
      description: "Test description",
      capacity: 100,
      createdBy: user._id,
    });
    venueId = venue._id;
  });

  describe("GET /api/venues", () => {
    it("should get all venues", async () => {
      const response = await request(app)
        .get("/api/venues")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("venues").that.is.an("array");
    });
  });

  describe("POST /api/venues", () => {
    it("should create a new venue and then delete it", async () => {
      const createResponse = await request(app)
        .post("/api/venues")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "New Venue",
          location: "New Location",
          description: "New description",
          capacity: 150,
        })
        .expect(200);

      expect(createResponse.body).to.have.property("venue");
      expect(createResponse.body.venue).to.have.property("name", "New Venue");

      const newVenueId = createResponse.body.venue._id;

      const deleteResponse = await request(app)
        .delete(`/api/venues/${newVenueId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(deleteResponse.body).to.have.property("message", "Venue Deleted");
    });
  });

  describe("GET /api/venues/:id", () => {
    it("should get a single venue by id", async () => {
      const response = await request(app)
        .get(`/api/venues/${venueId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("venue");
      expect(response.body.venue).to.have.property("_id", venueId.toString());
    });
  });

  describe("PUT /api/venues/:id", () => {
    it("should update a venue by id", async () => {
      const response = await request(app)
        .put(`/api/venues/${venueId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Updated Venue",
          location: "Updated Location",
        })
        .expect(200);

      expect(response.body).to.have.property("venue");
      expect(response.body.venue).to.have.property("name", "Updated Venue");
    });
  });

  describe("DELETE /api/venues/:id", () => {
    it("should delete a venue by id", async () => {
      const response = await request(app)
        .delete(`/api/venues/${venueId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("message", "Venue Deleted");
    });
  });

  after(async () => {
    await User.findOneAndDelete({ email: userCredentials.email });

    if (venueId) {
      await Venue.findByIdAndDelete(venueId);
    }

    await mongoose.connection.close(); 
  });
});
