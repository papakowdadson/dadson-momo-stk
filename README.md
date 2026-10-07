# dadson-momo-stk

An Express-independent Node.js SDK for MTN Mobile Money Collection in Ghana.

## Installation

```sh
npm install dadson-momo-stk
```

## Usage

The SDK does not start a server or require Express. Create a client with the
MTN credentials from the Developer Portal:

### Initialization
`basicAuth` is the raw base64 credential authorization value.

`basicAuth = base64Encoded(API_USER:API_KEY)`

On macOS or Linux, encode the API user and API key as a single
`API_USER:API_KEY` value:

```sh
echo -n "YOUR_API_USER:YOUR_API_KEY" | base64
```

You can then place the generated value in `.env`:

```dotenv
MTN_BASIC_AUTH=your-base64-encoded-value
MTN_OCP_COLLECTION_KEY=your-collection-key
```

Do not add the `Basic ` prefix when using the raw base64 value above. 

#### Security 
Keep
`.env` out of source control because it contains credentials.

The production Ghana API is used by default. 

```js
const MtnMomo = require("dadson-momo-stk");

const momo = new MtnMomo({
  basicAuth: process.env.MTN_BASIC_AUTH,
  collectionKey: process.env.MTN_OCP_COLLECTION_KEY,
});
```

Configuring a different environment(sandbox) when needed:

```js
const momo = new MtnMomo({
  basicAuth: process.env.MTN_BASIC_AUTH,
  collectionKey: process.env.MTN_OCP_COLLECTION_KEY,
  baseUrl: "https://sandbox.momodeveloper.mtn.com", // Sandbox baseUrl
  targetEnvironment: "sandbox", // Sandbox environment
});
```

### `createAccessToken()`
Returns a promise containing MTN's token response, including `access_token`.

```js
const { access_token: accessToken } = await momo.createAccessToken();
```

### `initializePayment(request)`
Starts a request-to-pay transaction and returns `{ statusCode, statusText }`.
The request requires `amount`, `externalId`, `payer.partyId`, and
`accessToken`. `currency` defaults to `GHS`.

_Note: Sandbox Environment only support `EUR` as currency_

```js
async function collectPayment() {
  const { access_token: accessToken } = await momo.createAccessToken();

  return momo.initializePayment({
    amount: "10",
    externalId: "order-123",
    payer: { partyId: "233XXXXXXXXX" },
    payerMessage: "Payment for order 123",
    payeeNote: "Order 123",
    accessToken,
  });
}
```

### `verifyPayment(request)`

Returns MTN's transaction status response. The request requires `externalId`
and `accessToken`.

```js
async function verifyPayment(externalId) {
  try {
    const { access_token: accessToken } = await momo.createAccessToken();
    const payment = await momo.verifyPayment({
      externalId,
      accessToken,
    });

    // Perform your action based on payment status
    return payment;
  } catch (error) {
    console.error("Unable to verify payment:", error.message);
    throw error;
  }
}

verifyPayment("order-123");
```

## License

This project is licensed under the ISC License.
