const request = require("supertest");
const app = require("../server/app");
const yup = require("yup");
const mock_fs = require("mock-fs");

const commentSchema = yup.object().shape({
  recipe_id: yup.number().nonNullable().required(),
  message: yup.string().nonNullable().required(),
});

describe("Testing Comment-related API Endpoints", () => {
  describe("GET /api/comment/get", () => {
    test("api.comment.get should give a 200 response for recipe_id = 0", () => {
      return request(app)
        .get("/api/comment/get")
        .query({ id: 0 })
        .expect(200)
        .then((res) => {
          expect(yup.array().of(commentSchema).validate(res.body));
        });
    });
    test("api.comment.get should give a 200 response for valid recipe_id", () => {
      return request(app)
        .get("/api/comment/get")
        .query({ id: 3 })
        .expect(200)
        .then((res) => {
          expect(yup.array().of(commentSchema).validate(res.body));
        });
    });
    test("api.comment.get should give a 200 response with an empty array", () => {
      return request(app)
        .get("/api/comment/get")
        .query({ id: 10000000 })
        .expect(200, []);
    });
    test("api.comment.get should give a 400 response for a negative id", () => {
      return request(app)
        .get("/api/comment/get")
        .query({ id: -3 })
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Malformed request");
        });
    });
    test("api.comment.get should give a 400 response for a non-number id", () => {
      return request(app)
        .get("/api/comment/get")
        .query({ id: "this is not a number" })
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Malformed request");
        });
    });
  });
  describe("POST /api/comment/create", () => {
    test("api.comment.create should give a 200 response for a valid comment", async () => {
      let response = await request(app)
        .post("/api/comment/create")
        .send({ recipe_id: 1, message: "Loved this recipe!" })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        code: 200,
        message: "Success",
      });
    });

    test("api.comment.create should give a 200 response for a comment with a non-string message", async () => {
      let response = await request(app)
        .post("/api/comment/create")
        .send({ recipe_id: 1, message: 1 })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ code: 200, message: "Success" });
    });
    test("api.comment.create should give a 400 response for a comment with no specified id", async () => {
      let response = await request(app)
        .post("/api/comment/create")
        .send({ message: "Haha! Look at me, I don't have a recipe!" })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        message: "Malformed request",
      });
    });
    test("api.comment.create should give a 400 response for a comment with no message", async () => {
      let response = await request(app)
        .post("/api/comment/create")
        .send({ recipe_id: 3 })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        message: "Malformed request",
      });
    });

    test("api.comment.create should give a 400 response for a comment with an empty message", async () => {
      let response = await request(app)
        .post("/api/comment/create")
        .send({ recipe_id: 3, message: "" })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        message: "Malformed request",
      });
    });
  });
});
