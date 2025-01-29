const request = require("supertest");
const app = require("../server/app");
const yup = require("yup");

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
    test("api.comment.create should give a 200 response for a valid comment", () => {});
    test("api.comment.create should give a 200 response for a comment with a non-string message", () => {});
    test("api.comment.create should give a 400 response for a comment with no specified id", () => {});
    test("api.comment.create should give a 400 response for a comment with no message", () => {});
    test("api.comment.create should give a 400 response for a comment with an empty message", () => {});
    test("api.comment.create should give a 400 response for a comment with an invalid id", () => {});
  });
});
