exports.utils = {
    baseUrl: 'http://localhost:3000/api/v1',
    subs: { email: 'test@email.com', },
    contact: {
        email: 'contact@email.com', firstName: 'contactFirst',
        lastName: 'contactLast', description: 'testing contact',
        website: null, course: 'Cybersecurity'
    },
    course: {
        name: 'Cybersecurity for beginners', price: 12000,
        description: 'A comprehensive cybersecurity course'
    },
    jsonHeader: { headers: 'application/json' }
}