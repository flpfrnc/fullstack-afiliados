import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";

const transactionMockResponse = {
  transactions: [
    {
      id: 1,
      date: "2022-01-15T22:20:30Z",
      product: "CURSO DE BEM-ESTAR",
      value: "12750.00",
      seller: "JOSE CARLOS",
      created_at: "2023-06-26T08:03:20.652143Z",
      updated_at: "2023-06-26T08:03:20.652203Z",
      transaction_type: {
        type_id: 1,
        description: "Venda produtor",
        nature: "Entrada",
        sign: "+",
      },
    },
  ],
  length: 1,
};

const userResponse = {
  user: {
    username: "test",
  },
  exp: 1687950841,
  token: "token",
  refresh_token: "refresh",
};

const userRegisterResponse = { id: 1, username: "teste" };

const logoutResponse = { detail: "Successfully logged out" };

export const restHandlers = [
  rest.post("http://127.0.0.1:8000/api/auth", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(userResponse));
  }),
  rest.post("http://127.0.0.1:8000/api/register", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(userRegisterResponse));
  }),
  rest.get("http://127.0.0.1:8000/api/logout", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(logoutResponse));
  }),
  rest.get("http://127.0.0.1:8000/api/read-data", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(transactionMockResponse));
  }),
  rest.post("http://127.0.0.1:8000/api/add-data", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(transactionMockResponse));
  }),
];

export const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
