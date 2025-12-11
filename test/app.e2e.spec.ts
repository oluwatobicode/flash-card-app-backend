import request from "supertest";
import app from "../src/app";

describe("App (e2e)", () => {
  describe("Health check", () => {
    it("/health (GET)", () => {
      return request(app)
        .get("/health")
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe("success");
        });
    });
  });

  describe("Auth endpoints", () => {
    it("/api/v1/auth/signup (POST)", () => {
      return request(app)
        .post("/api/v1/auth/signup")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "testpassword123",
        })
        .expect(201);
    });
  });
});
