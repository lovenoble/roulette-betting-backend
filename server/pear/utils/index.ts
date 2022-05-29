// @NOTES Implement service that logs to store
// This utility creates a console.log that passes in dynamic params
// Also, gives more information about where
export default function createLog(
	logPath: string
): [logInfo: (...args: any) => void, logError: (...args: any) => void] {
	function logError(...args: any) {
		console.error(logPath, ...Array.from(args))
	}

	function logInfo(...args: any) {
		console.log(logPath, ...Array.from(args))
	}

	return [logInfo, logError]
}
