export default class Service {
    handleError(error: unknown) {
        if (error instanceof Error) {
            return Promise.resolve({
                success: false,
                errors: [{
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                }],
            });
        } else {
            return Promise.resolve({
                success: false,
                errors: [{
                    message: i18n.__('Error.Unknown')
                }],
            });
        }
    }
}
