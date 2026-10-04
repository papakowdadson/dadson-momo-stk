export interface MtnMomoOptions {
	basicAuth: string;
	collectionKey: string;
	baseUrl?: string;
	targetEnvironment?: string;
}

export interface Payer {
	partyId: string;
	partyIdType?: "MSISDN";
}

export interface PaymentRequest {
	amount: string | number;
	externalId: string;
	payer: Payer;
	payerMessage?: string;
	payeeNote?: string;
	accessToken: string;
	currency?: string;
}

export interface PaymentResponse {
	statusCode: number;
	statusText: string;
}

export interface PaymentStatus {
	status: string;
	[key: string]: unknown;
}

export default class MtnMomo {
	constructor(options: MtnMomoOptions);
	createAccessToken(): Promise<Record<string, unknown>>;
	initializePayment(request: PaymentRequest): Promise<PaymentResponse>;
	verifyPayment(request: Pick<PaymentRequest, "externalId" | "accessToken">): Promise<PaymentStatus>;
}
