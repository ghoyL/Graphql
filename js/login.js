document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.submit');

    submitButton.addEventListener("click", async () => {
        const username = document.querySelector('.usernameLogin').value;
        const password = document.querySelector('.password').value;
        const loginFail = document.querySelector('.loginfail');

        try {
            const token = await userData(username, password);
            console.log("Login successful. Token:", token);
            window.location.href = 'homepage.html';
        } catch (error) {
            console.error('Login failed:', error);
            loginFail.textContent = "Wrong password or username"
        }
    });
});



const userData = async (username, password) =>{
    const userInfo = `${username}:${password}`;
    const encodeInfo = btoa(userInfo)

    const response = await fetch('https://01.kood.tech/api/auth/signin', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodeInfo}`
        }
    })

    if (!response.ok){
        throw new Error('Failed to sign in')
    }

    const data = await response.json()
    localStorage.setItem('jwtToken', data)
    return data
}
