import { RouteController, HTTPRoute, WSRoute, binaryEncoder, binaryDecoder, logger } from '../utils'
import store from '../../store'

const AuthController = new RouteController()

// HTTP Routes
AuthController.http.health = HTTPRoute((res, req) => {
	logger.info(`HTTP --> GET AuthController:HealthCheck requested: ${req.getUrl()}`)
	res.writeStatus('200 OK')
		.writeHeader('HealthCheck', 'Active')
		.end('[FarePlayServer]: HealthCheck successful')
})

AuthController.http.generateNonce = HTTPRoute(async (res, req) => {
	res.onAborted(() => {
		res.aborted = true
	})
	try {
		const publicAddress = req.getHeader('public-address')
		logger.info(`HTTP --> GET AuthController:generateNonce requested: ${req.getUrl()}`)

		const { nonce, signingMessage } = await store.service.user.authPublicAddress(publicAddress)
		const jsonResponse = JSON.stringify({
			nonce,
			signingMessage,
		})
		if (!res.aborted) {
			res.writeStatus('500 Internal Server Error')
				.writeHeader('Content-Type', 'application/json')
				.end(jsonResponse)
		}
	} catch (error) {
		res.writeStatus('500').end(error.toString())
		res.aborted = true
	}

	// res.writeStatus('200 OK')
	// 	.writeHeader('HealthCheck', 'Active')
	// 	.end('[FarePlayServer]: Auth successful')
})

// message SetUserDataRequest {
//     string token = 1;
//     optional string username = 2;
//     optional string email = 3;
//     optional UserColorTheme colorTheme = 4;
// }

// message SetUserDataResponse {
//   string message = 1;
// }

// message GenerateNonceRequest {
//     string publicAddress = 1;
// }

// message GenerateNonceResponse {
//     string nonce = 1;
//     string signingMessage = 2;
// }

// message VerifySignatureRequest {
//     string publicAddress = 1;
//     string signature = 2;
// }

// message VerifySignatureResponse {
//     string token = 1;
// }

// message VerifyTokenRequest {
//     string token = 1;
// }

// message VerifyTokenResponse {
//     string publicAddress = 1;
// }

// message LogoutRequest {
//     string token = 1;
// }

// message LogoutResponse {
//     string message = 1;
// }

export default AuthController
