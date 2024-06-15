export function generateReferralCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const timestamp = Date.now().toString();
    const uniqueSuffix = timestamp.slice(-4); // Get the last 4 digits of the current timestamp
    return code + uniqueSuffix;
}