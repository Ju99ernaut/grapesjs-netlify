import querystring from 'querystring';

export default async function api(token, endpoint, params = {}, opts = {}) {
    const url = `https://api.netlify.com/api/v1/${endpoint}?${querystring.stringify(params)}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            ...opts
        })

        if (response && response.json) {
            const data = await response.json()

            if (response.status === 422) {
                throw new Error(`Error ${JSON.stringify(data)}`)
            }

            return data
        } else {
            return response || {}
        }
    } catch (err) {
        // !LIKELY OPAQUE RESPONSE
        return {}
    }
}