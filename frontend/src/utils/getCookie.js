export default function getCookie(name) {
    const cookies = document.cookie.split(';'); // Split all cookies into an array
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Trim whitespace
        // Check if the cookie starts with the name followed by "="
        if (cookie.startsWith(name + '=')) {
            // Return the value of the cookie (substring after the "=")
            return cookie.substring(name.length + 1);
        }
    }
    // If the cookie is not found, return null
    return null;
}