describe("GET /overview", () => {
    describe("when valid queries are given (sortBy, limit, page, starred)", () => {
        test("should respond with a 200 status code", async () => {});

        // id: number;
        // question: string;
        // last_attempt_correct: boolean;
        // last_answered_at: string;
        test("should return data with an array with objects(QuestionOverview)", async () => {});
    });

    describe("when invalid queries are given", () => {
        test("should respond with a 400 status code", async () => {});
    });
});

describe("GET /random", () => {
    describe("when valid queries are given (type, count)", () => {
        test("should respond with a 200 status code", async () => {});

        /*{
            id: number;
            question: string;
            is_starred: boolean;
            correct_option_id: number;
            translated_question: string;
            type_description: string;
            options: Option[];
            detailed_description: string[];
            translated_vocabs: string[];
        }*/
        test("should return data with an array with objects(Question)", async () => {});
    });

    describe("when invalid queries are given", () => {
        test("should respond with a 400 status code", async () => {});
    });
});

describe("GET /count", () => {
    /*{
        all: number
        answered: number
        starred: number
        last_answered_wrong: number
    }*/
    test("should return data with an array with objects", async () => {});
});

describe("GET /:questionId", () => {
    describe("when valid question id is given", () => {
        test("should respond with a 200 status code", async () => {});

        test("should return data with an object (Question)", async () => {});
    });

    describe("when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {});
    });

    describe("when question with given id are not found", () => {
        test("should respond with a 404 status code", async () => {});
    });
});

describe("GET /:questionId/next", () => {
    describe("when valid question id is given", () => {
        test("should respond with a 200 status code", async () => {});

        test("should return data with an object (Question)", async () => {});
    });

    describe("when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {});
    });

    describe("when next question is not found", () => {
        test("should respond with a 404 status code", async () => {});
    });
});

describe("POST /history/:questionId", () => {
    describe("when valid question id and params (wasCorrect) is given", () => {
        test("should respond with a 201 status code", async () => {});
    });

    describe("when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {});
    });

    describe("when invalid params are given", () => {
        test("should respond with a 400 status code", async () => {});
    });

    describe("when question is not found", () => {
        test("should respond with a 404 status code", async () => {});
    });
});

describe("POST /starred/:questionId", () => {
    describe("when valid question id is given", () => {
        test("should respond with a 201 status code", async () => {});
    });

    describe("when question is already starred", () => {
        test("should respond with a 201 status code", async () => {});
    });

    describe("when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {});
    });

    describe("when question is not found", () => {
        test("should respond with a 404 status code", async () => {});
    });
});

describe("DELETE /starred/:questionId", () => {
    describe("when valid question id is given", () => {
        test("should respond with a 200 status code", async () => {});
    });

    describe("when question is already unstarred", () => {
        test("should respond with a 200 status code", async () => {});
    });

    describe("when invalid question id is given", () => {
        test("should respond with a 400 status code", async () => {});
    });

    describe("when question is not found", () => {
        test("should respond with a 404 status code", async () => {});
    });
});
