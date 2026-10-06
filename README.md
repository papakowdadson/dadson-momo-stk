# dadson-momo-stk

A simple Mobile money toolkit with reusable middleware and utilities for Express applications.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Middleware](#middleware)
  - [createAccessToken](#createAccessToken)
  # dadson-momo-stk

  An Express application for making and verifying MTN Mobile Money collection payments in the sandbox environment.

  ## Requirements

  - Node.js
  - MTN MoMo sandbox credentials
  - dadson-momo-stk

  ## Installation

  ```sh
  npm install
  ```

  ## Configuration

  Create a `.env` file in the project root:

  ```dotenv
  SANDBOX_BASIC_AUTH=your_mtn_basic_auth
  SANDBOX_OCP_COLLECTION_KEY=your_mtn_collection_key
  ```

  The application uses the MTN sandbox API at `https://sandbox.momodeveloper.mtn.com` and the `sandbox` target environment. Do not commit credentials to source control.

  ## Running the server

  ```sh
  npm start
  ```

  For development with automatic restart:

  ```sh
  npm run dev
  ```

  The server listens on port `3000` and mounts the payment routes at:

  ```text
  /dadsonmomostk/payment
  ```

  Each request automatically obtains an MTN access token before the payment controller runs. The token is kept in `req.body.access_token` and does not need to be supplied by the client.

  ## API

  ### Make a payment

  `POST /dadsonmomostk/payment/makePayment`

  Request body:

  ```json
  {
    "amount": "10",
    "currency": "GHS",
    "XReferenceId": "your-reference-id",
    "payer": {
      "partyIdType": "MSISDN",
      "partyId": "233XXXXXXXXX"
    },
    "payerMessage": "Payment for order 123",
    "payeeNote": "Order 123"
  }
  ```

  The response is the object returned by MTN after the request-to-pay call. Payment errors return HTTP `500` with an `error` message.

  ### Verify a payment

  `POST /dadsonmomostk/payment/verifyPayment`

  Request body:

  ```json
  {
    "externalId": "your-reference-id"
  }
  ```

  The response is the object returned by MTN for the payment-status request. Verification errors return HTTP `500` with an `error` message.

  ## Implementation notes

  The application uses the `dadson-momo-stk` client with this configuration:

  ```js
  const _Momo = new mtnMomo({
    basicAuth: process.env.SANDBOX_BASIC_AUTH,
    collectionKey: process.env.SANDBOX_OCP_COLLECTION_KEY,
    baseUrl: "https://sandbox.momodeveloper.mtn.com",
    targetEnvironment: "sandbox"
  });
  ```

  The access-token middleware and payment controller use async/await. The client methods return response objects, so responses should not be passed through `JSON.parse()`.

  ## License

  ISC. See `package.json` for the project license metadata.

  ## Issues

  For issues or suggestions, open an issue in the [GitHub repository](https://github.com/papakowdadson/dadson-momo-stk/issues).