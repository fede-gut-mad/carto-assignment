import { test, expect } from '@playwright/test';

const BASE = process.env.DEMOQA_BASE || 'https://demoqa.com';

function randomUser() {
  return `user_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

test('Get books, generate token, consumen another method', async ({ request }) => {
  const userName = randomUser();
  // Meets DemoQA password rules
  const password = 'P@ssw0rd123!';

  //Create user
  const createRes = await request.post(`${BASE}/Account/v1/User`, {
    data: { userName, password }
  });
  expect(createRes.ok()).toBeTruthy();
  const { userID } = await createRes.json();
  expect(userID).toBeTruthy();

  // Generate token
  const tokenRes = await request.post(`${BASE}/Account/v1/GenerateToken`, {
    data: { userName, password }
  });
  expect(tokenRes.ok()).toBeTruthy();//status 200

  const tokenBody = await tokenRes.json();
  expect(tokenBody.token).toBeTruthy();
  if (tokenBody.status){
    expect(tokenBody.status).toMatch(/success/i);
  } 
  const token:string = tokenBody.token;
  console.log(token);

  // Authorized check
  const authRes = await request.post(`${BASE}/Account/v1/Authorized`, {
    data: { userName, password }
  });
  expect(authRes.status()).toBe(200);
  const authText = await authRes.text();
  expect(authText.toLowerCase()).toContain('true');

  // List books 
  const booksRes = await request.get(`${BASE}/BookStore/v1/Books`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  expect(booksRes.ok()).toBeTruthy();//status 200
  const booksBody = await booksRes.json();
  expect(Array.isArray(booksBody.books)).toBeTruthy();
  console.log(booksBody.books)
  if (booksBody.books.length) {
    expect(booksBody.books[0]).toHaveProperty('isbn');
    expect(booksBody.books[0]).toHaveProperty('title');
  }

  // Cleanup: delete the user 
  const delRes = await request.delete(`${BASE}/Account/v1/User/${userID}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  expect([200, 204, 401, 404]).toContain(delRes.status()); //might get any if these, even 404 not found, so, don't fail the test
});

test('GET user with bad token should produce 401', async ({ request }) => {
  const userName = randomUser();
  const password = 'P@ssw0rd123!';
  const createRes = await request.post(`${BASE}/Account/v1/User`, { data: { userName, password } });
  expect(createRes.ok()).toBeTruthy(); //status 200
  const { userID } = await createRes.json();

  // try to fetch user with an invalid token
  const res = await request.get(`${BASE}/Account/v1/User/${userID}`, {
    headers: { Authorization: 'Bearer not-a-real-token' } //invalid token
  });
  expect(res.status()).toBe(401);

  // clean up
  await request.delete(`${BASE}/Account/v1/User/${userID}`, {
    headers: { Authorization: 'Bearer not-a-real-token' } //invalid token
  });
});
