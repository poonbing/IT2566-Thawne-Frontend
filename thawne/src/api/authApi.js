import API_CONFIG from "../config/api";

async function loginUser(credentials) {
    return fetch(API_CONFIG.endpoints.login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json());
    }

export { loginUser };