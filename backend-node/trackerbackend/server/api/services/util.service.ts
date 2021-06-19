import L from '../../common/logger'

class Utils {
    getJwtSecret() {
        const JWT_SECRET = process.env['JWT_SECRET'];
        if (!JWT_SECRET) {
            L.error('No JWT secret string. Set JWT_SECRET environment variable.')
            process.exit(1)
        }
        return JWT_SECRET;
    }
  
}

export const UtilService = new Utils()