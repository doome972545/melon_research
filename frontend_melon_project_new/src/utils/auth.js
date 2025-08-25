import Cookies from 'js-cookie';

export const isTokenValid = () => {
    const token = Cookies.get('token');

    if (!token) {
        return false;
    }

    try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        return decoded.exp > currentTime; // Check if token has not expired
    } catch (error) {
        return false;
    }
};
