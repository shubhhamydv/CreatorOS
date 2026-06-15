const signup = async () => {
  const email = `testuser${Date.now()}@example.com`
  const res = await fetch('http://localhost:8000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: 'testuser', email, password: 'password123' }),
  })
  const cookies = res.headers.get('set-cookie')
  const data = await res.text()
  return { status: res.status, data, cookies }
}

const getChannel = async (cookie) => {
  const res = await fetch('http://localhost:8000/api/user/getchannel', {
    method: 'GET',
    headers: { cookie },
  })
  return { status: res.status, data: await res.text() }
}

const test = async () => {
  try {
    const signupResult = await signup()
    console.log('SIGNUP', signupResult.status, signupResult.data)
    console.log('COOKIES', signupResult.cookies)
    const cookieHeader = signupResult.cookies ? signupResult.cookies.split(';')[0] : null
    console.log('cookieHeader', cookieHeader)
    const getChannelResult = await getChannel(cookieHeader)
    console.log('GETCHANNEL', getChannelResult.status, getChannelResult.data)
  } catch (err) {
    console.error(err)
  }
}

test()
